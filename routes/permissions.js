const authentication = require("../middlewares/authentication.js");
const requirePermission = require("../middlewares/requirePermission");
const asyncHandler = require("../utils/asyncHandler");
const permissionValidator = require("../validators/permissionValidator.js");
const validate = require("../middlewares/validate.js");

const router = require("express").Router();

router.use(authentication);

router.post(
    "/",
    requirePermission({ permission: "permission.create", scope: "SYSTEM" }),
    validate(permissionValidator.createPermission),
    asyncHandler(async function _createPermission(req, res, next) {
        const updatedBody = { user: req.user, data: req.body };
        const data = await require("../controllers/permissions/createPermission.js")(updatedBody);
        return res.success({ statusCode: 201, data, message: "Permission created successfully." });
    })
);

router.get(
    "/",
    requirePermission({ permission: "permission.read" }),
    asyncHandler(async function _getPermissions(req, res, next) {
        const updatedBody = { user: req.user, data: req.body };
        const data = await require("../controllers/permissions/getPermissions.js")(updatedBody);
        return res.success({ data });
    })
);

router.get(
    "/:permissionId",
    validate(permissionValidator.getPermissionById),
    requirePermission({ permission: "permission.read" }),
    asyncHandler(async function _getPermissionById(req, res, next) {
        const data = await require("../controllers/permissions/getPermissionById.js")({
            permissionId: req.params.permissionId,
            user: req.user
        });
        return res.success({ data });
    })
);

router.patch(
    "/:permissionId",
    validate(permissionValidator.updatePermission),
    requirePermission({ permission: "permission.update", scope: "SYSTEM" }),
    asyncHandler(async function _updatePermission(req, res, next) {
        const data = await require("../controllers/permissions/updatePermission.js")({
            permissionId: req.params.permissionId,
            user: req.user,
            ...req.body
        });
        return res.success({ data, message: "Permission updated successfully" });
    })
);

router.delete(
    "/:permissionId",
    validate(permissionValidator.getPermissionById),
    requirePermission({ permission: "permission.delete", scope: "SYSTEM" }),
    asyncHandler(async function _deletePermission(req, res, next) {
        const data = await require("../controllers/permissions/deletePermission.js")({
            permissionId: req.params.permissionId,
            user: req.user
        });
        return res.success({ data, message: "Permission deleted successfully" });
    })
);

module.exports = router;
