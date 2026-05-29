const createHttpError = require("http-errors");
const { ERROR_MESSAGES, STATUS_CODES } = require("../../constants/errorConstants");
const Business = require("../../models/Business");
const KycDocument = require("../../models/KycDocument");
const TrustScore = require("../../models/TrustScore");
const Deal = require("../../models/Deal");
const DealDispute = require("../../models/DealDispute");
const calculateKycScore = require("./calculateKycScore");
const calculateCompliance = require("./calculateCompliance");
const calculateActivity = require("./calculateActivity");
const calculateDealPerformance = require("./calculateDealPerformance");
const createTrustHistory = require("../../controllers/trustScoreHistory/createTrustHistory");
const config = require("../../constants/constants").trustScoreConfig;

module.exports = async ({ businessId, event, reason, user }) => {
    const [business, documents] = await Promise.all([
        Business.findById(businessId).lean(),
        KycDocument.find({ businessId }).lean()
    ]);

    const dealBaseFilter = {
        $or: [{ createdByBusinessId: businessId }, { counterPartyBusinessId: businessId }]
    };

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const [totalDeals, completedDeals, activeDeals, recentActivityDeals] = await Promise.all([
        Deal.countDocuments({
            ...dealFilter,
            status: {
                $in: ["ACTIVE", "COMPLETED", "CANCELLED", "DISPUTED"]
            }
        }),
        Deal.countDocuments({ ...dealFilter, status: "COMPLETED" }),
        Deal.countDocuments({ ...dealFilter, status: "ACTIVE" }),
        Deal.countDocuments({
            ...dealFilter,
            status: {
                $in: ["ACTIVE", "COMPLETED", "DISPUTED"]
            },
            createdAt: {
                $gte: ninetyDaysAgo
            }
        })
    ]);

    const [disputesRaised, disputesAgainst, resolvedDisputes] = await Promise.all([
        DealDispute.countDocuments({ raisedByBusinessId: businessId }),
        DealDispute.countDocuments({ againstBusinessId: businessId }),
        DealDispute.countDocuments({ againstBusinessId: businessId, status: "RESOLVED" })
    ]);

    const kycScore = calculateKycScore({
        documents,
        weight: config.weights.kyc,
        requiredDocument: config.REQUIRED_KYC_DOCUMENT
    });
    const complianceScore = calculateCompliance({ documents, weight: config.weights.compliance });
    const activityScore = calculateActivity({ activeDeals, business, config, weight: config.weights.activity });
    const dealPerformanceScore = calculateDealPerformance({
        completedDeals,
        disputesAgainst,
        resolvedDisputes,
        totalDeals,
        businessId,
        weight: config.weights.dealPerformance,
        config: config.dealPerformance
    });
    const overall = kycScore + complianceScore + activityScore + dealPerformanceScore;

    const newTrustScore = { overall, kycScore, complianceScore, dealPerformanceScore, activityScore };

    await createTrustHistory({
        businessId,
        previousBreakdown: business.trustScore,
        currentBreakdown: newTrustScore,
        event,
        reason,
        triggeredBy: user ? user._id : null
    });

    business.trustScore = newTrustScore;
    await business.save();

    return true;
};
