const { default: mongoose } = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        businessId: { type: mongoose.Schema.Types.ObjectId, ref: "business", required: true },
        type: { type: String, required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        targetPermission: { type: String, default: null },
        entityType: { type: String, default: null },
        entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
        metadata: { type: Object, default: {} }
    },
    { timestamps: true }
);

module.exports = mongoose.model("notification", notificationSchema);
