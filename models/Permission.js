const { default: mongoose } = require("mongoose");

const permissionSchema = new mongoose.Schema({
    key: { type: String, required: true },
    resource: { type: String, required: true },
    action: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["SYSTEM", "BUSINESS"], default: "BUSINESS" }
});

module.exports = mongoose.model("permission", permissionSchema);
