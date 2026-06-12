const paginate = require("../../utils/paginate");
const Notification = require("../../models/Notification");
const NotificationRead = require("../../models/NotificationRead");

module.exports = async ({ user, options }) => {
    const result = await paginate({ model: Notification, filter: { businessId: user.businessId }, options });

    const notificationIds = result.docs.map((noti) => noti._id);

    const reads = await NotificationRead.find({ _id: { $in: notificationIds }, userId: user._id });
    const readMap = new Set(reads.map((read) => read.notificationId.toString()));

    result.docs = result.docs.map((noti) => {
        return {
            ...noti,
            isRead: readMap.has(noti._id.toString())
        };
    });

    return result;
};
