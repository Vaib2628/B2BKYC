const { default: mongoose } = require("mongoose");

const dealDisputeSchema = new mongoose.Schema(
    {
        dealId: { type: mongoose.Schema.Types.ObjectId, ref: "deal", required: true },
        raisedByBusinessId: { type: mongoose.Schema.Types.ObjectId, ref: "business", required: true },
        raisedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        resolvedBusinessId: { type: mongoose.Schema.Types.ObjectId, ref: "business" },
        resolvedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        reason: { type: String, trim: true },
        resolutionNote: { type: String, trim: true },
        status: { type: String, enum: ["OPEN", "RESOLVED"], default: "OPEN" },
        raisedAt: { type: Date , default: Date.now},
        resolvedAt: { type: Date }
    },
    { timestamps: true }
);

module.exports = mongoose.model("dealdispute", dealDisputeSchema);
