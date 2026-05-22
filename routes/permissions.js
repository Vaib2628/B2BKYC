const authentication = require("../middlewares/authentication.js");
const requirePermission = require("../middlewares/requirePermission");
const asyncHandler = require("../utils/asyncHandler");
const permissionValidator = require("../validators/permissionValidator.js");
const validate = require("../middlewares/validate.js");

const router = require("express").Router();

router.use(authentication);

router.post(
    "/",
    requirePermission(["CREATE_PERMISSION"], "SYSTEM"),
    validate(permissionValidator.createPermission),
    asyncHandler(async function _createPermission(req, res, next) {
        const updatedBody = { user: req.user, data: req.body };
        const data = await require("../controllers/permissions/createPermission.js")(updatedBody);
        return res.success({ statusCode: 201, data, message: "Permission created successfully." });
    })
);

router.get(
    "/",
    requirePermission(["GET_PERMISSIONS"]),
    asyncHandler(async function _getPermissions(req, res, next) {
        const updatedBody = { user: req.user, data: req.body };
        const data = await require("../controllers/permissions/getPermissions.js")(updatedBody);
        return res.success({ data });
    })
);

module.exports = router;
