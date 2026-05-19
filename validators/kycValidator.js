const { body } = require("express-validator");
const createHttpError = require("http-errors");
const { STATUS_CODES, ERROR_MESSAGES } = require("../constants/errorConstants");

module.exports = {
    uploadValidation: [
        body("document").custom((value, { req }) => {
            if (!req.file) throw new createHttpError(STATUS_CODES.BAD_REQUEST, ERROR_MESSAGES.UPLOAD);
            return true;
        }),
        body("type")
            .isIn(["GST_CERTIFICATE", "PAN_CARD", "INCORPORATION_CERTIFICATE", "BANK_PROOF"])
            .withMessage("Invalid type value .")
    ]
};
