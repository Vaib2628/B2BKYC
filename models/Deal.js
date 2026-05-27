const { default: mongoose } = require("mongoose");

const dealSchema = new mongoose.Schema(
    {
        createdByBusinessId: { type: mongoose.Schema.Types.ObjectId, ref: "business", required: true },
        counterPartyBusinessId: { type: mongoose.Schema.Types.ObjectId, ref: "business", required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        value: { type: Number, required: true },
        status: {
            type: String,
            enum: ["DRAFT", "PENDING_ACCEPTANCE", "ACTIVE", "REJECTED", "CANCELLED", "DISPUTED", "COMPLETED"],
            default: "DRAFT"
        },
        referenceNumber: { type: String, required: true, unique: true },
        initiatorCompletedAt: {type: Date, default: null},
        counterPartyCompletedAt: {type: Date, default: null},
    },
    { timestamps: true }
);

module.exports = mongoose.model("deal", dealSchema);
