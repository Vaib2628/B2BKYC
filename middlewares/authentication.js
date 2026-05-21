const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { STATUS_CODES, ERROR_MESSAGES } = require("../constants/errorConstants");
const User = require("../models/User");
const Membership = require("../models/Membership");

module.exports = async (req, res, next) => {
    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!accessToken) return next(createHttpError(STATUS_CODES.UNAUTHORIZED, "Access token is missing"));
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded._id);
        if (!user) return next(createHttpError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED));

        const membership = await Membership.findOne({
            userId: decoded._id,
            scope: decoded.scope,
            status: "ACTIVE"
        });
        if (!membership) return next(createHttpError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED));

        req.user = {
            _id: decoded._id,
            businessId: decoded.businessId,
            membershipId: membership._id,
            scope: membership.scope
        };
        next();
    } catch (error) {
        next(createHttpError(STATUS_CODES.UNAUTHORIZED, "Unauthorized Access"));
    }
};
