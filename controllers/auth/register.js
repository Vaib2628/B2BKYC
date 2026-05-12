const createHttpError = require("http-errors");
const User = require("../../models/User");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const generateAccessAndRefreshTokens = require("../../utils/generateAccessAndRefreshTokens");
const sendVerificationMail = require("../../utils/sendVerificationMail");
const generateRandomToken = require("../../utils/generateRandomToken");
const constants = require("../../constants/constants");

module.exports = async function register(userdata) {
    const { confirmPassword, ...userData } = userdata;

    if (userData.password !== confirmPassword) {
        throw new createHttpError.BadRequest(ERROR_MESSAGES.CONFIRM_PASSWORD_NOT_MATCHED);
    }

    const existingUser = await User.findOne({
        email: userData.email
    }).lean();

    if (existingUser) {
        throw new createHttpError.Conflict(ERROR_MESSAGES.USER_EXISTS);
    }

    const user = await User.create(userData);

    const { hashedToken, rawToken } = generateRandomToken();
    await sendVerificationMail({
        to: user.email,
        token: rawToken,
        businessName: user.businessName || "TrustVault"
    });
    user.emailVerifyToken = hashedToken;
    user.emailVerifyTokenExpiry = Date.now() + constants.EMAIL_VERIFICATION_EXPIRY;
    await user.save();
    
    return user;
};
