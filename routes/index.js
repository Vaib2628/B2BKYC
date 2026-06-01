var express = require("express");
var router = express.Router();

router.use("/auth", require("./auth"));
router.use("/businesses", require("./businesses"));
router.use("/kyc", require("./kyc"))
router.use("/roles", require("./roles"))
router.use("/permissions", require("./permissions"))
router.use("/deals",require("./deals"))
router.use("/trustscore", require("./trustscore"))

module.exports = router;
