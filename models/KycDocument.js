const { default: mongoose } = require("mongoose");

const kycDocumentSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "business", required: true },
    documentType: {
        type: String,
        enum: ["GST_CERTIFICATE", "PAN_CARD", "INCORPORATION_CERTIFICATE", "BANK_PROOF"],
        required: true
    },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number },
    status: {
        type: String,
        enum: ["PENDING", "VERIFIED", "REJECTED"],
        required: true,
        default: "PENDING"
    },
    rejectionReason: { type: String },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    verifiedAt: { type: Date },
    ocrExtractedData: {
        type: Object,
        default: {}
    },
    metaData: {
        type: Object,
        default: {}
    },
    expiresAt: { type: Date, default: null },
    version: { type: Number, default: 1 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    isActive: { type: Boolean, default: true },
    replaceDocumentId: { type: mongoose.Schema.Types.ObjectId, ref: "kycdocument", default: null }
});

module.exports = mongoose.model("kycdocument", kycDocumentSchema);
