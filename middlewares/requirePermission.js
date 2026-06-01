const createHttpError = require("http-errors");
const { STATUS_CODES, ERROR_MESSAGES } = require("../constants/errorConstants");

module.exports =
    ({ permission, scope = null }) =>
    (req, res, next) => {
        if (scope && req.user.scope !== scope) {
            return next(createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED));
        }

        if (req.user.hasFullAccess) return next();

        const hasPermission = req.user.permissions.includes(permission);
        if (!hasPermission) {
            return next(createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.PERMISSION_DENIED));
        }

        return next();
    };
