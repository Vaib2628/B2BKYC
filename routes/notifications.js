const router = require("express").Router();
const authentication = require("../middlewares/authentication");
const asyncHandler = require("../utils/asyncHandler");

router.use(authentication);

router.post(
    "/",
    asyncHandler(async function getNotifications(req, res, next) {
        const data = await require("../controllers/notifications/getNotifications.js")({
            user: req.user,
            options: req.body.options
        });
        return res.success({ data });
    })
);

module.exports = router;
