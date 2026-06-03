const createHttpError = require("http-errors");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const Permission = require("../../models/Permission");

module.exports = async ({ user, data }) => {
    if (user.scope === "BUSINESS") throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);

    const existingPermission = await Permission.findOne({ key: data.key });
    if (existingPermission) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.PERMISSION_ALREADY_EXISTS);

    const permission = await Permission.create(data);
    return { _id: permission._id };
};
