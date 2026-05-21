const { default: mongoose } = require("mongoose");

const membershipSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        businessId: { type: mongoose.Schema.Types.ObjectId, ref: "business" },
        roleId: { type: mongoose.Schema.Types.ObjectId, ref: "role", required: true },
        status: { type: String, enum: ["ACTIVE", "INVITED", "SUSPENDED", "REMOVED"], default: "ACTIVE" },
        scope: { type: String, enum: ["SYSTEM", "BUSINESS"], default: "BUSINESS" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("membership", membershipSchema);
