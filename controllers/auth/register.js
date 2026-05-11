/* 
Register flow 
1. Create the user with isVerified false 
2. create the business workspace 
3. create the role for the user as BUSINESS_OWNER in the workspace 
4. map the user to the workspace with the role 
5. Attach the permissions to the role - ALL permission for the business owner role that's already managed by the checkpermission middleware so nneed to do anything extra for that

*/

const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async function register(userdata) {
    const isConfirmPassword = userdata.password === userdata.confirmPassword;
    if (!isConfirmPassword) throw new createHttpError(STATUS_CODES.BAD_REQUEST, ERROR_MESSAGES.CONFIRM_PASSWORD_NOT_MATCHED);

    const isUserExists = await User.findOne({
        $or: [{ email: userdata.email }, { phoneNumber: userdata.phoneNumber }]
    }).lean();
    if (isUserExists) throw new createHttpError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.USER_EXISTS);

    const user = await User.create(userdata)
    return generateAccessAndRefreshTokens(user._id);
};