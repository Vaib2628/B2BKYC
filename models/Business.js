const mongoose = require("mongoose");
const trustScoreSchema = require("./TrustScore");

const businessSchema = new mongoose.Schema(
    {
        businessName: { type: String, required: true, trim: true },
        legalName: { type: String, trim: true },
        tradeName: { type: String, trim: true },
        companyType: {
            type: String,
            enum: ["PRIVATE_LIMITED", "PUBLIC_LIMITED", "LLP", "PARTNERSHIP", "SOLE_PROPRIETORSHIP", "OTHER"]
        },
        industry: { type: String, required: true },
        gstNumber: { type: String, unique: true, sparse: true },
        panNumber: { type: String, unique: true, sparse: true },
        cinNumber: { type: String, unique: true, sparse: true },
        registeredPhone: { type: String, required: true },
        registeredAddress: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            country: String,
            pincode: String
        },
        kycStatus: {
            type: String,
            enum: [
                "DRAFT",
                "PENDING_DOCUMENTS",
                "UNDER_REVIEW",
                "ACTION_REQUIRED",
                "PARTIALLY_VERIFIED",
                "VERIFIED",
                "REJECTED",
                "REQUIRES_RENEWAL"
            ],
            default: "DRAFT"
        },
        bankDetails: {
            accountHolderName: String,
            accountNumber: String,
            ifscCode: String,
            accountType: String
        },
        trustScore: { type: trustScoreSchema, default: {} },
        status: {
            type: String,
            enum: ["ACTIVE", "SUSPENDED", "DEACTIVATED"],
            default: "ACTIVE"
        },
        primaryOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("business", businessSchema);
