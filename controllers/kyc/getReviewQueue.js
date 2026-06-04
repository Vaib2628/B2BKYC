const KycDocument = require("../../models/KycDocument");

module.exports = async () => {
    return KycDocument.find({ status: "PENDING" })
        .sort({ createdAt: -1 })
        .populate("businessId", "tradeName legalName")
        .select("-fileUrl -fileName -fileSize -metaData -ocrExtractedData");
};
