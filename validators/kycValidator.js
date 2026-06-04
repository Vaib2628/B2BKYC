const { body, param } = require("express-validator");
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
    ],

    createDocumentValidation: [
        body("temporaryUploadId").isMongoId().withMessage("Temporary upload id is required."),
        body("metaData").isObject().withMessage("Meta data is required for the submission")
    ],

    getDocumentByIdValidation: [
        param("documentId").isMongoId().withMessage("Invalid document ID.")
    ],
    
    getReviewDocumentByIdValidation: [
        param("documentId").isMongoId().withMessage("Invalid document ID.")
    ],

    rejectDocumentValidation: [
        param("documentId").isMongoId().withMessage("Invalid document ID."),
        body("rejectionReason").isString().withMessage("Rejection reason is required.")
    ]
};
