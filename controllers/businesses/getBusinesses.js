const Business = require("../../models/Business.js");

module.exports = async () => {
    const businesses = await Business.find().populate("primaryOwnerId", "firstName lastName email");
    return businesses.map((business) => ({
        id: business._id,
        legalName: business.legalName,
        tradeName: business.tradeName,
        companyType: business.companyType,
    }));
};