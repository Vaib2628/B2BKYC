const User = require("../../models/User");
const Business = require("../../models/Business");
const Membership = require("../../models/Membership");

module.exports = async (userData) => {
    const user = await User.findById(userData._id).select("email firstName lastName emailVerified");
    const business = await Business.findById(userData.businessId).select("legalName companyType kycStatus trustScore");

    const membership = await Membership.findOne(userData.membershipId)
        .populate("roleId", "name type hasFullAccess")
        .select("status");

    return {
        user,
        business,
        membership
    };
};
