const { default: mongoose } = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["SYSTEM", 'BUSINESS'], default: "BUSINESS" },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    hasFullAccess: { type: Boolean, default: false }
})

module.exports = mongoose.model("role", roleSchema);