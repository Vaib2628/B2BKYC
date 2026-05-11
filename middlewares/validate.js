const createHttpError = require("http-errors");

const validate = (validations) => {
    return async (req, res, next) => {
        let message = "";
        // sequential processing, stops running validations chain if one fails.
        for (const validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                result.array().forEach((err) => {
                    message += `${err.path} : ${err.msg} \n`;
                });
                next(createHttpError(422, message));
            }
        }
        next();
    };
};
module.exports = validate;
