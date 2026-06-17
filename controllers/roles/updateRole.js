const createHttpError = require("http-errors");
const Role = require("../../models/Role");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ roleId, user, name, description, hasFullAccess }) => {
    const role = await Role.findById(roleId);
    if (!role) {
        throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.ROLE_NOT_FOUND);
    }

    // Authorization: ensure user scope matches role scope
    if (role.scope !== user.scope) {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ROLE_OUT_OF_SCOPE);
    }

    // Business users can only update their own business roles
    if (role.scope === "BUSINESS" && !role.businessId.equals(user.businessId)) {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);
    }

    // Check for duplicate role name within the same scope/business
    if (name) {
        const existingRole = await Role.findOne({
            _id: { $ne: roleId },
            name,
            scope: role.scope,
            businessId: role.scope === "BUSINESS" ? role.businessId : null
        });
        if (existingRole) {
            throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.ROLE_ALREADY_EXISTS);
        }
    }

    // Update allowed fields
    if (name) role.name = name;
    if (description !== undefined) role.description = description;

    // Only SYSTEM users can modify hasFullAccess
    if (hasFullAccess !== undefined && user.scope === "SYSTEM") {
        role.hasFullAccess = hasFullAccess;
    }

    await role.save();

    return {
        _id: role._id,
        name: role.name,
        description: role.description,
        scope: role.scope,
        hasFullAccess: role.hasFullAccess
    };
};
