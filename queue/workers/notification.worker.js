const { Worker } = require("bullmq");
const processor = require("../processors/notification.processor.js");
const connection = require("../../config/redis.js");

const notificationWorker =  new Worker("notification-queue", processor, { connection, concurrency: 5 });

module.exports = notificationWorker;
