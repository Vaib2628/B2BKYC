const User = require("../../models/User");

module.exports = async (userId, refreshToken) => {
    return User.findOneAndUpdate(
        { _id: userId, refreshToken },
        { $unset: { refreshToken: "" } },
        { returnDocument: "after" }
    );
};
