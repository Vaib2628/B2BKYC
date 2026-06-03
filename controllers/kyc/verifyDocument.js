const createHttpError = require("http-errors");
const KycDocument = require("../../models/KycDocument");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const Business = require("../../models/Business");
const updateTrustScore = require("../../services/trustscore/updateTrustScore");
const { trustHistoryEvents } = require("../../constants/constants");
const { default: mongoose } = require("mongoose");
const createAuditLog = require("../../services/createAuditLog");

module.exports = async ({ documentId, user, forceVerify }) => {
    const document = await KycDocument.findById(documentId);
    if (!document) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DOC_NOT_FOUND);

    const isVerifiable = document.status !== "PENDING";
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

    let isExists = null;
    switch (document.documentType) {
        case "GST_CERTIFICATE":
            isExists = await Business.findOne({
                gstNumber: document.metaData.gstNumber,
                _id: { $ne: document.businessId }
            });
            if (isExists) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.GST_ALREADY_LINKED);
            business.gstNumber = document.metaData.gstNumber;
            business.legalName = document.metaData.legalName;
            business.tradeName = document.metaData.tradeName;
            business.companyType = document.metaData.companyType;
            business.registeredAddress = document.metaData.registeredAddress;
            break;

        case "PAN_CARD":
            isExists = await Business.findOne({
                panNumber: document.metaData.panNumber,
                _id: { $ne: document.businessId }
            });
            if (isExists) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.PAN_ALREADY_LINKED);
            business.panNumber = document.metaData.panNumber;
            break;

        case "INCORPORATION_CERTIFICATE":
            isExists = await Business.findOne({
                cinNumber: document.metaData.cinNumber,
                _id: { $ne: document.businessId }
            });
            if (isExists) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.CIN_ALREADY_LINKED);
            business.cinNumber = document.metaData.cinNumber;
            break;

        case "BANK_PROOF":
            business.bankDetails.accountHolderName = document.metaData.accountHolderName;
            business.bankDetails.accountNumber = document.metaData.accountNumber;
            business.bankDetails.ifscCode = document.metaData.ifscCode;
            business.bankDetails.accountType = document.metaData.accountType;
    }

    if (document.replaceDocumentId) {
        await KycDocument.findByIdAndUpdate(document.replaceDocumentId, { isActive: false });
        document.isActive = true;
    }
    await document.save();

    // calculating the verified documents count to update the status
    const verifiedDocumentsCount = await KycDocument.countDocuments({
        businessId: business._id,
        status: "VERIFIED",
        isActive: true
    });

    if (verifiedDocumentsCount === 4) business.kycStatus = "VERIFIED";
    else business.kycStatus = "PARTIALLY_VERIFIED";

    await business.save();

    // calling the trustScore service
    await updateTrustScore({
        businessId: business._id,
        event: trustHistoryEvents.KYC_DOCUMENT_VERIFIED,
        reason: "KYC document verified",
        user
    });

    await createAuditLog({
        actorId: user._id,
        businessId: document.businessId,
        module: "KYC",
        action: "DOCUMENT_VERIFIED",
        entityType: "kyc_document",
        entityId: document._id,
        description: `${document.documentType} document verified`,
        previousData: {
            status: "PENDING"
        },
        currentData: {
            status: "VERIFIED"
        },
        metadata: {
            documentType: document.documentType,
            version: document.version,
            fileName: document.fileName
        }
    });

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
