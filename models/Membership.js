const { default: mongoose } = require("mongoose");

const membershipSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        businessId: { type: mongoose.Schema.Types.ObjectId, ref: "business", required: true },
        roleId: { type: mongoose.Schema.Types.ObjectId, ref: "role", required: true },
        status: { type: String, enum: ["ACTIVE", "INVITED", "SUSPENDED", "REMOVED"], default: "ACTIVE" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("membership", membershipSchema);
