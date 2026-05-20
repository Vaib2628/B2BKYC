const createHttpError = require("http-errors");
const extractBusinessPanMetadata = require("../../helpers/pancardParser");
const extractOcrData = require("../../services/extractOcrData");
const extractGstMetadata = require("../../helpers/gstParser");
const geminiDocsParsing = require("../../services/geminiDocsParsing");
const TemporaryUpload = require("../../models/TemporaryUpload");

module.exports = async ({ file, type, user }) => {
    const response = await geminiDocsParsing({ file, type });

    if (!response) throw new createHttpError(400, "Unable to extract details from the document, Fill it manually.");
    if (!response.isExpectedDocument) throw new createHttpError(400, response.reason);

    const temporaryUpload = await TemporaryUpload.create({
        businessId: user.businessId,
        documentType: type,
        extractedData: response.data,
        fileName: file.filename,
        fileUrl: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: user._id,
        expiresAt: response.data.expiresAt
    }) 
    return {
        extractedData: response.data,
        temporaryUploadId: temporaryUpload.id
    };
};

// module.exports = async ({file, type}) => {
//     const data = await extractOcrData(file);
//     const parsedText = data.ParsedResults[0].ParsedText;

//     if(!parsedText) throw new createHttpError(400, "Unable to extract text from document")

//     switch (type) {
//         case "PAN_CARD":
//             return extractBusinessPanMetadata(parsedText);
//             break;

//         case "GST_CERTIFICATE":
//             return extractGstMetadata(parsedText);
//             break;

//         default:
//             throw new createHttpError(400, "Unsupported document type identified.")
//             break;
//     }
// };
