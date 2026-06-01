const createHttpError = require("http-errors");
const Role = require("../../models/Role");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const RolePermission = require("../../models/RolePermission");
const { default: mongoose } = require("mongoose");

module.exports = async ({ roleId, user }) => {
    const role = await Role.findById(roleId);
    if (!role) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.ROLE_NOT_FOUND);

    if (role.scope === "SYSTEM" && user.scope === "BUSINESS")
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ROLE_OUT_OF_SCOPE);

    if (role.scope === "BUSINESS" && user.scope === "BUSINESS" && !role.businessId.equals(user.businessId))
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);

    const [permission] = await RolePermission.aggregate([
        {
            $match: {
                roleId: new mongoose.Types.ObjectId(roleId)
            }
        },
        {
            $lookup: {
                from: "permissions",
                localField: "permissionId",
                foreignField: "_id",
                as: "permissions"
            }
        },
        {
            $unwind: "$permissions"
        },
        {
            $group: {
                _id: "$roleId",
                permissions: { $push: "$permissions" }
            }
        }
    ]);
    return (
        permission || {
            _id: roleId,
            scope: role.scope,
            hasFullAccess: role.hasFullAccess,
            permissions: []
        }
    );
};
