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

router.patch(
    "/:notificationId/read",
    asyncHandler(async function _readNotification(req, res, next) {
        const data = await require("../controllers/notifications/readNotifcation.js")({
            notificationId: req.params.notificationId,
            user: req.user
        });
        return res.success({ statusCode: 204, data });
    })
);

router.patch(
    "/read-all",
    asyncHandler(async function _readAll(req, res, next) {
        const data = await require("../controllers/notifications/readAllNotifcation.js")(req.user);
        return res.success({ data });
    })
);

module.exports = router;
