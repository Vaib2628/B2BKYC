var express = require("express");
var router = express.Router();

router.use("/auth", require("./auth"));
router.use("/businesses", require("./businesses"));

module.exports = router;
