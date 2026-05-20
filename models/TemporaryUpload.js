const { default: mongoose } = require("mongoose");

const temporaryUploadSchema = new mongoose.Schema(
    {
        businessId: { type: mongoose.Schema.Types.ObjectId, ref: "business", required: true },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        documentType: {
            type: String,
            enum: ["GST_CERTIFICATE", "PAN_CARD", "INCORPORATION_CERTIFICATE", "BANK_PROOF"],
            required: true
        },
        expiresAt: { type: Date, default: null },
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileSize: { type: Number },
        mimeType: { type: String },
        extractedData: { type: Object, default: {} },
        status: { type: String, enum: ["PENDING", "CONFIRMED", "EXPIRED"], default: "PENDING" }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("temporaryupload", temporaryUploadSchema);
