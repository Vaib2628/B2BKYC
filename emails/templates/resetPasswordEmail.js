// Reset password email template

module.exports = ({
    resetUrl,
    businessName = "TrustVault",
    expiryHours = 1
}) => {

    return `
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8" />
        <title>Reset Your Password</title>
    </head>

    <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f7fb;
        font-family: Arial, sans-serif;
    ">

        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="padding: 40px 0;"
        >

            <tr>
                <td align="center">

                    <table
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        style="
                            background: #ffffff;
                            border-radius: 12px;
                            padding: 40px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                        "
                    >

                        <!-- Brand -->
                        <tr>
                            <td align="center">

                                <h1 style="
                                    margin: 0;
                                    color: #111827;
                                    font-size: 28px;
                                ">
                                    ${businessName}
                                </h1>

                            </td>
                        </tr>

                        <!-- Spacer -->
                        <tr>
                            <td height="30"></td>
                        </tr>

                        <!-- Heading -->
                        <tr>
                            <td>

                                <h2 style="
                                    margin: 0 0 16px;
                                    color: #111827;
                                    font-size: 24px;
                                ">
                                    Reset your password
                                </h2>

                                <p style="
                                    margin: 0;
                                    color: #4b5563;
                                    font-size: 16px;
                                    line-height: 1.7;
                                ">
                                    We received a request to reset your
                                    account password. Click the button below
                                    to create a new password.
                                </p>

                            </td>
                        </tr>

                        <!-- Spacer -->
                        <tr>
                            <td height="35"></td>
                        </tr>

                        <!-- CTA -->
                        <tr>
                            <td align="center">

                                <a
                                    href="${resetUrl}"

                                    style="
                                        display: inline-block;
                                        padding: 14px 28px;
                                        background-color: #111827;
                                        color: #ffffff;
                                        text-decoration: none;
                                        border-radius: 8px;
                                        font-size: 16px;
                                        font-weight: 600;
                                    "
                                >
                                    Reset Password
                                </a>

                            </td>
                        </tr>

                        <!-- Spacer -->
                        <tr>
                            <td height="35"></td>
                        </tr>

                        <!-- Fallback -->
                        <tr>
                            <td>

                                <p style="
                                    margin: 0 0 10px;
                                    color: #6b7280;
                                    font-size: 14px;
                                ">
                                    If the button above does not work,
                                    copy and paste the following URL into
                                    your browser:
                                </p>

                                <p style="
                                    word-break: break-all;
                                    color: #2563eb;
                                    font-size: 14px;
                                    line-height: 1.6;
                                ">
                                    ${resetUrl}
                                </p>

                            </td>
                        </tr>

                        <!-- Spacer -->
                        <tr>
                            <td height="30"></td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td>

                                <p style="
                                    margin: 0;
                                    color: #9ca3af;
                                    font-size: 13px;
                                    line-height: 1.6;
                                ">
                                    This password reset link will expire in
                                    ${expiryHours} hours.
                                </p>

                                <p style="
                                    margin-top: 12px;
                                    color: #9ca3af;
                                    font-size: 13px;
                                    line-height: 1.6;
                                ">
                                    If you did not request a password reset,
                                    you can safely ignore this email.
                                </p>

                            </td>
                        </tr>

                    </table>

                </td>
            </tr>

        </table>

    </body>
    </html>
    `;
};