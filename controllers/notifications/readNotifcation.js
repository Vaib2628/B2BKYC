const NotificationRead = require("../../models/NotificationRead");

module.exports = async ({ notificationId, user }) => {
    await NotificationRead.updateOne(
        {
            notificationId,
            userId: user._id
        },
        {
            readAt: new Date()
        },
        {
            upsert: true
        }
    );

    return { _id: notificationId };
};
