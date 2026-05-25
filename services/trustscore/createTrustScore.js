const createHttpError = require("http-errors");
const { ERROR_MESSAGES, STATUS_CODES } = require("../../constants/errorConstants");
const Business = require("../../models/Business");
const KycDocument = require("../../models/KycDocument");
const calculateKycScore = require("./calculateKycScore");
const calculateCompliance = require("./calculateCompliance");
const calculateActivity = require("./calculateActivity");
const calculateDealPerformance = require("./calculateDealPerformance");
const TrustScore = require("../../models/TrustScore");
const createTrustHistory = require("../../controllers/trustScoreHistory/createTrustHistory");
const config = require("../../constants/constants").trustScoreConfig;

module.exports = async ({ businessId, event, reason, user }) => {
    const business = await Business.findById(businessId);
    if (!business) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.BUSINESS_NOT_FOUND);

    const documents = await KycDocument.find({ businessId });
    const kycScore = calculateKycScore({
        documents,
        weight: config.weights.kyc,
        requiredDocument: config.REQUIRED_KYC_DOCUMENT
    });
    const complianceScore = calculateCompliance({ documents, weight: config.weights.compliance });
    const activityScore = calculateActivity({ business, weight: config.weights.activity });
    const dealPerformanceScore = calculateDealPerformance({ deals: [], weight: config.weights.dealPerformance });
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
