const normalizeScore = require("../../helpers/normalizeScore");

module.exports = ({ weight, documents = [] }) => {
    if (documents.length === 0) return 0;

    const rejectedDocs = documents.filter((doc) => doc.status === "REJECTED");
    const verifiedDocs = documents.filter((doc) => doc.status === "VERIFIED");

    const complianceRatio = (verifiedDocs.length - rejectedDocs.length) / documents.length;

    console.log({rejectedDocs, verifiedDocs , complianceRatio})
    return normalizeScore({
        score: complianceRatio * weight,
        weight
    });
};
