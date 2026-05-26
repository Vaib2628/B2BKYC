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
    if (!hasScope) throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);

    if (deal.status != "PENDING_ACCEPTANCE")
        throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.DEAL_ALREDY_PROCEED);

    deal.status = "ACTIVE";
    await deal.save();

    await createDealTimeline({
        dealId,
        actorId: user._id,
        businessId: deal.counterPartyBusinessId,
        currentStatus: "DRAFT",
        previousStatus: "PENDING_ACCEPTANCE",
        event: dealTimelineEvent.DEAL_ACCEPTED,
        description: `${deal.counterPartyBusinessId.legalName} accepted the ${deal.title} deal`
    });

    await createAuditLog({
        actorId: user._id,
        businessId: user.businessId,
        module: "DEAL",
        action: "DEAL_ACCEPTED",
        entityType: "deal",
        entityId: deal._id,
        description: "Deal accepted successfully",
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
