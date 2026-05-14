const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
    {
        legalName: { type: String, required: true, trim: true },
        tradeName: { type: String, trim: true },
        companyType: {
            type: String,
            enum: ["PRIVATE_LIMITED", "PUBLIC_LIMITED", "LLP", "PARTNERSHIP", "SOLE_PROPRIETORSHIP", "OTHER"],
            required: true
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
            country: {
                type: String,
                default: "India"
            },
            pincode: String
        },
        kycStatus: {
            type: String,
            enum: [
                "DRAFT",
                "PENDING_DOCUMENTS",
                "UNDER_REVIEW",
                "PARTIALLY_VERIFIED",
                "VERIFIED",
                "REJECTED",
                "REQUIRES_RENEWAL"
            ],
            default: "DRAFT"
        },
        trustScore: { type: Number, default: 0, min: 0, max: 100 },
        status: {
            type: String,
            enum: ["ACTIVE", "SUSPENDED", "DEACTIVATED"],
            default: "ACTIVE"
        },
        primaryOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("business", businessSchema);
