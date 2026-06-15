const createHttpError = require("http-errors");
const Deal = require("../../models/Deal");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const createDealTimeline = require("../../services/createDealTimeline");
const { dealTimelineEvent, trustHistoryEvents } = require("../../constants/constants");
const createAuditLog = require("../../services/createAuditLog");
const updateTrustScore = require("../../services/trustscore/updateTrustScore");
const createNotification = require("../../services/createNotification");

module.exports = async ({ user, dealId }) => {
    const deal = await Deal.findById(dealId).populate("counterPartyBusinessId", "tradeName");
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
        description: `${deal.counterPartyBusinessId.tradeName} rejected the deal`
    });

    await updateTrustScore({
        businessId: user.businessId,
        event: trustHistoryEvents.DEAL_REJECTED,
        reason: `Rejected the deal with ${deal.counterPartyBusinessId.tradeName}`,
        user
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

    await createNotification({
        businessId: deal.createdByBusinessId,
        type: "DEAL_REJECTED",
        title: "Deal Rejected",
        message: `${deal.counterPartyBusinessId.tradeName} rejected your deal request.`,
        targetPermission: "deal.read",
        entityType: "DEAL",
        entityId: deal._id
    });

    return {
        dealId: deal._id
    };
};
