const createHttpError = require("http-errors");
const Membership = require("../models/Membership");
const RolePermission = require("../models/RolePermission");
const Role = require("../models/Role");
const { STATUS_CODES, ERROR_MESSAGES } = require("../constants/errorConstants");

const requirePermission = (permissionKeys = [], requiredScope = null) => {
    return async (req, res, next) => {
        try {
            const membership = await Membership.findOne({
                _id: req.user.membershipId,
                status: "ACTIVE"
            });

            if (!membership) {
                throw createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.MEMBERSHIP_NOT_FOUND);
            }

            if (requiredScope && membership.scope !== requiredScope) {
                throw createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);
            }

            const role = await Role.findById(membership.roleId);
            if (!role) {
                throw createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.ROLE_NOT_FOUND);
            }
            if (role.hasFullAccess) {
                return next();
            }
            if (!permissionKeys.length) {
                return next();
            }
            
            const rolePermissions = await RolePermission.find({
                roleId: membership.roleId
            }).populate("permissionId");

            const permissions = rolePermissions.map((item) => item.permissionId.key);
            const hasPermission = permissionKeys.some((permission) => permissions.includes(permission));

            if (!hasPermission) {
                throw createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = requirePermission;
