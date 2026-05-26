module.exports = ({ weight, documents = [] }) => {
    const rejectedDocs = documents.filter((doc) => doc.status === "REJECTED");
    let score = weight - rejectedDocs * 3;

    if (score < 0) score = 0;
    return Number(score.toFixed(2)) ;
};
