const createHttpError = require("http-errors");
const logger = require("../utils/loggerUtils");

function notFound(req, res, next) {
    next(createHttpError(404));
}

function errorHandler(err, req, res, next) {
    const statusCode = err.status || err.statusCode || 500;

    logger.error("Application Error", err, {
        requestId: req.requestId,
        statusCode,
        method: req.method,
        endpoint: req.originalUrl,
        userId: req.user?._id,
        businessId: req.user?.businessId,
        body: req.body,
        query: req.query,
        params: req.params
    });

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        requestId: req.requestId
    });
}

module.exports = {
    notFound,
    errorHandler
};
