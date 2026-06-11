const paginate = require("../../utils/paginate");
const AuditLog = require("../../models/AuditLog");
const createHttpError = require("http-errors");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ user, body }) => {
    let filter = body.filters || {};

    if (user.scope === "BUSINESS" && filter?.businessId && filter.businessId.toString() !== user.businessId.toString())
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);

    if (user.scope === "BUSINESS") filter.businessId = user.businessId;

    return paginate({
        model: AuditLog,
        filter,
        populate: [
            { path: "actorId", select: "firstName lastName email" },
            { path: "businessId", select: "tradeName legalName" }
        ],
        options: body.options,
        select: "-previousData -currentData"
    });
};
