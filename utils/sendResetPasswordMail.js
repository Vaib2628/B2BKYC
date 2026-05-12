const sendMail = require("../services/sendMail")
module.exports = async ({to, templateData}) => {
    await sendMail({
        to,
        subject: "Password Reset Request",
        html: require("../emails/templates/resetPasswordEmail")(templateData)
    });
}