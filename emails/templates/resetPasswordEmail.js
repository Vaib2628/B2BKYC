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
        background-color: #f0f4f8;
        font-family: Arial, sans-serif;
    ">

        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="padding: 48px 0;"
        >
            <tr>
                <td align="center">

                    <table
                        width="560"
                        cellpadding="0"
                        cellspacing="0"
                        style="
                            background: #ffffff;
                            border-radius: 16px;
                            overflow: hidden;
                            border: 1px solid #e2e8f0;
                        "
                    >

                        <!-- Blue Header -->
                        <tr>
                            <td style="
                                background-color: #1e4ed8;
                                padding: 28px 40px;
                            ">
                                <table cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="
                                            background: rgba(255,255,255,0.18);
                                            border-radius: 8px;
                                            width: 36px;
                                            height: 36px;
                                            text-align: center;
                                            vertical-align: middle;
                                            font-size: 20px;
                                            padding: 0 8px;
                                        ">🔒</td>
                                        <td style="
                                            padding-left: 12px;
                                            font-size: 20px;
                                            font-weight: 600;
                                            color: #ffffff;
                                        ">
                                            ${businessName}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding: 36px 40px 32px;">

                                <!-- Key icon -->
                                <table cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                                    <tr>
                                        <td style="
                                            background: #eff6ff;
                                            border-radius: 12px;
                                            width: 52px;
                                            height: 52px;
                                            text-align: center;
                                            vertical-align: middle;
                                            font-size: 24px;
                                        ">🔑</td>
                                    </tr>
                                </table>

                                <!-- Heading -->
                                <p style="
                                    margin: 0 0 10px;
                                    font-size: 22px;
                                    font-weight: 600;
                                    color: #0f172a;
                                ">Reset your password</p>

                                <!-- Body text -->
                                <p style="
                                    margin: 0 0 28px;
                                    font-size: 15px;
                                    color: #475569;
                                    line-height: 1.7;
                                ">
                                    We received a request to reset your account password.
                                    Click the button below to create a new password.
                                </p>

                                <!-- CTA Button -->
                                <table cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="border-radius: 8px; background-color: #1e4ed8;">
                                            <a
                                                href="${resetUrl}"
                                                style="
                                                    display: inline-block;
                                                    padding: 13px 28px;
                                                    background-color: #1e4ed8;
                                                    color: #ffffff;
                                                    text-decoration: none;
                                                    border-radius: 8px;
                                                    font-size: 15px;
                                                    font-weight: 600;
                                                "
                                            >
                                                Reset password
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Fallback URL box -->
                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="margin-top: 28px;"
                                >
                                    <tr>
                                        <td style="
                                            background: #f8fafc;
                                            border: 1px solid #e2e8f0;
                                            border-radius: 8px;
                                            padding: 16px;
                                        ">
                                            <p style="
                                                margin: 0 0 6px;
                                                font-size: 13px;
                                                color: #64748b;
                                            ">
                                                If the button doesn't work, copy and paste this link:
                                            </p>
                                            <p style="
                                                margin: 0;
                                                font-size: 13px;
                                                color: #1e4ed8;
                                                word-break: break-all;
                                                line-height: 1.6;
                                            ">
                                                ${resetUrl}
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="
                                padding: 20px 40px 28px;
                                border-top: 1px solid #e2e8f0;
                            ">
                                <p style="
                                    margin: 0 0 8px;
                                    font-size: 13px;
                                    color: #94a3b8;
                                    line-height: 1.6;
                                ">
                                    ⏱ This link expires in <strong style="color: #64748b;">${expiryHours} hour${expiryHours !== 1 ? 's' : ''}</strong>.
                                </p>
                                <p style="
                                    margin: 0;
                                    font-size: 13px;
                                    color: #94a3b8;
                                    line-height: 1.6;
                                ">
                                    If you didn't request this, you can safely ignore this email.
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