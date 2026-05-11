const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!accessToken) next(createHttpError.Unauthorized("Access token is missing"));
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            businessId: decoded.businessId
        };
        next();
    } catch (error) {
        next(createHttpError.InternalServerError("Failed to authenticate user"));
    }
}