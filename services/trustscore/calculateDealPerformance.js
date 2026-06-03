const normalizeScore = require("../../helpers/normalizeScore");

module.exports = ({ totalDeals, completedDeals, disputesAgainst, resolvedDisputes, businessId, weight, config }) => {
    const completionRatio = completedDeals / totalDeals;
    const disputesRatio = disputesAgainst / totalDeals;
    const resolutionRatio = disputesAgainst ? resolvedDisputes / totalDeals : 1;

    const score =
        completionRatio * config.completionRatioWeight
        + disputesRatio * config.disputeRatioWeight
        + resolutionRatio * config.resolutionRatioWeight;

    return normalizeScore({
        score: score * weight,
        weight
    });
};
