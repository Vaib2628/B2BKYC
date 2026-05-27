const createHttpError = require("http-errors");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const Deal = require("../../models/Deal");
const Business = require("../../models/Business");
const createDealTimeline = require("../../services/createDealTimeline");
const { dealTimelineEvent } = require("../../constants/constants");
const createAuditLog = require("../../services/createAuditLog");

module.exports = async ({ user, dealId, data }) => {
    const deal = await Deal.findById(dealId).populate("createdByBusinessId", "tradeName legalName");
    if (!deal) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DEAL_NOT_FOUND);

    const hasScope = deal.createdByBusinessId._id.equals(user.businessId);
    if (!hasScope) throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.DEAL_ACCESS_DENIED);

    const isEditable = ["DRAFT", "PENDING_ACCEPTANCE"].includes(deal.status);
    console.log(isEditable, deal.status)
    if (!isEditable) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.DEAL_CANNOT_BE_UPDATED);

    if (data.counterPartyBusinessId) {
        const isExists = await Business.findOne({
            _id: data.counterPartyBusinessId,
            status: "ACTIVE",
            kycStatus: { $in: ["VERIFIED", "REQUIRES_RENEWAL"] }
        });
        if (!isExists)
            throw new createHttpError(STATUS_CODES.BAD_REQUEST, ERROR_MESSAGES.COUNTERPARTY_NOT_ELIGIBLE_FOR_DEALS);
    }

    const previousData = {};
    for (const key in data) {
        if (!Object.hasOwn(data, key)) continue;

        previousData[key] = deal[key];
    }

    await createDealTimeline({
        dealId: deal._id,
        actorId: user._id,
        businessId: user.businessId,
        event: dealTimelineEvent.DEAL_UPDATED,
        description: `${deal.createdByBusinessId.tradeName} updated the ${deal.title} deal`,
        previousState: deal.status,
        currentState: deal.status
    });

    await createAuditLog({
        actorId: user._id,
        businessId: user.businessId,
        module: "DEAL",
        action: "DEAL_UPDATED",
        entityType: "deal",
        entityId: deal._id,
        description: "Deal Updated",
        previousData,
        currentData: {
            ...data
        },
        metadata: {
            referenceNumber: deal.referenceNumber
        }
    });

    await deal.updateOne(data);

    return {
        dealId: deal._id
    };
};
