const DealTimeline = require("../models/DealTimeline");

module.exports = async ({
    dealId,
    actorId,
    businessId,
    event,
    description,
    previousState = null,
    currentState = null
}) => {
    return DealTimeline.create({
        dealId,
        actorId,
        businessId,
        event,
        description,
        previousState,
        currentState
    });
};
