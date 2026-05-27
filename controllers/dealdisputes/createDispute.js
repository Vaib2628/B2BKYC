const createHttpError = require("http-errors");
const Deal = require("../../models/Deal");
const Business = require("../../models/Business");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const DealDispute = require("../../models/DealDispute");
const createDealTimeline = require("../../services/createDealTimeline");
const { dealTimelineEvent } = require("../../constants/constants");
const createAuditLog = require("../../services/createAuditLog");

module.exports = async ({ user, dealId, reason }) => {
    const deal = await Deal.findById(dealId);
    if (!deal) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DEAL_NOT_FOUND);

    const hasScope =
        deal.createdByBusinessId._id.equals(user.businessId) || deal.counterPartyBusinessId._id.equals(user.businessId);
    if (!hasScope) throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.DEAL_ACCESS_DENIED);

    const isDisputable = deal.status === "ACTIVE";
    if (!isDisputable) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.DEAL_CANNOT_BE_DISPUTED);

    const isExisting = await DealDispute.findOne({ dealId, status: "OPEN" });
    if (isExisting) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.DEAL_ALREADY_DISPUTED);

    const previousState = deal.status;
    deal.status = "DISPUTED";
    await deal.save();

    const business = await Business.findById(user.businessId).select({ tradeName: 1, legalName: 1 });

    await DealDispute.create({
        dealId,
        raisedByBusinessId: user.businessId,
        raisedAt: new Date(),
        raisedByUserId: user._id,
        reason,
        status: "OPEN"
    });

    await createDealTimeline({
        dealId,
        businessId: user.businessId,
        actorId: user._id,
        previousState: previousState,
        currentState: deal.status,
        event: dealTimelineEvent.DEAL_DISPUTED,
        description: `${business.tradeName} raised a dispute`
    });

    await createAuditLog({
        actorId: user._id,
        businessId: user.businessId,
        module: "DEAL",
        action: "DEAL_DISPUTED",
        entityType: "deal",
        entityId: deal._id,
        description: "Deal disputed",
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
