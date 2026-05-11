const ApiResponse = require("../utils/ApiResponse");

module.exports = responseHandler = (req, res, next) => {
    res.success = ({ data, message = "Executed successfully", statusCode = 200, paginate = null }) => {
        const response = new ApiResponse(data, statusCode, paginate, message);
        return res.status(statusCode).json(response);
    };
    next();
};
