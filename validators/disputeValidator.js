const { body, param } = require("express-validator");

module.exports = {
    createDispute: [
        body("reason")
            .trim()
            .notEmpty()
            .withMessage("Dispute reason is required")
            .isLength({ min: 10, max: 500 })
            .withMessage("Dispute reason must be between 10 and 500 characters")
    ],

    resolveDispute: [
        body("resolutionNote")
            .trim()
            .notEmpty()
            .withMessage("Resolution note is required")
            .isLength({ min: 10, max: 500 })
            .withMessage("Resolution note must be between 10 and 500 characters")
    ]
};
