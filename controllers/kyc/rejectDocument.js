const createHttpError = require("http-errors");
const KycDocument = require("../../models/KycDocument");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const Business = require("../../models/Business");

module.exports = async ({ documentId, user, data }) => {
    const document = await KycDocument.findById(documentId);
    if (!document) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DOC_NOT_FOUND);

    const hasScope = document.status === "PENDING";
    if (!hasScope) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.DOC_ALREADY_PROCESSED);

    document.status = "REJECTED";
    document.verifiedBy = user._id;
    document.verifiedAt = new Date();

    if (document.replaceDocumentId) {
        document.isActive = false;
    } else {
        document.isActive = true;
    }

    await document.save();

    const business = await Business.findById(document.businessId);

    const activeDocs = await KycDocument.find({
        businessId: document.businessId,
        isActive: true
    });

    const statuses = activeDocs.map((doc) => doc.status);
    if (statuses.includes("REJECTED")) {
        business.kycStatus = "REJECTED";
    }

    // All required documents verified
    else if (documents.length === 4 && statuses.every((status) => status === "VERIFIED")) {
        business.kycStatus = "VERIFIED";
    }

    // Some verified and some pending
    else if (statuses.includes("VERIFIED")) {
        business.kycStatus = "PARTIALLY_VERIFIED";
    }

    await business.save();

    return {
        _id: document._id
    };
};
