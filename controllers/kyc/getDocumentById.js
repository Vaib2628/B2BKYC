const createHttpError = require("http-errors");
const KycDocument = require("../../models/KycDocument");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async ({documentId, user}) => {
    const document = await KycDocument.findById(documentId);
    if (!document) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DOC_NOT_FOUND)

    const hasScope = document.businessId.equals(user.businessId);
    if (!hasScope) throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED)

    return document;
}