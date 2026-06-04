const createHttpError = require("http-errors");
const Business = require("../../models/Business");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async (businessId) => {
    const business = await Business.findById(businessId).populate("primaryOwnerId" , "firstName lastName email").lean();
    if (!business) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.BUSINESS_NOT_FOUND) 

    return business;
}