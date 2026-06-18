const winston = require("winston");
require("winston-daily-rotate-file");

const errorFilter = winston.format((info) => {
    return info.level === "error" ? info : false;
});

const appFilter = winston.format((info) => {
    return info.level !== "error" ? info : false;
});

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",

    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.json()
    ),

    transports: [
        // Info & Warn Logs
        new winston.transports.DailyRotateFile({
            filename: "logs/application/%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "30d",
            zippedArchive: true,
            format: winston.format.combine(appFilter())
        }),

        // Error Logs
        new winston.transports.DailyRotateFile({
            filename: "logs/error/%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "90d",
            zippedArchive: true,
            format: winston.format.combine(errorFilter())
        })
    ],

    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            filename: "logs/exception/%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "90d",
            zippedArchive: true
        })
    ],

    rejectionHandlers: [
        new winston.transports.DailyRotateFile({
            filename: "logs/rejection/%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "90d",
            zippedArchive: true
        })
    ]
});

if (process.env.NODE_ENV != "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        })
    );
}

module.exports = logger;
