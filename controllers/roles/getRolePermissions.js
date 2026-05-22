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

    if (role.scope === "BUSINESS" && user.scope !== "SYSTEM" && !role.businessId.equals(user.businessId))
        throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);

    return RolePermission.aggregate([
        {
            $match: {
                roleId: new mongoose.Types.ObjectId("6a0ec95273497c5db12ac32b")
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
            $project: { roleId: 1, permissions: 1 }
        }
    ]);
};
