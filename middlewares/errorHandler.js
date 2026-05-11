const createHttpError = require("http-errors");

// catch 404 and forward to error handler
function notFound(req, res, next) {
    next(createHttpError(404));
}

// error handler
function errorHandler(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
}

module.exports = {
    notFound,
    errorHandler
};
