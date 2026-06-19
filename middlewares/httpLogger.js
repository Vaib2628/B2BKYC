const logger = require("../utils/loggerUtils");

module.exports = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        logger.logApiCall({
            requestId: req.requestId,
            method: req.method,
            endpoint: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Date.now() - start
        });
    });

    next();
};
