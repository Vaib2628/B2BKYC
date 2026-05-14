const User = require("../../models/User");

module.exports = async (userId) => {
    return User.findByIdAndUpdate(userId, { $unset: { refreshToken: "" } }, { returnDocument: "after" });
};
