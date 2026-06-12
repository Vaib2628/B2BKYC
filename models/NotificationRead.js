const { default: mongoose } = require("mongoose");

const notificationReadSchema = new mongoose.Schema(
    {
        notificationId: { type: mongoose.Schema.Types.ObjectId, ref: "notification", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        readAt: { type: Date, default: Date.now() }
    },
    { timestamps: true }
);

module.exports = mongoose.model("notificationread", notificationReadSchema);
