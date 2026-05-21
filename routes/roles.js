const authentication = require("../middlewares/authentication.js");
const requirePermission = require("../middlewares/requirePermission.js");
const asyncHandler = require("../utils/asyncHandler");

const router = require("express").Router();

router.use(authentication);

router.post(
    "/",
    requirePermission(["CREATE_SYSTEM_ROLE", "CREATE_BUSINESS_ROLE"]),
    asyncHandler(async function _createRole(req, res, next) {
        const data = await require("../controllers/roles/createRole.js")(req.body);
        return res.success({ data });
    })
);

module.exports = router;
