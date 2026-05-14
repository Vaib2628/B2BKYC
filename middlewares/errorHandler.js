const createHttpError = require("http-errors");

// catch 404 and forward to error handler
function notFound(req, res, next) {
    next(createHttpError(404));
}

// error handler
function errorHandler(err, req, res, next) {
    const statusCode = err.status || err.statusCode || 500;

    // Helpful for debugging in development and also for logging errors in production
    console.log({
        message: err.message,
        stack : err.stack,
        url: req.originalUrl,
        method: req.method
    })

    const isDev = process.env.NODE_ENV === "development";
    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
}

module.exports = {
    notFound,
    errorHandler
};
