const createHttpError = require("http-errors");
const Permission = require("../../models/Permission");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ permissionId, user }) => {
    const permission = await Permission.findById(permissionId);
    if (!permission) {
        throw new createHttpError(STATUS_CODES.NOT_FOUND, "Permission not found");
    }

    // BUSINESS scope users cannot access SYSTEM permissions
    if (user.scope === "BUSINESS" && permission.scope === "SYSTEM") {
        throw new createHttpError(
            STATUS_CODES.FORBIDDEN,
            "System permissions cannot be accessed by business users"
        );
    }

    return permission;
};
