const createHttpError = require("http-errors");
const generateAccessAndRefreshTokens = require("../../utils/generateAccessAndRefreshTokens");
const { ERROR_MESSAGES } = require("../../constants/errorConstants");
const User = require("../../models/User");
const Membership = require("../../models/Membership");

module.exports = async (userData) => {
    const user = await User.findOne({ email: userData.email });
    if (!user) throw new createHttpError.Unauthorized(ERROR_MESSAGES.USER_NOT_FOUND);

    if (user.lockUntil > Date.now()) {
        const resetTime = parseInt((user.lockUntil - Date.now()) / (1000 * 60 * 60));
        throw new createHttpError.Forbidden(`Account locked , Try again after ${resetTime} hours.`);
    }

    const isPasswordMatched = await user.comparePassword(userData.password);
    if (!isPasswordMatched) {
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        if (user.failedLoginAttempts >= 3) {
            user.lockUntil = Date.now() + 24 * 60 * 60 * 1000;
            await user.save();
            throw new createHttpError.Forbidden(ERROR_MESSAGES.ACCOUNT_LOCKED);
        }
        await user.save();
        console.log(user);
        throw new createHttpError.Unauthorized(`Invalid crediantials, ${3 - user.failedLoginAttempts} attempts left`);
    }

    if (user.lockUntil || user.failedLoginAttempts) {
        await user.updateOne({ $unset: { lockUntil: "", failedLoginAttempts: "" } });
    }

    const membership = await Membership.findOne({ userId: user._id });
    const accessToken = await user.generateAccessToken(membership);
    const refreshToken = await user.generateRefreshToken(membership);
    return { accessToken, refreshToken };
};
