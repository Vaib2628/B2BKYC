const createHttpError = require("http-errors");
const Business = require("../../models/Business");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const Role = require("../../models/Role");

module.exports = async (user) => {
    if (user.scope === "BUSINESS" && !user.businessId)
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);

    const filter = {
        scope: user.scope,
        ...(user.businessId && { businessId: user.businessId })
    };

    return Role.find(filter);
};
