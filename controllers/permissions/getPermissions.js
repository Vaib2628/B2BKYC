const Permission = require("../../models/Permission");

module.exports = async ({ user, data }) => {
    const filter = {};
    if (user.scope === "BUSINESS") filter.scope = "BUSINESS";

    return Permission.find(filter);
};
