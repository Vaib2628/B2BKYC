const Business = require("../../models/Business");

module.exports = async (businessData) => {
    return Business.create(businessData);
};
