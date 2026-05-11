const createHttpError = require("http-errors");
const Business = require("../../models/Business");
const User = require("../../models/User");
const { ERROR_MESSAGES } = require("../../constants/errorConstants");
const Membership = require("../../models/Membership");

module.exports = async (businessData) => {
    // Check if CIN, PAN, or GST already exists
    const existingBusiness = await Business.findOne({
        $or: [
            { cinNumber: businessData.cinNumber },
            { panNumber: businessData.panNumber },
            { gstNumber: businessData.gstNumber }
        ]
    })
    if (existingBusiness) {
        throw new createHttpError.Conflict(ERROR_MESSAGES.BUSINESS_ALREADY_EXISTS);
    }

    // register primary owner as user
    const user = new User({
        firstName: businessData.firstName,
        lastName: businessData.lastName,
        email: businessData.email,
        password: businessData.password
    });
    await user.save();

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
