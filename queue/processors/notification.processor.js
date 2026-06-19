const Notification = require("../../models/Notification");
const socket = require("../../config/socket");

module.exports = async (job) => {
    const notification = await Notification.create(job.data);

    socket.getIO().to(`business:${notification.businessId}`).emit("notification:new", notification);

    return notification;
};
