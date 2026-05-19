const { default: mongoose } = require("mongoose");

const kycDocumentSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "business", required: true },
    documentType: {
        type: String,
        enum: ["GST_CERTIFICATE", "PAN_CARD", "INCORPORATION_CERTIFICATE", "BANK_PROOF"],
        required: true
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    documentNumber: { type: Number, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number },
    status: {
        type: String,
        enum: ["PENDING", "VERIFIED", "REJECTED"],
        required: true
    },
    rejectionReason: { type: String, required: true },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    verifiedAt: { type: Date },
    ocrDetails: {
        extractedData: {
            type: Object,
            default: {}
        },
        rawText: {
            type: String,
            default: null
        }
    },
    documentValidity: {
        expiresAt: {
            type: Date,
            default: null
        },

        isLifetimeValid: {
            type: Boolean,
            default: false
        }
    },
    version: { type: Number, default: 1 },
    replaceDocumentId: { type: mongoose.Schema.Types.ObjectId, ref: "kycdocument", default: null }
});

module.exports = mongoose.model("kycdocument", kycDocumentSchema);
