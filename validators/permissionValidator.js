const { body } = require("express-validator");

module.exports = {
    createPermission: [
        body("key")
            .notEmpty()
            .withMessage("Permission key is required")
            .isString()
            .withMessage("Permission key must be a string")
            .trim()
            .toUpperCase(),

        body("resource")
            .notEmpty()
            .withMessage("Resource is required")
            .isString()
            .withMessage("Resource must be a string")
            .trim()
            .toUpperCase(),

        body("action")
            .notEmpty()
            .withMessage("Action is required")
            .isString()
            .withMessage("Action must be a string")
            .trim()
            .toUpperCase(),

        body("description").optional().isString().withMessage("Description must be a string").trim(),

        body("scope")
            .notEmpty()
            .withMessage("Scope is required")
            .isIn(["SYSTEM", "BUSINESS"])
            .withMessage("Invalid scope")
    ]
};
