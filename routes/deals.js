const router = require("express").Router();
const authentication = require("../middlewares/authentication.js");
const asyncHandler = require("../utils/asyncHandler");
const requirePermission = require("../middlewares/requirePermission.js")
const validate = require("../middlewares/validate.js")
const dealValidator = require("../validators/dealValidator.js")

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

module.exports = router;
