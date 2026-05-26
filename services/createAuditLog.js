const AuditLog = require("../models/AuditLog");

module.exports = async ({
    actorId = null,
    businessId = null,
    module,
    action,
    entityType,
    entityId,
    description,
    previousData = null,
    currentData = null,
    metadata = {},
    req = null
}) => {
    return AuditLog.create({
        actorId,
        businessId,
        module,
        action,
        entityType,
        entityId,
        description,
        previousData,
        currentData,
        metadata,
        ipAddress: req?.ip || null,
        userAgent: req?.headers?.["user-agent"] || null
    });
};
