const createHttpError = require("http-errors");
const TemporaryUpload = require("../../models/TemporaryUpload");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");
const KycDocument = require("../../models/KycDocument");
const Business = require("../../models/Business");

module.exports = async ({ user, temporaryUploadId, metaData }) => {
    const temporaryUpload = await TemporaryUpload.findById(temporaryUploadId);
    if (!temporaryUpload) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.UPLOAD_NOT_FOUND);

    const hasScope = temporaryUpload.businessId.equals(user.businessId) && temporaryUpload.uploadedBy.equals(user._id);
    if (!hasScope) throw new createHttpError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCESS_NOT_ALLOWED);

    if (temporaryUpload.status !== "PENDING")
        throw new createHttpError(STATUS_CODES.BAD_REQUEST, ERROR_MESSAGES.UPLOAD_ALREADY_PROCESSED);

    const existingDoc = await KycDocument.findOne({
        businessId: temporaryUpload.businessId,
        documentType: temporaryUpload.documentType,
        isActive: true
    });

    if (existingDoc?.status === "PENDING")
        throw new createHttpError(STATUS_CODES.CONFLICT, ERROR_MESSAGES.DOC_UNDER_REVIEW);

    existingDoc && (await existingDoc.updateOne({ isActive: false }));

    const kycDocument = await KycDocument.create({
        businessId: temporaryUpload.businessId,
        documentType: temporaryUpload.documentType,
        expiresAt: temporaryUpload.expiresAt,
        fileName: temporaryUpload.fileName,
        fileSize: temporaryUpload.fileSize,
        fileUrl: temporaryUpload.fileUrl,
        ocrExtractedData: temporaryUpload.extractedData,
        uploadedBy: temporaryUpload.uploadedBy,
        metaData: metaData,
        replaceDocumentId: existingDoc ? existingDoc._id : null,
        version: existingDoc ? existingDoc.version + 1 : 1
    });

    // Marking the temporary upload as completed
    temporaryUpload.status = "CONFIRMED";
    await temporaryUpload.save();

    // Updating the business aggregate status of the kyc
    const uploadedDocsCount = await KycDocument.countDocuments({
        businessId: user.businessId,
        isActive: true
    });
    if (uploadedDocsCount < 4)
        await Business.findByIdAndUpdate(temporaryUpload.businessId, { kycStatus: "PENDING_DOCUMENTS" });
    else await Business.findByIdAndUpdate(temporaryUpload.businessId, { kycStatus: "UNDER_REVIEW" });
    
    return { _id: kycDocument._id };
};
