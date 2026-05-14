var express = require("express");
var router = express.Router();

router.use("/auth", require("./auth"));
router.use("/businesses", require("./businesses"));
// router.use("/kyc", require("./kyc"))

module.exports = router;
