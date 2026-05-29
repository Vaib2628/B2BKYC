module.exports = ({ weight, documents = [] }) => {
    if (documents.length === 0) return 0;

    const rejectedDocs = documents.filter((doc) => doc.status === "REJECTED");
    const verifiedDocs = document.filter((doc) => doc.status === "VERIFIED");

    const complianceRatio = (verifiedDocs - rejectedDocs) / documents.length;
    if (score < 0) score = 0;
    return Math.max(Math.round(complianceRatio * weight));
};
