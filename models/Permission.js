const { default: mongoose } = require("mongoose");

const permissionSchema = new mongoose.Schema({
    key: { type: String, required: true },
    resource: { type: String, required: true },
    action: { type: String, required: true },
    description: { type: String }
})

module.exports = mongoose.model("permission", permissionSchema);