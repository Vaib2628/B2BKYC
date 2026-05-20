const Business = require("../../models/Business");
const KycDocument = require("../../models/KycDocument");

module.exports = async (businessId) => {
    const business = await Business.findById(businessId);

    const uploadedDocuments = await KycDocument.find({
        businessId: businessId,
        isActive: true
    });

    const requiredDocuments = ["GST_CERTIFICATE", "PAN_CARD", "INCORPORATION_CERTIFICATE", "BANK_PROOF"];

    const documents = requiredDocuments.map((type) => {
        const document = uploadedDocuments.find((doc) => doc.documentType === type);

        return {
            type,
            isUploaded: !!document,
            status: document?.status || null,
            rejectionReason: document?.rejectionReason || null,
            uploadedAt: document?.createdAt || null,
            verifiedAt: document?.verifiedAt || null,
            expiresAt: document?.expiresAt || null,
            file: document
                ? {
                      name: document.fileName,
                      url: document.fileUrl,
                      size: document.fileSize
                  }
                : null,
            metaData: document?.metaData || null,
            ocrExtractedData: document?.ocrExtractedData || null
        };
    });

    const uploadedDocumentsCount = documents.filter((doc) => doc.isUploaded).length;
    const verifiedDocumentsCount = documents.filter((doc) => doc.status === "VERIFIED").length;
    const pendingDocumentsCount = documents.filter((doc) => doc.status === "PENDING").length;
    const rejectedDocumentsCount = documents.filter((doc) => doc.status === "REJECTED").length;

    return {
        summary: {
            totalRequiredDocuments: requiredDocuments.length,
            uploadedDocuments: uploadedDocumentsCount,
            verifiedDocuments: verifiedDocumentsCount,
            pendingDocuments: pendingDocumentsCount,
            rejectedDocuments: rejectedDocumentsCount,
            remainingDocuments: requiredDocuments.length - uploadedDocumentsCount
        },
        documents
    };
};
