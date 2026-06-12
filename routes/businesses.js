const authentication = require("../middlewares/authentication.js");
const requirePermission = require("../middlewares/requirePermission.js");
const validate = require("../middlewares/validate");
const asyncHandler = require("../utils/asyncHandler");
const businessValidator = require("../validators/businessValidator");
const router = require("express").Router();

router.post(
    "/",
    validate(businessValidator.registerBusiness),
    asyncHandler(async function _createBusiness(req, res, next) {
        const data = await require("../controllers/businesses/createBusiness")(req.body);
        res.success({ data, message: "Business created successfully", statusCode: 201 });
    })
);

router.post(
    "/onboard",
    validate(businessValidator.onboardBusiness),
    asyncHandler(async function _onboardBusiness(req, res, next) {
        const data = await require("../controllers/businesses/onboardBusiness")(req.body);
        res.success({
            data,
            message: "Business Registered, Please verify mail to access the dashboard",
            statusCode: 200
        });
    })
);

router.use(authentication); // All routes below require authentication

router.post(
    "/",
    requirePermission({ permission: "business.list", scope: "SYSTEM" }),
    asyncHandler(async function _getBusinesses(req, res, next) {
        const data = await require("../controllers/businesses/getBusinesses.js")(req.body);
        res.success({ data, message: "Businesses retrieved successfully" });
    })
);

router.post(
    "/counterparties",
    requirePermission({ permission: "deal.counterparty.list", scope: "BUSINESS" }),
    asyncHandler(async function _getCounterParties(req, res, next) {
        const data = await require("../controllers/businesses/getCounterParties.js")({
            businessId: req.user.businessId,
            options: req.body.options
        });
        return res.success({ data: data.docs, paginate: data.paginate });
    })
);

router.get(
    "/:businessId",
    requirePermission({ permission: "business.view", scope: "SYSTEM" }),
    validate(businessValidator.getBusinessById),
    asyncHandler(async function _getBusiness(req, res, next) {
        const data = await require("../controllers/businesses/getBusinessById.js")(req.params.businessId);
        return res.success({ data, message: "Business retrieved successfully" });
    })
);

router.get(
    "/:businessId/profile",
    requirePermission({ permission: "business.view", scope: "BUSINESS" }),
    asyncHandler(async function _getProfile(req, res, next) {
        const data = await require("../controllers/businesses/getProfile.js")(req.params.businessId);
        return res.success({ data, message: "Profile fetched successfully." });
    })
);

module.exports = router;
