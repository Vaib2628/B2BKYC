const Notification = require("../models/Notification");
const io = require("../config/socket").getIO();
const notificationProducer = require("../queue/producers/notification.producer");

module.exports = async ({
    businessId,
    type,
    title,
    message,
    targetPermission,
    entityType,
    entityId,
    metadata = {}
}) => {
    return notificationProducer({
        businessId,
        type,
        title,
        message,
        targetPermission,
        entityType,
        entityId,
        metadata
    });
};
