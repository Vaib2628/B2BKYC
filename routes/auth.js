const authValidator = require("../validators/authValidator");
const validate = require("../middlewares/validate");
const asyncHandler = require("../utils/asyncHandler");
const router = require("express").Router();

router.get("/", validate(authValidator.loginValidation), (req, res) => {
    res.json({
        message: "Welcome to the authentication API"
    });
});

router.post(
    "/register",
    validate(authValidator.registerValidation),
    asyncHandler(async function _register(req, res, next) {
        const data = require("../controllers/auth/register")(req.body);
        res.success({ data, message: "User registered successfully", statusCode: 201 });
    })
);

router.post(
    "/login",
    validate(authValidator.loginValidation),
    asyncHandler(async function _login(req, res, next) {
        const data = await require("../controllers/auth/login")(req.body);
        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 10 * 24 * 60 * 60 * 1000
        })
            .cookie("accessToken", data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            })
            .success({ data: { accessToken: data.accessToken }, message: "Login successful" });
    })
);



module.exports = router;
