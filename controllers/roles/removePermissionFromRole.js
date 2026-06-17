const createHttpError = require("http-errors");
const Role = require("../../models/Role");
const RolePermission = require("../../models/RolePermission");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ roleId, permissionId, user }) => {
    const role = await Role.findById(roleId);
    if (!role) {
        throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.ROLE_NOT_FOUND);
    }

    // Authorization: ensure user scope matches role scope
    if (role.scope !== user.scope) {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ROLE_OUT_OF_SCOPE);
    }

    // Business users can only modify their own business roles
    if (role.scope === "BUSINESS" && !role.businessId.equals(user.businessId)) {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);
    }

    // Find and delete the role-permission relationship
    const rolePermission = await RolePermission.findOneAndDelete({
        roleId: roleId,
        permissionId: permissionId
    });

    if (!rolePermission) {
        throw new createHttpError(
            STATUS_CODES.NOT_FOUND,
            "Permission not found in this role or already removed"
        );
    }

    return {
        removedPermissionId: permissionId,
        roleId: roleId,
        message: "Permission removed from role successfully"
    };
};
