const createHttpError = require("http-errors");
const Role = require("../../models/Role");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ user, name, description, scope, hasFullAccess = false }) => {
    if (scope !== user.scope) {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);
    }

    const existingRole = await Role.findOne({
        name,
        scope,
        businessId: scope === "BUSINESS" ? user.businessId : null
    });
    if (existingRole) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.ROLE_ALREADY_EXISTS);

    const role = await Role.create({
        name,
        description,
        scope,
        hasFullAccess,
        businessId: user.scope === "BUSINESS" ? user.businessId : null
    });

    return {
        _id: role._id
    };
};
