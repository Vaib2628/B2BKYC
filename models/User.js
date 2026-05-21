const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../constants/constants");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        emailVerified: { type: Boolean, default: false },
        emailVerifyToken: { type: String },
        emailVerifyTokenExpiry: { type: Date },
        resetToken: { type: String },
        resetTokenExpiry: { type: Date },
        refreshToken: { type: String },
        failedLoginAttempts: { type: Number, default: 0 },
        lockUntil: { type: Date }
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password.toString(), this.password);
};

userSchema.methods.generateAccessToken = function (membership) {
    return jwt.sign(
        {
            _id: this._id,
            membershipId: membership._id,
            roleId: membership.roleId,
            scope: membership.scope,
            ...(membership.businessId && { businessId: membership.businessId }),
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: constants.ACCESS_TOKEN_EXPIRY }
    );
};

userSchema.methods.generateRefreshToken = function (membership) {
    return jwt.sign(
        {
            _id: this._id,
            membershipId: membership._id,
            roleId: membership.roleId,
            scope: membership.scope,
            ...(membership.businessId && { businessId: membership.businessId }),
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: constants.REFRESH_TOKEN_EXPIRY }
    );
};

module.exports = mongoose.model("user", userSchema);
