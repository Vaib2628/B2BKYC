const { default: mongoose } = require("mongoose");
const Business = require("../../models/Business");

module.exports = async (businessId) => {
    return Business.find({
        _id: { $ne: new mongoose.Types.ObjectId(businessId) },
        status: "ACTIVE",
        kycStatus: { $in: ["VERIFIED", "REQUIRES_RENEWAL"] }
    }).select("businessName tradeName legalName trustScore");
};
