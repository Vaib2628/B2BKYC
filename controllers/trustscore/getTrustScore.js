const createHttpError = require("http-errors");
const Business = require("../../models/Business");
const TrustScoreHistory = require("../../models/TrustScoreHistory")
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ businessId }) => {
    const business = await Business.findById(businessId);
    if (!business) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.BUSINESS_NOT_FOUND)

    const trustScoreHistory = await TrustScoreHistory.find({businessId}).select({businessId: 0, _id: 0}).sort({createdAt: 1});
    return {
        trustScore: business.trustScore,
        history: trustScoreHistory
    }
};
