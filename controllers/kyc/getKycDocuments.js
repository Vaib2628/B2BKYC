const KycDocument = require("../../models/KycDocument");

module.exports = async (user) => {
    return KycDocument.find({
        businessId: user.businessId,
        isActive: true
    })
        .select(
            `
        documentType
        status
        fileName
        fileSize
        fileUrl
        rejectionReason
        metaData
        expiresAt
        createdAt
        verifiedAt
    `
        )
        .sort({ createdAt: -1 });
};
