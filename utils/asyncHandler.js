const createHttpError = require("http-errors");

module.exports = asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch((err) => {
        next(createHttpError(err));
    });
};
