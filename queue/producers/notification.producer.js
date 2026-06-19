const { Queue } = require("bullmq");
const connection = require("../../config/redis");

const notificationQueue = new Queue("notification-queue", { connection });

module.exports = (payload) => {
    notificationQueue.add("create-notification", payload, {
        attempts: 3,
        backoff: { type: "exponential", delay: 200 },
        removeOnComplete: 100,
        removeOnFail: 50
    });
};
