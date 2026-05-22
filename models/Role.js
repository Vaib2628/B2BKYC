const { default: mongoose } = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    scope: { type: String, enum: ["SYSTEM", "BUSINESS"], default: "BUSINESS" },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: function () {
            this.scope === "BUSINESS";
        }
    },
    hasFullAccess: { type: Boolean, default: false }
});

roleSchema.index({ name: 1, businessId: 1 }, { unique: true });

module.exports = mongoose.model("role", roleSchema);
