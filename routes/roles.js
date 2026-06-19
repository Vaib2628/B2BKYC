const authentication = require("../middlewares/authentication.js");
const validate = require("../middlewares/validate.js");
const requirePermission = require("../middlewares/requirePermission.js");
const asyncHandler = require("../utils/asyncHandler");
const roleValidator = require("../validators/roleValidator.js");

const router = require("express").Router();

router.use(authentication);

router.post(
    "/",
    validate(roleValidator.createRole),
    requirePermission({ permission: "role.create" }),
    asyncHandler(async function _createRole(req, res, next) {
        const data = await require("../controllers/roles/createRole.js")({ user: req.user, ...req.body });
        return res.success({ data, statusCode: 201, message: "Role created successfully" });
    })
);

router.get(
    "/",
    requirePermission({ permission: "role.read" }),
    asyncHandler(async function _getRoles(req, res, next) {
        const data = await require("../controllers/roles/getRoles.js")(req.user);
        return res.success({ data });
    })
);

router.get(
    "/:roleId",
    validate(roleValidator.getRolePermission),
    requirePermission({ permission: "role.read" }),
    asyncHandler(async function _getRoleById(req, res, next) {
        const data = await require("../controllers/roles/getRoleById.js")({
            roleId: req.params.roleId,
            user: req.user
        });
        return res.success({ data });
    })
);

router.patch(
    "/:roleId",
    validate(roleValidator.updateRole),
    requirePermission({ permission: "role.update" }),
    asyncHandler(async function _updateRole(req, res, next) {
        const data = await require("../controllers/roles/updateRole.js")({
            roleId: req.params.roleId,
            user: req.user,
            ...req.body
        });
        return res.success({ data, message: "Role updated successfully" });
    })
);

router.delete(
    "/:roleId",
    validate(roleValidator.getRolePermission),
    requirePermission({ permission: "role.delete" }),
    asyncHandler(async function _deleteRole(req, res, next) {
        const data = await require("../controllers/roles/deleteRole.js")({
            roleId: req.params.roleId,
            user: req.user
        });
        return res.success({ data, statusCode: 200, message: "Role deleted successfully" });
    })
);

router.post(
    "/:roleId/permissions",
    requirePermission({ permission: "role.assignPermission" }),
    validate(roleValidator.assingPermission),
    asyncHandler(async function _assignPermission(req, res, next) {
        const updatedBody = { user: req.user, roleId: req.params.roleId, permissionIds: req.body.permissionIds };
        const data = await require("../controllers/roles/assingPermission.js")(updatedBody);
        return res.success({ data, statusCode: 201, message: "Permission assigned to role successfully." });
    })
);

router.get(
    "/:roleId/permissions",
    validate(roleValidator.getRolePermission),
    requirePermission({ permission: "role.readPermissions", scope: "SYSTEM" }),
    asyncHandler(async function _getRolesPermission(req, res, next) {
        const updatedBody = { roleId: req.params.roleId, user: req.user };
        const data = await require("../controllers/roles/getRolePermissions.js")(updatedBody);
        return res.success({ data });
    })
);

router.delete(
    "/:roleId/permissions/:permissionId",
    validate(roleValidator.removePermissionFromRole),
    requirePermission({ permission: "role.removePermission" }),
    asyncHandler(async function _removePermissionFromRole(req, res, next) {
        const data = await require("../controllers/roles/removePermissionFromRole.js")({
            roleId: req.params.roleId,
            permissionId: req.params.permissionId,
            user: req.user
        });
        return res.success({ data, message: "Permission removed from role successfully" });
    })
);

module.exports = router;
