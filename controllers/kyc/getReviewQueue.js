const KycDocument = require("../../models/KycDocument");

module.exports = async () => {
    return KycDocument.find({ status: "PENDING" })
        .sort({ createdAt: -1 })
        .select("-fileUrl -fileName -fileSize -metaData -ocrExtractedData");
};
