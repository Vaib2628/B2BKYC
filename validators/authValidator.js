const { body } = require("express-validator");

module.exports = {
    loginValidation: [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required.")
            .isEmail()
            .withMessage("Please provide valid email address")
            .normalizeEmail()
    ],

    verifyEmailValidation: [body("token").notEmpty().withMessage("Verification token is required.")],

    registerValidation: [
        body("firstName").trim().notEmpty().withMessage("First name is required."),
        body("lastName").trim().notEmpty().withMessage("Last name is required."),
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required.")
            .isEmail()
            .withMessage("Please provide valid email address")
            .normalizeEmail(),
        body("password")
            .notEmpty()
            .withMessage("Password is required.")
            .isStrongPassword({ minLength: 6, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
            .withMessage(
                "Password must be strong and min length of 6, Containing 1 Symbol, 1 Uppercase letter, and 1 Number."
            ),
        body("confirmPassword")
            .notEmpty()
            .withMessage("Confirm password is required.")
            .custom((value, { req }) => value === req.body.password)
            .withMessage("Passwords do not match.")
    ],

    forgotPasswordValidation: [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required.")
            .isEmail()
            .withMessage("Please provide valid email address")
            .normalizeEmail()
    ],

    resetPasswordValidation: [
        body("token").notEmpty().withMessage("Reset token is required."),
        body("password")
            .notEmpty()
            .withMessage("Password is required.")
            .isStrongPassword({ minLength: 6, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
            .withMessage(
                "Password must be strong and min length of 6, Containing 1 Symbol, 1 Uppercase letter, and 1 Number."
            ),
        body("confirmPassword")
            .notEmpty()
            .withMessage("Confirm password is required.")
            .custom((value, { req }) => value === req.body.password)
            .withMessage("Passwords do not match.")
    ],

    changePasswordValidation: [
        body("currentPassword").notEmpty().withMessage("Password is required."),
        body("newPassword")
            .notEmpty()
            .withMessage("Password is required.")
            .isStrongPassword({ minLength: 6, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
            .withMessage(
                "Password must be strong and min length of 6, Containing 1 Symbol, 1 Uppercase letter, and 1 Number."
            )
            .custom((value, { req }) => value !== req.body.currentPassword)
            .withMessage("New password must be different from the current password"),
        body("confirmPassword")
            .notEmpty()
            .withMessage("Confirm password is required.")
            .custom((value, { req }) => value === req.body.newPassword)
            .withMessage("Passwords do not match.")
    ]
};
