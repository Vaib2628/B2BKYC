const authentication = require("../middlewares/authentication.js");
const validate = require("../middlewares/validate.js");
const requirePermission = require("../middlewares/requirePermission.js");
const asyncHandler = require("../utils/asyncHandler");
const userRoleValidator = require("../validators/userRoleValidator.js");

const router = require("express").Router();

router.use(authentication);

router.post(
    "/assign",
    validate(userRoleValidator.assignRoleToUser),
    requirePermission({ permission: "user.assignRole" }),
    asyncHandler(async function _assignRoleToUser(req, res, next) {
        const data = await require("../controllers/userRoles/assignRoleToUser.js")({
            user: req.user,
            ...req.body
        });
        return res.success({ data, statusCode: 201, message: "Role assigned to user successfully" });
    })
);

router.get(
    "/:userId",
    validate(userRoleValidator.getUserRole),
    requirePermission({ permission: "user.readRole" }),
    asyncHandler(async function _getUserRole(req, res, next) {
        const data = await require("../controllers/userRoles/getUserRole.js")({
            userId: req.params.userId,
            businessId: req.query.businessId,
            user: req.user
        });
        return res.success({ data });
    })
);

router.patch(
    "/:userId",
    validate(userRoleValidator.updateUserRole),
    requirePermission({ permission: "user.updateRole" }),
    asyncHandler(async function _updateUserRole(req, res, next) {
        const data = await require("../controllers/userRoles/updateUserRole.js")({
            userId: req.params.userId,
            businessId: req.query.businessId,
            user: req.user,
            ...req.body
        });
        return res.success({ data, message: "User role updated successfully" });
    })
);

router.delete(
    "/:userId",
    validate(userRoleValidator.getUserRole),
    requirePermission({ permission: "user.removeRole" }),
    asyncHandler(async function _removeUserRole(req, res, next) {
        const data = await require("../controllers/userRoles/removeUserRole.js")({
            userId: req.params.userId,
            businessId: req.query.businessId,
            user: req.user
        });
        return res.success({ data, message: "User role removed successfully" });
    })
);

router.get(
    "/role/:roleId",
    validate(userRoleValidator.getUsersByRole),
    requirePermission({ permission: "user.readByRole" }),
    asyncHandler(async function _getUsersByRole(req, res, next) {
        const data = await require("../controllers/userRoles/getUsersByRole.js")({
            roleId: req.params.roleId,
            page: req.query.page,
            limit: req.query.limit,
            user: req.user
        });
        return res.success({ data });
    })
);

module.exports = router;
