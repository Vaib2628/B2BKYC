const authentication = require("../middlewares/authentication");
const requirePermission = require("../middlewares/requirePermission");
const asyncHandler = require("../utils/asyncHandler");

const router = require("express").Router();

router.use(authentication);

router.post(
    "/",
    requirePermission({ permission: "audit.view" }),
    asyncHandler(async function _getAuditLogsOfBusiness(req, res, next) {
        const data = await require("../controllers/audits/getAuditLogs")({ user: req.user, body: req.body });
        res.success({ data: data.docs, paginate: data.paginate });
    })
);

module.exports = router;
