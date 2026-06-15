const createHttpError = require("http-errors");
const KycDocument = require("../../models/KycDocument");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const Business = require("../../models/Business");
const updateTrustScore = require("../../services/trustscore/updateTrustScore");
const { trustHistoryEvents } = require("../../constants/constants");
const createAuditLog = require("../../services/createAuditLog");
const createNotification = require("../../services/createNotification");

module.exports = async ({ documentId, user, data }) => {
    const document = await KycDocument.findById(documentId);
    if (!document) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DOC_NOT_FOUND);

    const hasScope = document.status === "PENDING";
    if (!hasScope) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.DOC_ALREADY_PROCESSED);

    document.status = "REJECTED";
    document.rejectionReason = data.rejectionReason;
    document.verifiedBy = user._id;
    document.verifiedAt = new Date();

    if (document.replaceDocumentId) {
        document.isActive = false;
    } else {
        document.isActive = true;
    }

    await document.save();

    const business = await Business.findById(document.businessId);
    if (!business) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.BUSINESS_NOT_FOUND);

    const activeDocs = await KycDocument.find({
        businessId: document.businessId,
        isActive: true
    });

    const statuses = activeDocs.map((doc) => doc.status);

    const hasRejected = statuses.includes("REJECTED");
    const verifiedCount = statuses.filter((status) => status === "VERIFIED").length;

    if (activeDocs.length === 4 && verifiedCount === 4) {
        business.kycStatus = "VERIFIED";
    } else if (hasRejected) {
        business.kycStatus = "ACTION_REQUIRED";
    } else if (verifiedCount > 0) {
        business.kycStatus = "PARTIALLY_VERIFIED";
    } else if (activeDocs.length === 4) {
        business.kycStatus = "UNDER_REVIEW";
    } else {
        business.kycStatus = "PENDING_DOCUMENTS";
    }

    await business.save();

    // Update trust score
    await updateTrustScore({
        businessId: document.businessId,
        event: trustHistoryEvents.KYC_DOCUMENT_REJECTED,
        reason: data.rejectionReason,
        user
    });

    // Create audit log
    await createAuditLog({
        actorId: user._id,
        businessId: document.businessId,
        module: "KYC",
        action: "DOCUMENT_REJECTED",
        entityType: "kyc_document",
        entityId: document._id,
        description: `${document.documentType} document rejected`,
        previousData: {
            status: "PENDING"
        },
        currentData: {
            status: "REJECTED",
            rejectionReason: data.rejectionReason
        },
        metadata: {
            documentType: document.documentType,
            version: document.version,
            fileName: document.fileName
        }
    });

    await createNotification({
        businessId: document.businessId,
        type: "KYC_REJECTED",
        title: "KYC Document Rejected",
        message: `${document.documentType} was rejected. Please review and re-upload.`,
        targetPermission: "kyc.read",
        entityType: "KYC_DOCUMENT",
        entityId: document._id,
        metadata: {
            rejectionReason: document.rejectionReason
        }
    });

    return {
        _id: document._id
    };
};
