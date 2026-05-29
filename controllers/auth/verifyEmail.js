const createHttpError = require("http-errors");
const User = require("../../models/User");
const { STATUS_CODES } = require("../../constants/errorConstants");
const generateHash = require("../../utils/generateHash");

module.exports = async (token) => {
    const hashedToken = generateHash(token);
    const user = await User.findOne({ emailVerifyToken: hashedToken, emailVerifyTokenExpiry: { $gt: Date.now() } });

    if (!user) throw new createHttpError(STATUS_CODES.BAD_REQUEST, "Invalid or expired token");

    user.emailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyTokenExpiry = undefined;
    await user.save();

    return { email: user.email };
};
