const { default: mongoose } = require("mongoose");
const Business = require("../../models/Business");

module.exports = async (businessId) => {
    return Business.find({ _id: { $ne: new mongoose.Types.ObjectId(businessId) }, status: "ACTIVE" }).select(
        "businessName legalName trustScore"
    );
};
