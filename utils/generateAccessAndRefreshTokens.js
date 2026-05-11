const createHttpError = require("http-errors");
const User = require("../models/User");
const Membership = require("../models/Membership");

const generateAccessAndRefreshTokens = async (userId, membershipId) => {
    const user = await User.findById(userId);
    if (!user) throw new createHttpError(404, "User not found");

    const membership = await Membership.findById(membershipId);
    if (!membership) throw new createHttpError(404, "Membership not found");

    const accessToken = user.generateAccessToken(membership);
    const refreshToken = user.generateRefreshToken(membership);
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};

module.exports = generateAccessAndRefreshTokens;
