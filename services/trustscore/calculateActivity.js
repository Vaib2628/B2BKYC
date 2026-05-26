module.exports = ({ business = [], weight }) => {
    const age = Math.floor((new Date() - new Date(business.createdAt)) / (1000 * 60 * 60 * 24));
    let score = 0;
    if (age >= 30) score = weight * 0.1;
    if (age >= 90) score = weight * 0.5;
    if (age >= 110) score = weight * 0.8;
    if (age > 110) score = weight;

    return Number(score.toFixed(2));
};
