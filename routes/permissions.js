const authentication = require("../middlewares/authentication.js");
const requirePermission = require("../middlewares/requirePermission");
const asyncHandler = require("../utils/asyncHandler");

const router = require("express").Router();

router.use(authentication)

router.post(
    "/",
    requirePermission(["CREATE_PERMISSION"], 'SYSTEM'),
    asyncHandler(async function _createPermission(req, res, next) {
        const updatedBody = {user: req.user, body: req.body};
        const data = await require("../controllers/permissions/createPermission.js")(updatedBody);
        return res.success({ data });
    })
);

module.exports = router;
