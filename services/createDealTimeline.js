const DealTimeline = require("../models/DealTimeline");

module.exports = async ({
    dealId,
    actorId,
    businessId,
    event,
    description,
    previousStatus = null,
    currentStatus = null
}) => {
    return DealTimeline.create({
        dealId,
        actorId,
        businessId,
        event,
        description,
        previousStatus,
        currentStatus
    });
};
