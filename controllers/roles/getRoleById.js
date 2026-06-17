const createHttpError = require("http-errors");
const Role = require("../../models/Role");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ roleId, user }) => {
    const role = await Role.findById(roleId);
    if (!role) {
        throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.ROLE_NOT_FOUND);
    }

    // System users cannot access business-scoped roles
    if (role.scope === "SYSTEM" && user.scope === "BUSINESS") {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ROLE_OUT_OF_SCOPE);
    }

    // Business users can only access their own business roles
    if (role.scope === "BUSINESS" && user.scope === "BUSINESS" && !role.businessId.equals(user.businessId)) {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);
    }

    return role;
};
