const createHttpError = require("http-errors");
const Deal = require("../../models/Deal");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const createDealTimeline = require("../../services/createDealTimeline");
const { dealTimelineEvent, trustHistoryEvents } = require("../../constants/constants");
const createAuditLog = require("../../services/createAuditLog");
const updateTrustScore = require("../../services/trustscore/updateTrustScore");

module.exports = async ({ user, dealId }) => {
    const deal = await Deal.findById(dealId).populate("counterPartyBusinessId", "legalName");
    if (!deal) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DEAL_NOT_FOUND);

    const hasScope = deal.counterPartyBusinessId._id.equals(user.businessId);
    if (!hasScope) throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ONLY_COUNTERPARTY_CAN_ACCEPT_DEAL);

    if (deal.status != "PENDING_ACCEPTANCE")
        throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.DEAL_ALREADY_ACCEPTED);

    deal.status = "ACTIVE";
    await deal.save();

    await createDealTimeline({
        dealId,
        actorId: user._id,
        businessId: deal.counterPartyBusinessId,
        currentState: "DRAFT",
        previousState: "PENDING_ACCEPTANCE",
        event: dealTimelineEvent.DEAL_ACCEPTED,
        description: `${deal.counterPartyBusinessId.legalName} accepted the deal`
    });

    await updateTrustScore({
        businessId: user.businessId,
        event: trustHistoryEvents.DEAL_ACCEPTED,
        reason: `Accepted the deal ${deal.title}`,
        user
    });
    
    await createAuditLog({
        actorId: user._id,
        businessId: user.businessId,
        module: "DEAL",
        action: "DEAL_ACCEPTED",
        entityType: "deal",
        entityId: deal._id,
        description: "Deal accepted",
        previousData: {
            status: "PENDING_ACCEPTANCE"
        },
        currentData: {
            status: "ACTIVE"
        },
        metadata: {
            referenceNumber: deal.referenceNumber
        }
    });

    return {
        dealId: deal._id
    };
};
