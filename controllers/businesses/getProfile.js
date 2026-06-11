const createHttpError = require("http-errors");
const Business = require("../../models/Business");
const KycDocument = require("../../models/KycDocument");
const Deal = require("../../models/Deal");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants/errorConstants");

module.exports = async (businessId) => {
    const business = await Business.findById(businessId);
    if (!business) throw new createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.BUSINESS_NOT_FOUND);

    const [kycDocuments, dealStats] = await Promise.all([
        KycDocument.find({ businessId, isActive: true, status: "VERIFIED" }).select("documentType"),
        Deal.aggregate([
            {
                $match: { $or: [{ createdByBusinessId: business._id }, { counterPartyBusinessId: business._id }] }
            },
            {
                $group: {
                    _id: null,
                    totalDeals: { $sum: 1 },
                    activeDeals: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "ACTIVE"] }, 1, 0]
                        }
                    },
                    completedDeals: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0]
                        }
                    },
                    cancelledDeals: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0]
                        }
                    },
                    disputedDeals: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "DISPUTED"] }, 1, 0]
                        }
                    }
                }
            }
        ])
    ]);

    console.log(dealStats);

    const stats = dealStats[0] || {
        totalDeals: 0,
        activeDeals: 0,
        completedDeals: 0,
        disputedDeals: 0,
        cancelledDeals: 0
    };

    return {
        _id: business._id,
        basicInfo: {
            tradeName: business.tradeName,
            legalName: business.legalName,
            companyType: business.companyType,
            industry: business.industry,
            city: business.registeredAddress.city,
            state: business.registeredAddress.state,
            memberSince: business.createdAt
        },

        verification: {
            kycStatus: business.kycStatus,
            verifiedDocs: kycDocuments.map((doc) => doc.documentType)
        },

        dealStats: {
            ...stats,
            completionRate: stats.totalDeals > 0 ? Math.round((stats.completedDeals / stats.totalDeals) * 100) : 0
        }
    };
};
