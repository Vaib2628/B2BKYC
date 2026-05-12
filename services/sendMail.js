const createHttpError = require("http-errors");
const transporter = require("../utils/transporter");

module.exports = async ({
    to,
    subject,
    text,
    html
}) => {
    try {
        await transporter.sendMail({
            from: process.env.MAIL_ID,
            to,
            subject,
            text,
            html
        })
    } catch (error) {        
        throw new createHttpError.InternalServerError("Failed to send email");
    }
}