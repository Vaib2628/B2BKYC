const createHttpError = require("http-errors");
const Role = require("../../models/Role");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const Permission = require("../../models/Permission");
const RolePermission = require("../../models/RolePermission");

module.exports = async ({ user, roleId, permissionIds }) => {
    const role = await Role.findById(roleId);
    if (!role) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.ROLE_NOT_FOUND);
    if (role.scope === "BUSINESS" && (!role.businessId || role.businessId !== user.businessId)) {
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ROLE_OUT_OF_SCOPE);
    }
    // permissions - does all are of this same scope

    const permissions = await Permission.find({ _id: { $in: permissionIds } });
    if (permissions.length !== permissionIds.length)
        throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.SOME_PERMISSION_NOTFOUDN);

    const rolePermissions = [];

    for (const permission of permissions) {
        if (user.scope === "BUSINESS" && permission.scope === "SYSTEM")
            throw new createHttpError(STATUS_CODES.FORBIDDEN, `Can not assign system permission ${permission._id}`);

        const exists = await RolePermission.findOne({
            permissionId: permission._id,
            roleId: role._id
        });
        if (!exists) {
            rolePermissions.push({
                roleId: role._id,
                permissionId: permission._id
            });
        }
    }

    if (rolePermissions.length > 0) await RolePermission.insertMany(rolePermissions);
    return {
        assignedPermissions: rolePermissions.length
    };
};
