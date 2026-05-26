const Deal = require("../../models/Deal");

module.exports = async (businessId) => {
    return Deal.find({ $or: [{ counterPartyBusinessId: businessId }, { createdByBusinessId: businessId }] }).populate(
        "counterPartyBusinessId",
        "legalName tradeName"
    );
};
