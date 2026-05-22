const { default: mongoose } = require("mongoose");

const trustScoreSchema = new mongoose.Schema(
    {
        overall: { type: Number, default: 0, max: 100 },
        kycScore: { type: Number, default: 0 },
        complianceScore: { type: Number, default: 0 },
        dealPerformanceScore: { type: Number, default: 0 },
        activityScore: { type: Number, default: 0 }
    },
    { _id: false }
);

module.exports = trustScoreSchema;
