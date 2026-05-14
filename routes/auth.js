const authValidator = require("../validators/authValidator");
const validate = require("../middlewares/validate");
const asyncHandler = require("../utils/asyncHandler");
const authentication = require("../middlewares/authentication.js");
const createHttpError = require("http-errors");
const { STATUS_CODES, ERROR_MESSAGES } = require("../constants/errorConstants.js");
const router = require("express").Router();

router.post(
    "/register",
    validate(authValidator.registerValidation),
    asyncHandler(async function _register(req, res, next) {
        const data = await require("../controllers/auth/register")(req.body);
        res.success({ data, message: "User registered successfully", statusCode: 201 });
    })
);

router.post(
    "/login",
    validate(authValidator.loginValidation),
    asyncHandler(async function _login(req, res, next) {
        const data = await require("../controllers/auth/login")(req.body);
        res.cookie("refreshToken", data.refreshToken, REFRESH_TOKEN_OPTIONS)
            .cookie("accessToken", data.accessToken, ACCESS_TOKEN_OPTIONS)
            .success({
                data,
                message: "Login successful"
            })
            .success({ data, message: "Login successful" });
    })
);

router.post(
    "/verify-email",
    validate(authValidator.verifyEmailValidation),
    asyncHandler(async function _verifyEmail(req, res, next) {
        const data = await require("../controllers/auth/verifyEmail")(req.body.token);
        res.success({ data, message: "Email verified successfully" });
    })
);

// Refresh access token
router.post(
    "/refresh",
    asyncHandler(async function _refresh(req, res, next) {
        const token = req.cookies.refreshToken || req.body.refreshToken
        if (!token) throw new createHttpError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_NOT_FOUND)
        const data = await require("../controllers/auth/refreshToken")(token);
        res.cookie("accessToken", data.accessToken, ACCESS_TOKEN_OPTIONS).success({
            data,
            message: "Access token refreshed successfully"
        });
    })
);

router.post(
    "/forgot-password",
    validate(authValidator.forgotPasswordValidation),
    asyncHandler(async function _forgotPassword(req, res, next) {
        await require("../controllers/auth/forgotPassword")(req.body.email);
        res.success({ message: "Password reset email sent if the email is registered" });
    })
);

router.post(
    "/reset-password",
    validate(authValidator.resetPasswordValidation),
    asyncHandler(async function _resetPassword(req, res, next) {
        await require("../controllers/auth/resetPassword")(req.body);
        res.success({ message: "Password reset successful" });
    })
);

router.use(authentication);

router.post(
    "/logout",
    asyncHandler(async function _logout(req, res, next) {
        await require("../controllers/auth/logout.js")(req.user._id);
        res.clearCookie("refreshToken", REFRESH_TOKEN_OPTIONS)
            .clearCookie("accessToken", ACCESS_TOKEN_OPTIONS)
            .success({ message: "Logout successful" });
    })
);

const ACCESS_TOKEN_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000
};

const REFRESH_TOKEN_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 10 * 24 * 60 * 60 * 1000
};

module.exports = router;
