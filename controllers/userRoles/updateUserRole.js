const createHttpError = require("http-errors");
const Membership = require("../../models/Membership");
const Role = require("../../models/Role");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ userId, newRoleId, businessId, user }) => {
    const query = { userId: userId };
    if (businessId) {
        query.businessId = businessId;
    }

    const membership = await Membership.findOne(query);
    if (!membership) {
        throw new createHttpError(STATUS_CODES.NOT_FOUND, "User membership not found in this context");
    }

    // BUSINESS scope users can only update memberships within their business
    if (user.scope === "BUSINESS" && !membership.businessId.equals(user.businessId)) {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);
    }

    // Validate new role exists
    const newRole = await Role.findById(newRoleId);
    if (!newRole) {
        throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.ROLE_NOT_FOUND);
    }

    // Ensure new role has same scope as original membership
    if (newRole.scope !== membership.scope) {
        throw new createHttpError(
            STATUS_CODES.BAD_REQUEST,
            `New role scope must match membership scope: ${membership.scope}`
        );
    }

    // For BUSINESS scope roles, validate business context
    if (newRole.scope === "BUSINESS") {
        if (!newRole.businessId.equals(membership.businessId)) {
            throw new createHttpError(
                STATUS_CODES.FORBIDDEN,
                "New role does not belong to the user's business"
            );
        }
    }

    // Update the role
    membership.roleId = newRoleId;
    await membership.save();

    return {
        membershipId: membership._id,
        userId: membership.userId,
        roleId: membership.roleId,
        businessId: membership.businessId,
        status: membership.status,
        message: "User role updated successfully"
    };
};
