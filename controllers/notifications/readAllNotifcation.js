const Notification = require("../../models/Notification");
const NotificationRead = require("../../models/NotificationRead");

module.exports = async (user) => {
    const notifications = await Notification.find({
        businessId: user.businessId
    }).select("_id");

    await NotificationRead.insertMany(
        notifications.map((item) => ({
            notificationId: item._id,
            userId: user._id
        })),
        {
            ordered: false
        }
    ).catch(() => {});

    return { success: true };
};
