const sendMail = require("../services/sendMail");
const verificationEmailTemplate = require("../emails/templates/verificationEmailTemplate");

module.exports = async ({ to, token, businessName = "TrustVault", type }) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const html = verificationEmailTemplate({
        verificationUrl,
        businessName,
        heading: type === "business" ? "Verify Your Business Email Address" : "Verify Your Email Address",
        message:
            type === "business"
                ? `Please click the button below to verify your business email address and complete the onboarding process for ${businessName}.`
                : `Please click the button below to verify your email address.`
    });

    await sendMail({
        to,
        subject: "Verify Your Email Address",
        html
    });
};
