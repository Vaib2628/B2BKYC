module.exports = ({ documents = [], weight, requiredDocument = 4 }) => {
    const verifiedTypes = documents
        .filter((doc) => doc.status === "VERIFIED" && doc.isActive)
        .map((doc) => doc.documentType);

    const verifiedRequiredDocs = requiredDocuments.filter((documentType) => verifiedTypes.includes(documentType));
    const ratio = verifiedRequiredDocs.length / requiredDocuments.length;
    const score = ratio * weight;

    return Math.min(weight, Number(score.toFixed(2)));
};
