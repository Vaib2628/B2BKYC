const createHttpError = require("http-errors");
const logger = require("./logger");

module.exports = asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch((err) => {
        logger.error("Handler Error", {
            message: err.message,
            function: fn.name,
            method: req.method,
            path: req.path,
            stack: err.stack
        });
        next(createHttpError(err));
    });
};
