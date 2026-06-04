const createHttpError = require("http-errors");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const Deal = require("../../models/Deal");
const createAuditLog = require("../../services/createAuditLog");
const createDealTimeline = require("../../services/createDealTimeline");
const { dealTimelineEvent, trustHistoryEvents } = require("../../constants/constants");
const updateTrustScore = require("../../services/trustscore/updateTrustScore");

module.exports = async ({ user, dealId }) => {
    const deal = await Deal.findById(dealId).populate("createdByBusinessId", "legalName");
    if (!deal) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DEAL_NOT_FOUND);

    const hasScope = deal.createdByBusinessId._id.equals(user.businessId);
    if (!hasScope) throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ONLY_INITIATOR_CAN_CANCEL_DEAL);

    if (!["DRAFT", "PENDING_ACCEPTANCE"].includes(deal.status))
        throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.DEAL_CANNOT_BE_CANCELLED);

    await createDealTimeline({
        dealId,
        businessId: user.businessId,
        actorId: user._id,
        previousState: deal.status,
        currentState: "CANCELLED",
        event: dealTimelineEvent.DEAL_CANCELLED,
        description: `${deal.createdByBusinessId.legalName} cancelled the deal`
    });

    await updateTrustScore({
        businessId: user.businessId,
        event: trustHistoryEvents.DEAL_CANCELLED,
        reason: `Cancelled the ${deal.title} deal`,
        user
    });

    await createAuditLog({
        actorId: user._id,
        businessId: user.businessId,
        module: "DEAL",
        action: "DEAL_CANCELLED",
        entityType: "deal",
        entityId: deal._id,
        description: "Deal cancelled",
        previousData: {
            status: deal.status
        },
        currentData: {
            status: "CANCELLED"
        },
        metadata: {
            referenceNumber: deal.referenceNumber
        }
    });

    deal.status = "CANCELLED";
    await deal.save();

    return {
        dealId: deal._id
    };
};
