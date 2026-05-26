const Deal = require("../../models/Deal");

module.exports = async (businessId) => {
    const deals = await Deal.find({
        $or: [{ counterPartyBusinessId: businessId }, { createdByBusinessId: businessId }]
    })
        .populate("counterPartyBusinessId", "legalName tradeName")
        .populate("createdByBusinessId", "legalName tradeName").lean();

    return deals.map((deal) => {
        const isCounterParty = deal.counterPartyBusinessId._id.equals(businessId);
        return {
            ...deal,
            canAccept: isCounterParty && deal.status === "PENDING_ACCEPTANCE",
            canReject: isCounterParty && deal.status === "PENDING_ACCEPTANCE",
            canCancel: !isCounterParty && deal.status === "PENDING_ACCEPTANCE"
        };
    });
};
