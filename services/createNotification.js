const Notification = require("../models/Notification");
const io = require("../config/socket").getIO();

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
    const notification = await Notification.create({
        businessId,
        type,
        title,
        message,
        targetPermission,
        entityType,
        entityId,
        metadata
    });

    io.to(`business:${businessId}`).emit("notification:new", notification);

    return notification;
};
