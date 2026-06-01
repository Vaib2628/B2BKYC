const authentication = require("../middlewares/authentication");
const asyncHandler = require("../utils/asyncHandler");

const router = require("express").Router();

router.use(authentication);

router.get(
    "/",
    asyncHandler(async function _getTrustScore(req, res, next) {
        const data = await require("../controllers/trustscore/getTrustScore.js")({ businessId: req.user.businessId });
        return res.success({ data });
    })
);

module.exports = router;
