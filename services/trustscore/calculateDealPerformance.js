const normalizeScore = require("../../helpers/normalizeScore");

module.exports = ({ totalDeals, completedDeals, disputesAgainst, resolvedDisputes, businessId, weight, config }) => {
    const confidenceFactor = totalDeals / (totalDeals + 50);
    const completionRatio = completedDeals / totalDeals;
    const disputesRatio = disputesAgainst / totalDeals;
    const resolutionRatio = disputesAgainst ? resolvedDisputes / disputesAgainst : 1;

    const score =
        completionRatio * config.completionRatioWeight
        - disputesRatio * config.disputeRatioWeight
        + resolutionRatio * config.resolutionRatioWeight;

    const finalScore = score * (0.5 + 0.5 * confidenceFactor);

    return normalizeScore({
        score: finalScore * weight,
        weight
    });
};
