const createHttpError = require("http-errors");
const Permission = require("../../models/Permission");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ permissionId, user, resource, action, description }) => {
    // Only SYSTEM scope users can modify permissions
    if (user.scope === "BUSINESS") {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);
    }

    const permission = await Permission.findById(permissionId);
    if (!permission) {
        throw new createHttpError(STATUS_CODES.NOT_FOUND, "Permission not found");
    }

    // Update allowed fields
    if (resource) {
        permission.resource = resource.toUpperCase();
    }
    if (action) {
        permission.action = action.toUpperCase();
    }
    if (description !== undefined) {
        permission.description = description;
    }

    // Regenerate key if resource or action changes
    const newKey = `${permission.resource}.${permission.action}`;
    if (newKey !== permission.key) {
        const existingPermission = await Permission.findOne({ key: newKey });
        if (existingPermission) {
            throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.PERMISSION_ALREADY_EXISTS);
        }
        permission.key = newKey;
    }

    await permission.save();

    return {
        _id: permission._id,
        key: permission.key,
        resource: permission.resource,
        action: permission.action,
        description: permission.description,
        scope: permission.scope
    };
};
