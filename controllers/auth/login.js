const createHttpError = require("http-errors");
const generateAccessAndRefreshTokens = require("../../utils/generateAccessAndRefreshTokens");
const { ERROR_MESSAGES, STATUS_CODES } = require("../../constants/errorConstants");
const User = require("../../models/User");
const Membership = require("../../models/Membership");
const Business = require("../../models/Business");

module.exports = async (userData) => {
    const user = await User.findOne(
        { email: userData.email },
        "failedLoginAttempts lockUntil password firstName lastName email emailVerified"
    );
    if (!user) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.INVALID_CREDENTIALS);

    if (user.emailVerified === false)
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.EMAIL_NOT_VERIFIED);

    if (user.lockUntil > Date.now()) {
        const resetTime = parseInt((user.lockUntil - Date.now()) / (1000 * 60 * 60));
        throw new createHttpError(STATUS_CODES.FORBIDDEN, `Account locked , Try again after ${resetTime} hours.`);
    }

    const isPasswordMatched = await user.comparePassword(userData.password);
    if (!isPasswordMatched) {
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        if (user.failedLoginAttempts >= 3) {
            user.lockUntil = Date.now() + 24 * 60 * 60 * 1000;
            await user.save();
            throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCOUNT_LOCKED);
        }
        await user.save();
        throw new createHttpError(
            STATUS_CODES.UNAUTHORIZED,
            `Invalid crediantials, ${3 - user.failedLoginAttempts} attempts left`
        );
    }

    if (user.lockUntil || user.failedLoginAttempts) {
        await user.updateOne({ $unset: { lockUntil: "", failedLoginAttempts: "" } });
    }

    // masking the password before sending the user data in response
    user.password = undefined;

    const membership = await Membership.findOne({ userId: user._id }).lean();

    const accessToken = await user.generateAccessToken(membership);
    const refreshToken = await user.generateRefreshToken(membership);

    // Saving the refreshToken
    await user.updateOne({ refreshToken: refreshToken });

    return { accessToken, refreshToken };
};
