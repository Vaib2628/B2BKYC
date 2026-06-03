const createHttpError = require("http-errors");
const Deal = require("../../models/Deal");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const { dealTimelineEvent, trustHistoryEvents } = require("../../constants/constants");
const createAuditLog = require("../../services/createAuditLog");
const createDealTimeline = require("../../services/createDealTimeline");
const updateTrustScore = require("../../services/trustscore/updateTrustScore");

module.exports = async ({ user, dealId }) => {
    const deal = await Deal.findById(dealId)
        .populate("counterPartyBusinessId", "legalName tradeName")
        .populate("createdByBusinessId", "legalName tradeName");
    if (!deal) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DEAL_NOT_FOUND);

    const hasScope =
        deal.createdByBusinessId._id.equals(user.businessId) || deal.counterPartyBusinessId._id.equals(user.businessId);

    if (!hasScope) throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.DEAL_ACCESS_DENIED);

    const isInitiator = deal.createdByBusinessId._id.equals(user.businessId);

    const isCompletable =
        deal.status === "ACTIVE"
        && (isInitiator ? deal.initiatorCompletedAt === null : deal.counterPartyCompletedAt === null);
    if (!isCompletable) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.DEAL_CANNOT_BE_COMPLETED);

    const now = new Date();
    deal[isInitiator ? "initiatorCompletedAt" : "counterPartyCompletedAt"] = now;

    const previousState = deal.status;
    const mutuallyCompleted = deal.initiatorCompletedAt !== null && deal.counterPartyCompletedAt !== null;
    if (mutuallyCompleted) deal.status = "COMPLETED";

    await deal.save();

    await createDealTimeline({
        dealId,
        businessId: user.businessId,
        actorId: user._id,
        previousState: previousState,
        currentState: deal.status,
        event:
            deal.status === "COMPLETED"
                ? dealTimelineEvent.DEAL_COMPLETED
                : dealTimelineEvent.DEAL_COMPLETION_CONFIRMED,
        description:
            deal.status === "COMPLETED"
                ? `Deal completed successfully by both parties`
                : `${deal[isInitiator ? "createdByBusinessId" : "counterPartyBusinessId"].tradeName} completed the deal`
    });

    await updateTrustScore({
        businessId: user.businessId,
        event: trustHistoryEvents.DEAL_COMPLETED,
        reason: `Completed the deal ${deal.title}`,
        user
    });

    await createAuditLog({
        actorId: user._id,
        businessId: user.businessId,
        module: "DEAL",
        action: "DEAL_COMPLETED",
        entityType: "deal",
        entityId: deal._id,
        description: "Deal completed",
        previousData: {
            status: previousState
        },
        currentData: {
            status: deal.status
        },
        metadata: {
            referenceNumber: deal.referenceNumber
        }
    });

    return {
        dealId: deal._id
    };
};
