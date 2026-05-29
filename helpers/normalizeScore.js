module.exports = ({ score, weight }) => {
    const safeScore = Number.isFinite(score) ? score : 0;

    return Math.min(weight, Math.max(0, Math.round(safeScore)));
};
