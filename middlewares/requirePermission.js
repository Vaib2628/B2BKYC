const createHttpError = require("http-errors");
const Membership = require("../models/membership.model");
const RolePermission = require("../models/rolePermission.model");
const Role = require("../models/Role");

const requirePermission = (permissionKey) => {
    return async (req, res, next) => {
        try {
            const { userId, businessId } = req.user;

            const membership = await Membership.findOne({
                userId,
                businessId,
                status: "ACTIVE"
            });
            if (!membership) {
                throw new createHttpError.Forbidden("User does not have access to this business")
            }

            const role = await Role.findById(membership.roleId);
            if (role && role.hasFullAccess) {
                req.permissions = ["*"];
                next();
                return;
            }

            const rolePermissions = await RolePermission.find({
                roleId: membership.roleId
            }).populate("permissionId");

            const permissions = rolePermissions.map((rp) => rp.permissionId.key);
            const hasPermission = permissions.includes(permissionKey);

            if (!hasPermission) {
                throw new createHttpError.Forbidden("User does not have the required permission")
            }

            req.permissions = permissions;
            next();
        } catch (error) {
            console.error("RBAC Error:", error);
            next(createHttpError.InternalServerError("Failed to verify permissions"));
        }
    };
};

module.exports = requirePermission;
