const createHttpError = require("http-errors");
const User = require("../models/User");
const Membership = require("../models/Membership");
const { ERROR_MESSAGES } = require("../constants/errorConstants");

const generateAccessAndRefreshTokens = async (userId, membershipId) => {
    const user = await User.findById(userId);
    if (!user) throw new createHttpError.notFound(ERROR_MESSAGES.USER_NOT_FOUND);

    const membership = await Membership.findById(membershipId);
    if (!membership) throw new createHttpError.notFound(ERROR_MESSAGES.MEMBERSHIP_NOT_FOUND);

    const accessToken = user.generateAccessToken(membership);
    const refreshToken = user.generateRefreshToken(membership);
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};

module.exports = generateAccessAndRefreshTokens;
