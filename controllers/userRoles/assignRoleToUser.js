const createHttpError = require("http-errors");
const User = require("../../models/User");
const Membership = require("../../models/Membership");
const Role = require("../../models/Role");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ userId, roleId, businessId, user }) => {
    // Validate user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
        throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Validate role exists
    const role = await Role.findById(roleId);
    if (!role) {
        throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.ROLE_NOT_FOUND);
    }

    // Authorization: users can only assign roles within their scope
    if (role.scope !== user.scope) {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ROLE_OUT_OF_SCOPE);
    }

    // For BUSINESS scope roles, validate businessId
    if (role.scope === "BUSINESS") {
        if (!businessId) {
            throw new createHttpError(STATUS_CODES.BAD_REQUEST, "Business ID is required for business roles");
        }
        // Verify role belongs to the specified business
        if (!role.businessId.equals(businessId)) {
            throw new createHttpError(STATUS_CODES.FORBIDDEN, "Role does not belong to this business");
        }
        // BUSINESS scope users can only assign roles within their business
        if (user.scope === "BUSINESS" && !user.businessId.equals(businessId)) {
            throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);
        }
    }

    // Check if user already has a membership
    const existingMembership = await Membership.findOne({
        userId: userId,
        ...(businessId && { businessId: businessId })
    });

    if (existingMembership) {
        throw new createHttpError(
            STATUS_CODES.CONFLICT,
            "User already has a role in this context. Use update endpoint to change role."
        );
    }

    // Create new membership
    const membership = await Membership.create({
        userId: userId,
        businessId: businessId || null,
        roleId: roleId,
        status: "ACTIVE",
        scope: role.scope
    });

    return {
        membershipId: membership._id,
        userId: membership.userId,
        roleId: membership.roleId,
        businessId: membership.businessId,
        status: membership.status,
        message: "Role assigned to user successfully"
    };
};
