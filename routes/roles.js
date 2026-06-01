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
        const data = await require("../controllers/roles/createRole.js")({user: req.user, ...req.body });
        return res.success({ data });
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
    "/",
    requirePermission({ permission: "role.read"}),
    asyncHandler(async function _getRoles(req, res, next) {
        const data = await require("../controllers/roles/getRoles.js")(req.user);
        return res.success({ data });
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

module.exports = router;
