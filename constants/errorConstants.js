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
        ROLE_NOT_FOUND: "Role not found",
        PERMISSION_ALREADY_EXISTS: "Permission already exists.",
        ROLE_ALREADY_EXISTS: "Role already exists",
        DOC_ALREADY_PROCESSED: "Document has been already proceeded.",
        DOC_NOT_FOUND: "Document not found",
        UPLOAD_NOT_FOUND: "Upload not found",
        DOC_UNDER_REVIEW: "Document already under review",
        BUSINESS_ALREADY_EXISTS: "A business with the same name public name already exists.",
        BUSINESS_NOT_FOUND: "No business found with given details",
        USER_NOT_FOUND: "User not found.",
        ACCOUNT_LOCKED: "Account locked due to multiple failed login attempts. Please try again after 24 hours.",
        EMAIL_ALREADY_EXISTS: "A user with the same email already exists.",
        INVALID_CREDENTIALS: "Invalid email or password.",
        CONFIRM_PASSWORD_NOT_MATCHED: "Confirm password does not match.",
        EMAIL_NOT_VERIFIED: "Email not verified. Please verify your email before logging in.",
        INVALID_REFRESH_TOKEN: "Invalid refresh token.",
        INVALID_OR_EXPIRED_TOKEN: "Invalid or expired token.",
        TOKEN_NOT_FOUND: "Unauthorized request, Token not found or expired may be",
        MEMBERSHIP_NOT_FOUND: "Membership not found.",

        INVALID_CURRENT_PASSWORD : "Current Password is not valid",
        UNAUTHORIZED: "Unauthenticated access.",
        UPLOAD_FILE: "Please upload a file",
        ACCESS_NOT_ALLOWED: "Not allowed to access this resource",
        UPLOAD_ALREADY_PROCESSED: "Upload has been already processed."
    }
};
