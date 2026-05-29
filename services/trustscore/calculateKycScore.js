const normalizeScore = require("../../helpers/normalizeScore");

module.exports = ({ documents = [], weight, requiredDocuments }) => {
    const verifiedTypes = documents
        .filter((doc) => doc.status === "VERIFIED" && doc.isActive)
        .map((doc) => doc.documentType);

    const verifiedRequiredDocs = requiredDocuments.filter((documentType) => verifiedTypes.includes(documentType));
    const ratio = verifiedRequiredDocs.length / requiredDocuments.length;

    console.log({verifiedTypes, verifiedRequiredDocs, ratio})
    return normalizeScore({
        score: ratio * weight,
        weight
    });
};
