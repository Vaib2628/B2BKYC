const crypto = require("crypto");

module.exports = (req, res, next) => {
    req.requestId = crypto.randomUUID();

    res.setHeader("x-request-id", req.requestId);

    next();
};
