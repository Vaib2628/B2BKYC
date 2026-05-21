const createHttpError = require("http-errors");
const Membership = require("../models/Membership");
const RolePermission = require("../models/RolePermission");
const Role = require("../models/Role");

const requirePermission = (permissionKeys = []) => {
    return async (req, res, next) => {
        try {
            const { membershipId } = req.user;

            const membership = await Membership.findOne({
                _id: membershipId,
                status: "ACTIVE"
            });

            if (!membership) {
                throw createHttpError(403, "Membership not found");
            }

            const role = await Role.findById(membership.roleId);

            if (!role) {
                throw createHttpError(403, "Role not found");
            }

            if (role.scope !== membership.scope) {
                throw createHttpError(403, "Invalid role scope");
            }

            if (role.scope === "BUSINESS" && !membership.businessId) {
                throw createHttpError(403, "Business membership required");
            }

            if (role.hasFullAccess) {
                req.permissions = ["*"];
                return next();
            }

            const rolePermissions = await RolePermission.find({
                roleId: membership.roleId
            }).populate("permissionId");

            const permissions = rolePermissions.map(
                (rp) => rp.permissionId.key
            );

            const hasPermission = permissionKeys.some(
                (permissionKey) =>
                    permissions.includes(permissionKey)
            );

            if (!hasPermission) {
                throw createHttpError(
                    403,
                    "User does not have the required permission"
                );
            }

            req.permissions = permissions;

            next();

        } catch (error) {
            console.error("RBAC Error:", error);

            if (!res.headersSent) {
                next(error);
            }
        }
    };
};

module.exports = requirePermission;