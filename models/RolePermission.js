const { default: mongoose } = require("mongoose");

const rolePermissionSchema = new mongoose.Schema(
    {
        roleId: { type: mongoose.Schema.Types.ObjectId, ref: "role", required: true },
        permissionId: { type: mongoose.Schema.Types.ObjectId, ref: "permission", required: true }
    },
    { timestamps: true }
);

rolePermissionSchema.index({ roleId: 1, permissionId: 1 }, { unique: true });

module.exports = mongoose.model("rolepermission", rolePermissionSchema);
