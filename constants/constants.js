module.exports = {
    EMAIL_VERIFICATION_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
    RESET_TOKEN_EXPIRY: 1 * 60 * 60 * 1000, // 1 hour
    ACCESS_TOKEN_EXPIRY: "10m",
    REFRESH_TOKEN_EXPIRY: "7d",

    trustScoreConfig: {
        REQUIRED_KYC_DOCUMENT: 4,

        weights: {
            kyc: 40,
            compliance: 20,
            dealPerformance: 30,
            activity: 10
        },

        activity: {
            businessStatusRatio: 0.4,
            kycStatusRatio: 0.3,
            recentDealActivityRatio: 0.3,
            recentDealActivityThreshold: 10
        },

        dealPerformance: {
            completionRatioWeight: 0.6,
            disputeRatioWeight: 0.3,
            resolutionRatioWeight: 0.1
        },

        badges: [
            { min: 90, value: "ELITE" },
            { min: 75, value: "TRUSTED" },
            { min: 50, value: "VERIFIED" },
            { min: 25, value: "BASIC" }
        ]
    },

    trustHistoryEvents: {
        KYC_DOCUMENT_VERIFIED: "KYC_DOCUMENT_VERIFIED",
        KYC_DOCUMENT_REJECTED: "KYC_DOCUMENT_REJECTED",
        KYC_DOCUMENT_REUPLOADED: "KYC_DOCUMENT_REUPLOADED",
        KYC_DOCUMENT_EXPIRED: "KYC_DOCUMENT_EXPIRED"
    },

    dealTimelineEvent: {
        DEAL_CREATED: "DEAL_CREATED",
        DEAL_ACCEPTED: "DEAL_ACCEPTED",
        DEAL_REJECTED: "DEAL_REJECTED",
        DEAL_UPDATED: "DEAL_UPDATED",
        DEAL_COMPLETED: "DEAL_COMPLETED",
        DEAL_DISPUTED: "DEAL_DISPUTED",
        DEAL_COMPLETION_CONFIRMED: "DEAL_COMPLETION_CONFIRMED",
        DEAL_DISPUTE_RESOLVED: "DEAL_DISPUTE_RESOLVED",
        DEAL_CANCELLED: "DEAL_CANCELLED"
    }
};
