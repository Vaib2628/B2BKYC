const createHttpError = require("http-errors");
const KycDocument = require("../../models/KycDocument");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async (documentId) => {
    const document = await KycDocument.findById(documentId);
    if (!document) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DOC_NOT_FOUND);

    return document;
};
