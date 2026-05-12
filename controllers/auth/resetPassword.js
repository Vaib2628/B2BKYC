const createHttpError = require("http-errors");
const User = require("../../models/User");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const generateHash = require("../../utils/generateHash");

module.exports = async ({ token, password, confirmPassword }) => {
    const hashedToken = generateHash(token)
    const user = await User.findOne({ resetToken: hashedToken, resetTokenExpiry: { $gt: Date.now() } });

    if (!user) throw new createHttpError(STATUS_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
};
