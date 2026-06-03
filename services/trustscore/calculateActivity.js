const normalizeScore = require("../../helpers/normalizeScore");

module.exports = ({ business, recentActivityDeals, activeDeals, weight, config }) => {
    let score = 0;
    if (business.status === "ACTIVE") {
        score += config.businessStatusRatio;
    }
    if (["VERIFIED", "REQUIRES_RENEWAL"].includes(business.kycStatus)) {
        score += config.kycStatusRatio;
    }

    const activityRatio = Math.min(recentActivityDeals / config.recentDealActivityThreshold, 1);
    score += activityRatio * config.recentDealActivityRatio;

    return normalizeScore({
        score: score * weight,
        weight
    });
};
