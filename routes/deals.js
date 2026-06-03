const router = require("express").Router();
const authentication = require("../middlewares/authentication.js");
const asyncHandler = require("../utils/asyncHandler");
const requirePermission = require("../middlewares/requirePermission.js");
const validate = require("../middlewares/validate.js");
const dealValidator = require("../validators/dealValidator.js");
const disputeValidation = require("../validators/disputeValidator.js");

router.use(authentication);

router.post(
    "/",
    requirePermission({ permission: "deal.create", scope: "BUSINESS" }),
    validate(dealValidator.createDeal),
    asyncHandler(async function _createDeal(req, res, next) {
        const updatedBody = { user: req.user, data: req.body };
        const data = await require("../controllers/deals/createDeal.js")(updatedBody);
        return res.success({ statusCode: 201, message: "deal created successfully.", data });
    })
);

router.get(
    "/disputes",
    requirePermission({ permission: "dispute.read", scope: "BUSINESS" }),
    asyncHandler(async function _getDisputes(req, res, next) {
        const data = await require("../controllers/dealdisputes/getDisputes.js")({ businessId: req.user.businessId });
        return res.success({ data });
    })
);

router.get(
    "/",
    requirePermission({ permission: "deal.read", scope: "BUSINESS" }),
    asyncHandler(async function _getDeals(req, res, next) {
        const data = await require("../controllers/deals/getDeals.js")({
            businessId: req.user.businessId,
            type: req.query.type
        });
        return res.success({ data });
    })
);

router.get(
    "/:id",
    requirePermission({ permission: "deal.read", scope: "BUSINESS" }),
    asyncHandler(async function _getDealById(req, res, next) {
        const updatedBody = { user: req.user, dealId: req.params.id };
        const data = await require("../controllers/deals/getDealById.js")(updatedBody);
        return res.success({ data });
    })
);

router.patch(
    "/:id/accept",
    requirePermission({ permission: "deal.accept", scope: "BUSINESS" }),
    asyncHandler(async function _acceptDeal(req, res, next) {
        const updatedBody = { user: req.user, dealId: req.params.id };
        const data = await require("../controllers/deals/acceptDeal.js")(updatedBody);
        return res.success({ data, message: "Deal accepted successfully." });
    })
);

router.patch(
    "/:id/reject",
    requirePermission({ permission: "deal.reject", scope: "BUSINESS" }),
    asyncHandler(async function _rejectDeal(req, res, next) {
        const updatedBody = { user: req.user, dealId: req.params.id };
        const data = await require("../controllers/deals/rejectDeal.js")(updatedBody);
        return res.success({ data, message: "Deal rejected successfully." });
    })
);

router.patch(
    "/:id/cancel",
    requirePermission({ permission: "deal.cancel", scope: "BUSINESS" }),
    asyncHandler(async function _cancelDeal(req, res, next) {
        const updatedBody = { user: req.user, dealId: req.params.id };
        const data = await require("../controllers/deals/cancelDeal.js")(updatedBody);
        return res.success({ data, message: "Deal cancelled successfully." });
    })
);

router.patch(
    "/:id/complete",
    requirePermission({ permission: "deal.complete", scope: "BUSINESS" }),
    asyncHandler(async function _completeDeal(req, res, next) {
        const data = await require("../controllers/deals/completeDeal.js")({
            user: req.user,
            dealId: req.params.id
        });
        return res.success({ data, message: "Deal completed" });
    })
);

router.patch(
    "/:id",
    requirePermission({ permission: "deal.update", scope: "BUSINESS" }),
    asyncHandler(async function _updateDeal(req, res, next) {
        const updatedBody = { user: req.user, dealId: req.params.id, data: req.body };
        await require("../controllers/deals/updateDeal.js")(updatedBody);
        return res.success({ statusCode: 204 });
    })
);

router.post(
    "/:id/disputes",
    validate(disputeValidation.createDispute),
    requirePermission({ permission: "dispute.create", scope: "BUSINESS" }),
    asyncHandler(async function _createDispute(req, res, next) {
        const data = await require("../controllers/dealdisputes/createDispute.js")({
            user: req.user,
            dealId: req.params.id,
            reason: req.body.reason
        });
        return res.success({ statusCode: 201, data, message: "Dispute raised successfully." });
    })
);

router.post(
    "/disputes/:id/resolve",
    validate(disputeValidation.resolveDispute),
    requirePermission({ permission: "dispute.resolve", scope: "BUSINESS" }),
    asyncHandler(async function _resolveDispute(req, res, next) {
        const data = await require("../controllers/dealdisputes/resolveDispute.js")({
            user: req.user,
            disputeId: req.params.id,
            resolutionNote: req.body.resolutionNote
        });
        return res.success({ statusCode: 201, data, message: "Dispute resolved successfully." });
    })
);

module.exports = router;
