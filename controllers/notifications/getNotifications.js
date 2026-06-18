const paginate = require("../../utils/paginate");
const Notification = require("../../models/Notification");
const NotificationRead = require("../../models/NotificationRead");
const { default: mongoose } = require("mongoose");

module.exports = async ({ user, options }) => {
    const result = await paginate({ model: Notification, filter: { businessId: user.businessId }, options });

    const notificationIds = result.docs.map((noti) => noti._id);

    console.log("🚀 ~ :9 ~ notificationIds:", notificationIds);

    const reads = await NotificationRead.find({
        notificationId: { $in: notificationIds },
        userId: new mongoose.Types.ObjectId(user._id)
    });

    console.log("🚀 ~ :13 ~ reads:", reads);
    const readMap = new Set(reads.map((read) => read.notificationId.toString()));

    console.log("🚀 ~ :13 ~ readMap:", readMap);

    result.docs = result.docs.map((noti) => {
        return {
            ...noti,
            isRead: readMap.has(noti._id.toString())
        };
    });

    return result;
};
