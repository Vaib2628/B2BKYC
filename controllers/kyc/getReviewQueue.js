const KycDocument = require("../../models/KycDocument");
const paginate = require("../../utils/paginate")

module.exports = async (options) => {
    return paginate({
        model: KycDocument,
        filter: { status: "PENDING" },
        options,
        sort: { createdAt: -1 },
        populate: { path: "businessId", select: "tradeName legalName" },
        select: "-fileUrl -fileName -fileSize -metaData -ocrExtractedData"
    });
};
