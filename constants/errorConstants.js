module.exports = {
    STATUS_CODES: {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        UNPROCESSABLE_ENTITY: 422,
        INTERNAL_SERVER_ERROR: 500
    },

    ERROR_MESSAGES: {
        BUSINESS_ALREADY_EXISTS: "A business with the same CIN, PAN, or GST number already exists.",

        USER_NOT_FOUND: "User not found.",
        ACCOUNT_LOCKED: "Account locked due to multiple failed login attempts. Please try again after 24 hours."
    }
};  