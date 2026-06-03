const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { STATUS_CODES, ERROR_MESSAGES } = require("../constants/errorConstants");
const User = require("../models/User");
const Membership = require("../models/Membership");
const RolePermission = require("../models/RolePermission");
const Role = require("../models/Role")

module.exports = async (req, res, next) => {
    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!accessToken) return next(createHttpError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.ACCESS_TOKEN_MISSING));
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded._id);
        if (!user) return next(createHttpError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.USER_NOT_FOUND));

        const membership = await Membership.findOne({
            _id: decoded.membershipId,
            userId: decoded._id,
            status: "ACTIVE"
        }).populate("roleId");
        if (!membership) return next(createHttpError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.MEMBERSHIP_NOT_FOUND));

        const rolePermissions = await RolePermission.find({
            roleId: membership.roleId._id
        }).populate("permissionId", "key");

        const permissions = rolePermissions.map((item) => item.permissionId.key);

        req.user = {
            _id: decoded._id,
            businessId: membership.businessId,
            membershipId: membership._id,
            roleId: membership.roleId,
            scope: membership.scope,
            hasFullAccess: membership.roleId.hasFullAccess,
            permissions: permissions
        };
        next();
    } catch (error) {
        console.log(error)
        next(createHttpError(STATUS_CODES.UNAUTHORIZED, "Unauthorized Access"));
    }
};
