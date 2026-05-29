const TrustScoreHistory = require("../../models/TrustScoreHistory");

module.exports = async (data) => {
    console.log(data)
    const previousScore = data.previousBreakdown.overall;
    const newScore = data.currentBreakdown.overall;
    const scoreDifference = Number((newScore - previousScore).toFixed(2));

    const hasScoreChanged = data.previousBreakdown !== data.currentBreakdown;
    if (!hasScoreChanged) return null;
    return TrustScoreHistory.create({ ...data, previousScore, newScore, scoreDifference });
};
