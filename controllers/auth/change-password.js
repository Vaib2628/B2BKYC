const createHttpError = require("http-errors");
const User = require("../../models/User");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ user, currentPassword, newPassword }) => {
    const currentUser = await User.findById(user._id);

    const isPassMatched = await currentUser.comparePassword(currentPassword);
    if (!isPassMatched) throw new createHttpError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CURRENT_PASSWORD);

    currentUser.password = newPassword;
    await currentUser.save();
    return { _id: currentUser._id };
};
