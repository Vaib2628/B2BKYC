var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var indexRouter = require("./routes/index");

var app = express();
app.use(
    cors({
        origin: ["http://localhost:5173", "http://192.168.100.79:5173"],
        credentials: true
    })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(require("./middlewares/responseHandler"));
app.use("/api/v1", indexRouter);

app.use(require("./middlewares/errorHandler").notFound);
app.use(require("./middlewares/errorHandler").errorHandler);

module.exports = app;
