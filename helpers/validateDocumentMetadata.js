const createHttpError = require("http-errors");
const { STATUS_CODES } = require("../constants/errorConstants");

const requiredFileds = {
    GST_CERTIFICATE: [
        "legalName",
        "tradeName",
        "companyType",
        "gstNumber",
        "panNumber",
        "registeredAddress.line1",
        "registeredAddress.city",
        "registeredAddress.state",
        "registeredAddress.pincode"
    ],
    PAN_CARD: ["legalName", "panNumber"],
    INCORPORATION_CERTIFICATE: ["legalName", "cinNumber", "dateOfIncorporation"],
    BANK_PROOF: ["accountHolderName", "accountNumber", "ifscCode", "accountType"]
};

const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

module.exports = async ({ documentType, metaData }) => {
    const requiredFields = requiredFileds[documentType];
    // if (!requiredFields) return true; // No required fields defined for this document type
    if (!requiredFields) {
        throw new createHttpError(STATUS_CODES.BAD_REQUEST, `Unsupported document type: ${documentType}`);
    }

    const missingFields = requiredFields.filter((field) => {
        const value = getNestedValue(metaData, field);
        return value === undefined || value === null || value === "";
    });

    if (missingFields.length > 0) {
        throw new createHttpError(
            STATUS_CODES.BAD_REQUEST,
            `Missing required metadata fields: ${missingFields.join(", ")}`
        );
    }

    return true;
};
