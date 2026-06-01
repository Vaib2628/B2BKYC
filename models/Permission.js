const { default: mongoose } = require("mongoose");

const permissionSchema = new mongoose.Schema(
    {
        key: { type: String, required: true, unique: true },
        resource: { type: String, required: true },
        action: { type: String, required: true },
        description: { type: String },
        scope: { type: String, enum: ["SYSTEM", "BUSINESS"], default: "BUSINESS" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("permission", permissionSchema);
