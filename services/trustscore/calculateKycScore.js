module.exports = ({ documents = [], weight, requiredDocument = 4}) => {
    const verifiedDocs = documents.filter((doc) => doc.status === "VERIFIED");
    const score = (verifiedDocs.length / requiredDocument) * weight;
    
    return Number(score.toFixed(2));
};
