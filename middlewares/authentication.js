const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { STATUS_CODES } = require("../constants/errorConstants");

module.exports = (req, res, next) => {
    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!accessToken) next(createHttpError(STATUS_CODES.UNAUTHORIZED, "Access token is missing"));
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = {
            _id: decoded.userId,
            businessId: decoded.businessId
        };
        next();
    } catch (error) {
        next(createHttpError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Failed to authenticate user"));
    }
};
