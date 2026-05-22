const createHttpError = require("http-errors");
const KycDocument = require("../../models/KycDocument");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const Business = require("../../models/Business");

module.exports = async ({ documentId, user, forceVerify }) => {
    const document = await KycDocument.findById(documentId);
    if (!document) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DOC_NOT_FOUND);

    const isVerifiable = document.status !== "VERIFIED";
    if (!isVerifiable) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.DOC_ALREADY_PROCESSED);

    document.status = "VERIFIED";
    document.verifiedBy = user._id;
    document.verifiedAt = new Date();
    document.isActive = true;

    const business = await Business.findById(document.businessId);

    // Checking for the conflicts
    let conflictFields = ["legalName", "tradeName", "companyType", "panNumber", "registeredAddress"];
    const warnings = checkMismatch(conflictFields, business, document);

    if (warnings.length && !forceVerify) {
        return {
            requiresConfirmation: true,
            warnings
        };
    }
    if (!business.bankDetails) {
        business.bankDetails = {};
    }
    
    switch (document.documentType) {
        case "GST_CERTIFICATE":
            business.gstNumber = document.metaData.gstNumber;
            business.legalName = document.metaData.legalName;
            business.panNumber = document.metaData.panNumber;
            business.tradeName = document.metaData.tradeName;
            business.companyType = document.metaData.companyType;
            business.registeredAddress = document.metaData.registeredAddress;
            break;

        case "PAN_CARD":
            business.panNumber = document.metaData.panNumber;
            break;

        case "INCORPORATION_CERTIFICATE":
            business.cinNumber = document.metaData.cinNumber;
            break;

        case "BANK_PROOF":
            business.bankDetails.accountHolderName = document.metaData.accountHolderName;
            business.bankDetails.accountNumber = document.metaData.accountNumber;
            business.bankDetails.ifscCode = document.metaData.ifscCode;
            business.bankDetails.accountType = document.metaData.accountType;
    }

    await document.save();
    if (document.replaceDocumentId) {
        await KycDocument.findByIdAndUpdate(document.replaceDocumentId, { isActive: false });
    }

    // calculating the verified documents count to update the status
    const verifiedDocumentsCount = await KycDocument.countDocuments({
        businessId: business._id,
        status: "VERIFIED",
        isActive: true
    });

    if (verifiedDocumentsCount === 4) business.kycStatus = "VERIFIED";
    else business.kycStatus = "PARTIALLY_VERIFIED";

    await business.save();

    return {
        _id: documentId
    };
};

const normalize = (value = "") =>
    String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .trim();

const checkMismatch = (conflictFields = [], business, document) => {
    return conflictFields
        .map((field) => {
            if (
                business[field]
                && document.metaData[field]
                && normalize(business[field]) !== normalize(document.metaData[field])
            ) {
                return {
                    field: `${field}`,
                    message: `${field} mismatch identified`
                };
            }
        })
        .filter(Boolean);
};
