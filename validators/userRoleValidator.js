const { body, param, query } = require("express-validator");

module.exports = {
    assignRoleToUser: [
        body("userId")
            .notEmpty()
            .withMessage("User ID is required")
            .isMongoId()
            .withMessage("Invalid user ID format"),

        body("roleId")
            .notEmpty()
            .withMessage("Role ID is required")
            .isMongoId()
            .withMessage("Invalid role ID format"),

        body("businessId")
            .optional()
            .isMongoId()
            .withMessage("Invalid business ID format")
    ],

    getUserRole: [
        param("userId")
            .notEmpty()
            .withMessage("User ID is required")
            .isMongoId()
            .withMessage("Invalid user ID format"),

        query("businessId")
            .optional()
            .isMongoId()
            .withMessage("Invalid business ID format")
    ],

    updateUserRole: [
        param("userId")
            .notEmpty()
            .withMessage("User ID is required")
            .isMongoId()
            .withMessage("Invalid user ID format"),

        body("newRoleId")
            .notEmpty()
            .withMessage("New role ID is required")
            .isMongoId()
            .withMessage("Invalid role ID format"),

        query("businessId")
            .optional()
            .isMongoId()
            .withMessage("Invalid business ID format")
    ],

    getUsersByRole: [
        param("roleId")
            .notEmpty()
            .withMessage("Role ID is required")
            .isMongoId()
            .withMessage("Invalid role ID format"),

        query("page")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Page must be a positive integer"),

        query("limit")
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage("Limit must be between 1 and 100")
    ]
};
