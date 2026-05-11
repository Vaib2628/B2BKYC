const validate = require("../middlewares/validate");
const asyncHandler = require("../utils/asyncHandler");
const businessValidator = require("../validators/businessValidator");
const router = require("express").Router();

router.post(
    "/",
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
        res.success({ data, message: "Business onboarded successfully", statusCode: 200 });
    })
);
module.exports = router;
