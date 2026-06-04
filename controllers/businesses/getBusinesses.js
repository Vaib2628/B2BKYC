const Business = require("../../models/Business.js");
const paginate = require("../../utils/paginate.js");

module.exports = async (options) => {
    return paginate({
        model: Business,
        filter: {},
        options,
        select: "tradeName legalName status kycStatus trustScore createdAt"
    });
};
