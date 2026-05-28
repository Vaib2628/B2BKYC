const Deal = require("../../models/Deal");

module.exports = async ({ businessId, type = "" }) => {
    const baseFilter = {
        $or: [{ counterPartyBusinessId: businessId }, { createdByBusinessId: businessId }]
    };
    let incomingDeals = 0;
    let activeDeals = 0;
    let completedDeals = 0;
    let disputedDeals = 0;

    const allDeals = await Deal.find(baseFilter).lean();
    allDeals.forEach((deal) => {
        if (deal.counterPartyBusinessId._id.equals(businessId) && deal.status === "PENDING_ACCEPTANCE") incomingDeals++;
        if (deal.status === "ACTIVE") activeDeals++;
        if (deal.status === "COMPLETED") completedDeals++;
        if (deal.status === "DISPUTED") disputedDeals++;
    });

    const filter = {};
    switch (type) {
        case "incoming":
            filter.counterPartyBusinessId = businessId;
            filter.status = "PENDING_ACCEPTANCE";
            break;

        case "sent":
            filter.createdByBusinessId = businessId;
            filter.status = {
                $in: ["PENDING_ACCEPTANCE", "REJECTED", "CANCELLED"]
            };
            break;

        case "active":
            filter.$or = [{ counterPartyBusinessId: businessId }, { createdByBusinessId: businessId }];
            filter.status = "ACTIVE";
            break;

        case "completed":
            filter.$or = [{ counterPartyBusinessId: businessId }, { createdByBusinessId: businessId }];
            filter.status = "COMPLETED";
            break;

        case "disputed":
            filter.$or = [{ counterPartyBusinessId: businessId }, { createdByBusinessId: businessId }];
            filter.status = "DISPUTED";
            break;

        // default:
        // filter.$or = [{ counterPartyBusinessId: businessId }, { createdByBusinessId: businessId }];
    }

    const deals = await Deal.find(filter)
        .populate("counterPartyBusinessId", "legalName tradeName")
        .populate("createdByBusinessId", "legalName tradeName")
        .lean();

    const mappedDeals = deals.map((deal) => {
        const isCounterParty = deal.counterPartyBusinessId._id.equals(businessId);
        return {
            ...deal,
            canAccept: isCounterParty && deal.status === "PENDING_ACCEPTANCE",
            canReject: isCounterParty && deal.status === "PENDING_ACCEPTANCE",
            canCancel: !isCounterParty && deal.status === "PENDING_ACCEPTANCE"
        };
    });

    return {
        deals: mappedDeals,
        summary: {
            incomingDeals,
            activeDeals,
            completedDeals,
            disputedDeals
        }
    };
};
