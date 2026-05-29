module.exports = ({ business, activeDeals, weight, config }) => {
    let score = 0;
    if (business.status === "ACTIVE") {
        normalizedScore += config.businessStatusRatio;
    }
    if (["VERIFIED", "REQUIRES_RENEWAL"].includes(business.kycStatus)) {
        normalizedScore += config.kycStatusRatio;
    }

    const activityRatio = Math.min(recentDeals.length / config.recentDealActivityThreshold, 1);
    normalizedScore += activityRatio * config.recentDealActivityRatio;

    return Math.round(normalizedScore * weight);
};
