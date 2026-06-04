const { body, param } = require("express-validator");

module.exports = {
    onboardBusiness: [
        body("businessName").trim().notEmpty().withMessage("Business name is required"),
        body("industry").trim().notEmpty().withMessage("Industry is required"),
        body("registeredPhone")
            .notEmpty()
            .withMessage("Registered Phone number is required")
            .isMobilePhone("en-IN")
            .withMessage("Registered Phone number must be a valid 10-digit Indian mobile number"),
        body("firstName").notEmpty().withMessage("First name is required"),
        body("lastName").notEmpty().withMessage("Last name is required"),
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

    registerBusiness: [
        body("businessName").trim().notEmpty().withMessage("Business name is required"),
        body("legalName").notEmpty().withMessage("Legal name is required"),
        body("companyType")
            .notEmpty()
            .withMessage("Company type is required")
            .isIn(["PRIVATE_LIMITED", "PUBLIC_LIMITED", "LLP", "PARTNERSHIP", "SOLE_PROPRIETORSHIP", "OTHER"])
            .withMessage("Invalid company type"),
        body("industry").notEmpty().withMessage("Industry is required"),
        body("primaryContactNumber")
            .notEmpty()
            .withMessage("Primary contact number is required")
            .isMobilePhone("en-IN")
            .withMessage("Primary contact number must be a valid 10-digit Indian mobile number"),
        body("registeredAddress.line1").notEmpty().withMessage("Registered address line 1 is required"),
        body("registeredAddress.city").notEmpty().withMessage("Registered address city is required"),
        body("registeredAddress.state").notEmpty().withMessage("Registered address state is required"),
        body("registeredAddress.country").notEmpty().withMessage("Registered address country is required"),
        body("registeredAddress.pincode")
            .notEmpty()
            .withMessage("Registered address pincode is required")
            .isPostalCode("IN")
            .withMessage("Registered address pincode must be a valid 6-digit Indian postal code"),
        body("firstName").notEmpty().withMessage("First name is required"),
        body("lastName").notEmpty().withMessage("Last name is required"),
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

    getBusinessById: [param("businessId").isMongoId().withMessage("Invalid business ID")]
};
