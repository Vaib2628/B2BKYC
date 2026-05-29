const DealDispute = require("../../models/DealDispute");
const Deal = require("../../models/Deal")
const Business = require("../../models/Business")

module.exports = async ({ businessId }) => {
    const disputes = await DealDispute.find()
        .populate({
            path: "dealId",
            match: {
                $or: [{ createdByBusinessId: businessId }, { counterPartyBusinessId: businessId }]
            },
            populate: [
                { path: "createdByBusinessId", select: "tradeName legalName" },
                { path: "counterPartyBusinessId", select: "tradeName legalName" }
            ]
        })
        .populate("raisedByBusinessId", "tradeName legalName")
        .populate("resolvedByBusinessId", "tradeName legalName")
        .sort({
            createdAt: -1
        })
        .lean();
    
    return disputes.filter((item) => item.dealId);
};
