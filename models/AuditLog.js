const { default: mongoose } = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        actorId: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null },
        businessId: { type: mongoose.Schema.Types.ObjectId, ref: "business", required: true },
        module: { type: String, required: true },
        action: { type: String, required: true },
        entityType: { type: String, required: true },
        entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
        description: { type: String, required: true },
        previousData: { type: Object, default: null },
        currentData: { type: Object, default: null },
        metadata: { type: Object, default: {} },
        ipAddress: { type: String, default: null },
        userAgent: { type: String, default: null }
    },
    { timestamps: true }
);

auditLogSchema.index({businessId: 1,createdAt: -1});
auditLogSchema.index({actorId: 1,createdAt: -1});
auditLogSchema.index({entityType: 1,entityId: 1});
auditLogSchema.index({module: 1,createdAt: -1});

module.exports = mongoose.model("auditlog", auditLogSchema);
