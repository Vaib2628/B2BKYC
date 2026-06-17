const createHttpError = require("http-errors");
const Permission = require("../../models/Permission");
const RolePermission = require("../../models/RolePermission");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ permissionId, user }) => {
    // Only SYSTEM scope users can delete permissions
    if (user.scope === "BUSINESS") {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);
    }

    const permission = await Permission.findById(permissionId);
    if (!permission) {
        throw new createHttpError(STATUS_CODES.NOT_FOUND, "Permission not found");
    }

    // Check if permission is assigned to any roles
    const roleCount = await RolePermission.countDocuments({ permissionId: permissionId });

    if (roleCount > 0) {
        throw new createHttpError(
            STATUS_CODES.CONFLICT,
            `Cannot delete permission. It is currently assigned to ${roleCount} role(s). Remove from roles first.`
        );
    }

    // Delete the permission
    await Permission.findByIdAndDelete(permissionId);

    return {
        deletedPermissionId: permissionId,
        message: "Permission deleted successfully"
    };
};
