const logger = require("./logger");

module.exports = {
    info(message, meta = {}) {
        logger.info(message, meta);
    },

    warn(message, meta = {}) {
        logger.warn(message, meta);
    },

    debug(message, meta = {}) {
        logger.debug(message, meta);
    },

    error(message, error = null, meta = {}) {
        logger.error(message, {
            ...meta,

            ...(error && {
                errorName: error.name,
                errorMessage: error.message,
                errorStack: error.stack,
                errorCode: error.code
            })
        });
    },

    logUserAction({ requestId, userId, action, resource, metadata = {} }) {
        logger.info("User Action", {
            requestId,
            userId,
            action,
            resource,
            metadata
        });
    },

    logDatabaseQuery({ requestId, operation, collection, durationMs, metadata = {} }) {
        logger.debug("Database Query", {
            requestId,
            operation,
            collection,
            durationMs,
            metadata
        });
    },

    logApiCall({ requestId, method, endpoint, statusCode, durationMs, metadata = {} }) {
        const level = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";

        logger[level]("API Call", {
            requestId,
            method,
            endpoint,
            statusCode,
            durationMs,
            metadata
        });
    },

    logAuthEvent({ requestId, eventType, userId, success, metadata = {} }) {
        logger[success ? "info" : "warn"]("Authentication Event", {
            requestId,
            eventType,
            userId,
            success,
            metadata
        });
    }
};
