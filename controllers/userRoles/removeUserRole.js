const createHttpError = require("http-errors");
const Membership = require("../../models/Membership");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ userId, businessId, user }) => {
    const query = { userId: userId };
    if (businessId) {
        query.businessId = businessId;
    }

    const membership = await Membership.findOne(query);
    if (!membership) {
        throw new createHttpError(
            STATUS_CODES.NOT_FOUND,
            "User membership not found in this context"
        );
    }

    // BUSINESS scope users can only remove memberships within their business
    if (user.scope === "BUSINESS") {
        if (!membership.businessId || !membership.businessId.equals(user.businessId)) {
            throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);
        }
    }

    // Delete the membership
    await Membership.findByIdAndDelete(membership._id);

    return {
        userId: userId,
        membershipId: membership._id,
        message: "User role removed successfully"
    };
};
