const createHttpError = require("http-errors");
const Deal = require("../../models/Deal");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const DealTimeline = require("../../models/DealTimeline");

module.exports = async ({ user, dealId }) => {
    const deal = await Deal.findById(dealId);
    if (!deal) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DEAL_NOT_FOUND);

    const hasScope =
        deal.counterPartyBusinessId.equals(user.businessId) || deal.createdByBusinessId.equals(user.businessId);

    if (!hasScope) throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);

    const dealTimeline = await DealTimeline.find({ dealId });

    return { deal, dealTimeline };
};
