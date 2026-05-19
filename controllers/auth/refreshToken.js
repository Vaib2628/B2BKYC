const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const createHttpError = require("http-errors");
const { ERROR_MESSAGES, STATUS_CODES } = require("../../constants/errorConstants");
const Membership = require("../../models/Membership");

module.exports = async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) throw new createHttpError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_REFRESH_TOKEN);

    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== refreshToken)
        throw new createHttpError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_REFRESH_TOKEN);

    const membership = await Membership.findById(decoded.membershipId);
    if (!membership || !membership.userId.equals(user._id) || membership.status !== "ACTIVE")
        throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.MEMBERSHIP_NOT_FOUND);

    const accessToken = await user.generateAccessToken(membership);
    const newRefreshToken = await user.generateRefreshToken(membership);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken: newRefreshToken };
};
