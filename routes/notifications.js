const router = require("express").Router();
const authentication = require("../middlewares/authentication");
const asyncHandler = require("../utils/asyncHandler");

router.use(authentication);

router.get(
    "/",
    asyncHandler(async function getNotifications(req, res, next) {
        const data = await require("../controllers/notifications/getNotifications.js")();
        return res.success({ data });
    })
);

module.exports = router;
