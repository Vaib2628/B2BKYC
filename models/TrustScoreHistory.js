const { default: mongoose } = require("mongoose");
const trustScoreSchema = require("./TrustScore");

const trustScoreHistorySchema = new mongoose.Schema(
    {
        businessId: { type: mongoose.Schema.Types.ObjectId, ref: "business", required: true },
        triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null },
        event: { type: String, required: true },
        reason: { type: String, required: true },
        previousScore: { type: Number, required: true },
        newScore: { type: Number, required: true },
        scoreDifference: { type: Number, required: true },
        previousBreakdown: { type: trustScoreSchema, required: true },
        currentBreakdown: { type: trustScoreSchema, required: true }
    },
    {
        timestamps: true
    }
);

trustScoreHistorySchema.index({
    businessId: 1,
    createdAt: -1
});

module.exports = mongoose.model("TrustScoreHistory", trustScoreHistorySchema);
