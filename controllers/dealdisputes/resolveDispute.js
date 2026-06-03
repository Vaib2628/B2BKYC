const createHttpError = require("http-errors");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const Deal = require("../../models/Deal");
const DealDispute = require("../../models/DealDispute");
const createDealTimeline = require("../../services/createDealTimeline");
const { dealTimelineEvent } = require("../../constants/constants");
const Business = require("../../models/Business");
const createAuditLog = require("../../services/createAuditLog");

module.exports = async ({ disputeId, user, resolutionNote }) => {
    const dispute = await DealDispute.findById(disputeId);
    if (!dispute) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DISPUTE_NOT_FOUND);

    const deal = await Deal.findById(dispute.dealId);
    if (!deal) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DEAL_NOT_FOUND);

    const hasScope = dispute.againstBusinessId._id.equals(user.businessId);
    if (!hasScope) throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.DISPUTE_ACCESS_DENIED);

    const isResolved = dispute.status === "RESOLVED";
    if (isResolved) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.DISPUTE_ALREADY_RESOLVED);

    const business = await Business.findById(user.businessId).select("tradeName legalName").lean();

    dispute.status = "RESOLVED";
    dispute.resolvedByUserId = user._id;
    dispute.resolvedByBusinessId = user.businessId;
    dispute.resolutionNote = resolutionNote;
    dispute.resolvedAt = new Date();
    await dispute.save();

    deal.status = "ACTIVE";
    await deal.save();

    await createDealTimeline({
        dealId: dispute.dealId._id,
        businessId: user.businessId,
        actorId: user._id,
        event: dealTimelineEvent.DEAL_DISPUTE_RESOLVED,
        description: `${business.tradeName} resolved the dispute`,
        currentState: "DISPUTED",
        previousState: deal.status
    });

    await createAuditLog({
        actorId: user._id,
        businessId: user.businessId,
        module: "DEAL",
        action: "DEAL_DISPUTE_RESOLVED",
        entityType: "deal",
        entityId: deal._id,
        description: "Deal dispute resolved",
        previousData: {
            status: "DISPUTED"
        },
        currentData: {
            status: deal.status
        },
        metadata: {
            referenceNumber: deal.referenceNumber
        }
    });

    return {
        disputeId: dispute._id
    };
};
