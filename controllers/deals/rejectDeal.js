const createHttpError = require("http-errors");
const Deal = require("../../models/Deal");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const createDealTimeline = require("../../services/createDealTimeline");
const { dealTimelineEvent } = require("../../constants/constants");
const createAuditLog = require("../../services/createAuditLog");

module.exports = async ({ user, dealId }) => {
    const deal = await Deal.findById(dealId).populate("counterPartyBusinessId", "legalName");
    if (!deal) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DEAL_NOT_FOUND);

    const hasScope = deal.counterPartyBusinessId._id.equals(user.businessId);
    if (!hasScope) throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ONLY_COUNTERPARTY_CAN_REJECT_DEAL);

    if (deal.status !== "PENDING_ACCEPTANCE")
        throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.DEAL_CANNOT_BE_REJECTED);

    deal.status = "REJECTED";
    await deal.save();

    await createDealTimeline({
        dealId,
        businessId: user.businessId,
        actorId: user._id,
        previousState: "PENDING_ACCEPTANCE",
        currentState: "REJECTED",
        event: dealTimelineEvent.DEAL_REJECTED,
        description: `${deal.counterPartyBusinessId.legalName} rejected the ${deal.title} deal`
    });

    await createAuditLog({
        actorId: user._id,
        businessId: user.businessId,
        module: "DEAL",
        action: "DEAL_REJECTED",
        entityType: "deal",
        entityId: deal._id,
        description: "Deal rejected successfully",
        previousData: {
            status: "PENDING_ACCEPTANCE"
        },
        currentData: {
            status: "REJECTED"
        },
        metadata: {
            referenceNumber: deal.referenceNumber
        }
    });

    return {
        dealId: deal._id
    };
};
