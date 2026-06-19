const createHttpError = require("http-errors");
const Membership = require("../../models/Membership");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ userId, businessId, user }) => {
    const query = { userId: userId };

    // If businessId provided, filter by business
    if (businessId) {
        query.businessId = businessId;
    }

    // BUSINESS scope users can only view memberships within their business
    if (user.scope === "BUSINESS") {
        query.businessId = user.businessId;
    }

    const membership = await Membership.findOne(query)
        .populate("roleId", "name description scope hasFullAccess")
        .populate("businessId", "name _id");

    if (!membership) {
        throw new createHttpError(
            STATUS_CODES.NOT_FOUND,
            "User role not found in this context"
        );
    }

    return {
        membershipId: membership._id,
        userId: membership.userId,
        roleId: membership.roleId,
        businessId: membership.businessId,
        status: membership.status,
        scope: membership.scope,
        createdAt: membership.createdAt
    };
};
