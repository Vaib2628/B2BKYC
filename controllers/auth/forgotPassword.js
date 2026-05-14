const constants = require("../../constants/constants");
const User = require("../../models/User");
const generateRandomToken = require("../../utils/generateRandomToken");
const sendResetPasswordMail = require("../../utils/sendResetPasswordMail");

module.exports = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        return true; // Return true to prevent email enumeration attacks
    }

    const { rawToken, hashedToken } = generateRandomToken();
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + constants.RESET_TOKEN_EXPIRY;
    if (user.failedLoginAttempts) user.failedLoginAttempts = undefined;
    if (user.lockUntil) user.lockUntil = undefined;
    await user.save();

    // Sending the reset password email
    await sendResetPasswordMail({
        to: user.email,
        templateData: {
            resetUrl: `${process.env.FRONTEND_URL}/reset-password/?token=${rawToken}`,
            expiryHours: constants.RESET_TOKEN_EXPIRY / (1000 * 60 * 60)
        }
    });
};
