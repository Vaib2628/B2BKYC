const { customAlphabet } = require("nanoid");

module.exports = (prefix = "DL") => {
    const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);
    const now = new Date();

    const date = String(now.getDate()).padStart(2, 0);
    const month = String(now.getMonth()).padStart(2, 0);
    const year = now.getFullYear().toString().slice(-2);

    return `${prefix}-${date}${month}${year}-${nanoid()}`;
};
