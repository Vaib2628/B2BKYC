const createHttpError = require("http-errors");
const Role = require("../../models/Role");
const RolePermission = require("../../models/RolePermission");
const Membership = require("../../models/Membership");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ roleId, user }) => {
    const role = await Role.findById(roleId);
    if (!role) {
        throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.ROLE_NOT_FOUND);
    }

    // Authorization: ensure user scope matches role scope
    if (role.scope !== user.scope) {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ROLE_OUT_OF_SCOPE);
    }

    // Business users can only delete their own business roles
    if (role.scope === "BUSINESS" && !role.businessId.equals(user.businessId)) {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);
    }

    // Check if role is assigned to any users
    const activeMemberships = await Membership.countDocuments({
        roleId: roleId,
        status: { $in: ["ACTIVE", "INVITED"] }
    });

    if (activeMemberships > 0) {
        throw new createHttpError(
            STATUS_CODES.CONFLICT,
            "Cannot delete role that is currently assigned to users. Reassign users first."
        );
    }

    // Delete associated role permissions
    await RolePermission.deleteMany({ roleId: roleId });

    // Delete the role
    await Role.findByIdAndDelete(roleId);

    return {
        deletedRoleId: roleId,
        message: "Role deleted successfully with all associated permissions"
    };
};
