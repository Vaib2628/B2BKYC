const createHttpError = require("http-errors");
const Role = require("../../models/Role");
const Membership = require("../../models/Membership");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({ roleId, page = 1, limit = 10, user }) => {
    const role = await Role.findById(roleId);
    if (!role) {
        throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.ROLE_NOT_FOUND);
    }

    // Authorization: ensure user can access this role's scope
    if (role.scope === "SYSTEM" && user.scope === "BUSINESS") {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ROLE_OUT_OF_SCOPE);
    }

    // BUSINESS scope users can only view users in their business
    if (role.scope === "BUSINESS" && user.scope === "BUSINESS") {
        if (!role.businessId.equals(user.businessId)) {
            throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);
        }
    }

    // Validate pagination params
    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.min(100, Math.max(1, parseInt(limit) || 10)); // Max 100 per page
    const skip = (pageNum - 1) * pageLimit;

    // Build query filter
    const query = { roleId: roleId };

    // Get total count for pagination metadata
    const total = await Membership.countDocuments(query);

    // Fetch paginated results with user details
    const memberships = await Membership.find(query)
        .populate("userId", "firstName lastName email _id")
        .populate("businessId", "name _id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageLimit)
        .lean();

    return {
        data: memberships.map(m => ({
            membershipId: m._id,
            user: m.userId,
            status: m.status,
            businessId: m.businessId,
            scope: m.scope,
            assignedAt: m.createdAt
        })),
        pagination: {
            page: pageNum,
            limit: pageLimit,
            total: total,
            pages: Math.ceil(total / pageLimit),
            hasMore: skip + pageLimit < total
        }
    };
};
