const createHttpError = require("http-errors");
const Business = require("../../models/Business");
const Deal = require("../../models/Deal");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const generateReferenceNumber = require("../../helpers/generateReferenceNumber");
const createDealTimeline = require("../../services/createDealTimeline");
const { dealTimelineEvent } = require("../../constants/constants");
const createAuditLog = require("../../services/createAuditLog");

module.exports = async ({ user, data }) => {
    const createdByBusinessId = user.businessId;
    const business = await Business.findById(user.businessId);

    const counterParty = await Business.findOne({ _id: data.counterPartyBusinessId, status: "ACTIVE" });
    if (!counterParty) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.BUSINESS_NOT_FOUND);

    const isSelf = counterParty._id.equals(user.businessId);
    if (isSelf) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.CAN_NOT_CREATE_DEAL_WITH_OWN);

    // REFERENCE NUMBER MUST BE UNIQUE
    let referenceNumber;
    let exists = true;

    while (exists) {
        referenceNumber = generateReferenceNumber();
        exists = await Deal.exists({ referenceNumber });
    }

    const deal = await Deal.create({
        createdBy: user._id,
        createdByBusinessId: user.businessId,
        referenceNumber,
        status: "PENDING_ACCEPTANCE",
        ...data
    });

    await createDealTimeline({
        dealId: deal._id,
        actorId: user._id,
        businessId: user.businessId,
        event: dealTimelineEvent.DEAL_CREATED,
        description: `${business.businessName} created the ${deal.title} deal`
    });

    await createAuditLog({
        actorId: user._id,
        businessId: user.businessId,
        module: "DEAL",
        action: "DEAL_ACCEPTED",
        entityType: "Deal",
        entityId: deal._id,
        description: "Deal status updated",
        previousData: {
            status: "DRAFT"
        },
        currentData: {
            status: "PENDING_ACCEPTANCE"
        },
        metadata: {
            referenceNumber: deal.referenceNumber
        }
    });
};
