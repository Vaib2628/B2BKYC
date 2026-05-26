const router = require("express").Router();
const authentication = require("../middlewares/authentication.js");
const asyncHandler = require("../utils/asyncHandler");
const requirePermission = require("../middlewares/requirePermission.js");
const validate = require("../middlewares/validate.js");
const dealValidator = require("../validators/dealValidator.js");

router.use(authentication);

router.post(
    "/",
    requirePermission(["CREATE_DEAL"], "BUSINESS"),
    validate(dealValidator.createDeal),
    asyncHandler(async function _createDeal(req, res, next) {
        const updatedBody = { user: req.user, data: req.body };
        const data = await require("../controllers/deals/createDeal.js")(updatedBody);
        return res.success({ statusCode: 201, message: "deal created successfully.", data });
    })
);

router.get(
    "/",
    requirePermission(["GET_DEALS"], "BUSINESS"),
    asyncHandler(async function _getDeals(req, res, next) {
        const data = await require("../controllers/deals/getDeals.js")(req.user.businessId);
        return res.success({ data });
    })
);

router.get(
    "/:id",
    requirePermission(["GET_DEALS"], "BUSINESS"),
    asyncHandler(async function _getDealById(req, res, next) {
        const updatedBody = { user: req.user, dealId: req.params.id };
        const data = await require("../controllers/deals/getDealById.js")(updatedBody);
        return res.success({ data });
    })
);

router.patch(
    "/:id/accept",
    requirePermission(["ACCEPT_DEAL"], "BUSINESS"),
    asyncHandler(async function _acceptDeal(req, res, next) {
        const updatedBody = { user: req.user, dealId: req.params.id };
        const data = await require("../controllers/deals/acceptDeal.js")(updatedBody);
        return res.success({ data, message: "Deal accepted successfully." });
    })
);

router.patch(
    "/:id/reject",
    requirePermission(["REJECT_DEAL"], "BUSINESS"),
    asyncHandler(async function _rejectDeal(req, res, next) {
        const updatedBody = { user: req.user, dealId: req.params.id };
        const data = await require("../controllers/deals/rejectDeal.js")(updatedBody);
        return res.success({ data, message: "Deal rejected successfully." });
    })
);

router.patch(
    "/:id/cancel",
    requirePermission(["CANCEL_DEAL"], "BUSINESS"),
    asyncHandler(async function _cancelDeal(req, res, next) {
        const updatedBody = { user: req.user, dealId: req.params.id };
        const data = await require("../controllers/deals/cancelDeal.js")(updatedBody);
        return res.success({ data, message: "Deal cancelled successfully." });
    })
);
module.exports = router;
