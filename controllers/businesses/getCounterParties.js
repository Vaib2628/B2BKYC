const { default: mongoose } = require("mongoose");
const Business = require("../../models/Business");
const paginate = require("../../utils/paginate");

module.exports = async ({ businessId, options }) => {
    return paginate({
        model: Business,
        filter: {
            _id: { $ne: new mongoose.Types.ObjectId(businessId) },
            status: "ACTIVE",
            kycStatus: { $in: ["VERIFIED", "REQUIRES_RENEWAL"] }
        },
        options,
        select: "tradeName legalName trustScore kycStatus registeredAddress.city registeredAddress.country industry"
    });
};
