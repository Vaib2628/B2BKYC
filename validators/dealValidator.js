const { body, param } = require("express-validator");

module.exports = {
    createDeal: [
        body("counterPartyBusinessId")
            .notEmpty()
            .withMessage("Counterparty business id is required")
            .isMongoId()
            .withMessage("Invalid counterparty business id"),
        body("title")
            .notEmpty()
            .withMessage("Title is required")
            .isString()
            .withMessage("Title must be a string")
            .trim()
            .isLength({
                min: 3,
                max: 150
            })
            .withMessage("Title must be between 3 to 150 characters"),
        body("description").optional().isString().withMessage("Description must be a string").trim(),
        body("value").isNumeric().withMessage("Value must be numeric")
    ]
};
