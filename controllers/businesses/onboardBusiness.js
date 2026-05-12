const createHttpError = require("http-errors");
const Business = require("../../models/Business");
const User = require("../../models/User");
const { ERROR_MESSAGES, STATUS_CODES } = require("../../constants/errorConstants");
const Membership = require("../../models/Membership");
const constants = require("../../constants/constants");
const sendVerificationMail = require("../../utils/sendVerificationMail");
const generateRandomToken = require("../../utils/generateRandomToken");
module.exports = async (businessData) => {
    // Check if CIN, PAN, or GST already exists
    const existingBusiness = await Business.findOne({
        $or: [
            { cinNumber: businessData.cinNumber },
            { panNumber: businessData.panNumber },
            { gstNumber: businessData.gstNumber }
        ]
    });
    if (existingBusiness) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.BUSINESS_ALREADY_EXISTS);

    // Check if email already exists
    const existingUser = await User.findOne({ email: businessData.email });
    if (existingUser) throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);

    // register primary owner as user
    const user = new User({
        firstName: businessData.firstName,
        lastName: businessData.lastName,
        email: businessData.email,
        password: businessData.password
    });
    await user.save();

    // generate randomtoken and send email to user for verification
    const { rawToken, hashedToken } = generateRandomToken();
    user.emailVerifyToken = hashedToken;
    user.emailVerifyTokenExpiry = Date.now() + constants.EMAIL_VERIFICATION_EXPIRY;
    await user.save();

    // Send verification email
    const sendMail = require("../../services/sendMail");
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;
    console.log(rawToken);
    await sendVerificationMail({
        to: user.email,
        token: rawToken,
        businessName: businessData.legalName
    });

    // Create new business
    const business = new Business({
        legalName: businessData.legalName,
        companyType: businessData.companyType,
        industry: businessData.industry,
        cinNumber: businessData.cinNumber,
        panNumber: businessData.panNumber,
        gstNumber: businessData.gstNumber,
        registeredPhone: businessData.primaryContactNumber,
        registeredAddress: businessData.registeredAddress,
        primaryOwnerId: user._id
    });
    await business.save();

    // Assign user to role of admin of the business
    const Role = require("../../models/Role");
    const role = await Role.create({
        name: "Admin",
        description: "Admin role for the business",
        type: "BUSINESS",
        businessId: business._id,
        hasFullAccess: true
    });

    // Mapping the user to the business
    const membership = await Membership.create({
        userId: user._id,
        businessId: business._id,
        roleId: role._id,
        status: "ACTIVE"
    });

    return business;
};
