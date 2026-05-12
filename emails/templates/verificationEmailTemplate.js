module.exports = ({
    verificationUrl,
    businessName,
    heading = "Verify Your Email Address",
    description = "Please verify your email address to complete the registration."
}) => {
    return `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Email Verification</title>
        </head>

        <body style="
            margin:0;
            padding:0;
            background:#eef2ff;
            font-family:Arial, Helvetica, sans-serif;
        ">

            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="padding:40px 16px;"
            >
                <tr>
                    <td align="center">

                        <!-- Main Card -->
                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                max-width:620px;
                                background:#ffffff;
                                border-radius:20px;
                                overflow:hidden;
                                box-shadow:0 10px 30px rgba(0,0,0,0.08);
                            "
                        >

                            <!-- Top Gradient -->
                            <tr>
                                <td
                                    align="center"
                                    style="
                                        background:linear-gradient(135deg,#4f46e5,#2563eb);
                                        padding:50px 40px;
                                    "
                                >

                                    <h1 style="
                                        margin:0;
                                        color:#ffffff;
                                        font-size:34px;
                                        font-weight:700;
                                        letter-spacing:0.5px;
                                    ">
                                        ${businessName}
                                    </h1>

                                    <p style="
                                        margin:14px 0 0;
                                        color:rgba(255,255,255,0.85);
                                        font-size:16px;
                                        line-height:1.6;
                                    ">
                                        Secure Business Verification Platform
                                    </p>

                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="padding:50px 45px;">

                                    <h2 style="
                                        margin:0 0 18px;
                                        color:#111827;
                                        font-size:28px;
                                        font-weight:700;
                                    ">
                                        Verify your email address
                                    </h2>

                                    <p style="
                                        margin:0;
                                        color:#4b5563;
                                        font-size:16px;
                                        line-height:1.8;
                                    ">
                                        Welcome to ${businessName}.  
                                        To activate your workspace and continue
                                        your onboarding process, please verify
                                        your email address using the button below.
                                    </p>

                                    <!-- Spacer -->
                                    <div style="height:40px;"></div>

                                    <!-- CTA -->
                                    <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                        align="center"
                                    >
                                        <tr>
                                            <td align="center">

                                                <a
                                                    href="${verificationUrl}"
                                                    style="
                                                        background:linear-gradient(135deg,#4f46e5,#2563eb);
                                                        color:#ffffff;
                                                        text-decoration:none;
                                                        padding:16px 34px;
                                                        border-radius:12px;
                                                        display:inline-block;
                                                        font-size:16px;
                                                        font-weight:700;
                                                        box-shadow:0 8px 20px rgba(37,99,235,0.25);
                                                    "
                                                >
                                                    Verify Email
                                                </a>

                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Spacer -->
                                    <div style="height:45px;"></div>

                                    <!-- URL Box -->
                                    <table
                                        width="100%"
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                        style="
                                            background:#f9fafb;
                                            border:1px solid #e5e7eb;
                                            border-radius:12px;
                                        "
                                    >
                                        <tr>
                                            <td style="padding:20px;">

                                                <p style="
                                                    margin:0 0 10px;
                                                    color:#6b7280;
                                                    font-size:14px;
                                                    font-weight:600;
                                                ">
                                                    Button not working?
                                                </p>

                                                <p style="
                                                    margin:0;
                                                    word-break:break-all;
                                                    color:#2563eb;
                                                    font-size:14px;
                                                    line-height:1.7;
                                                ">
                                                    ${verificationUrl}
                                                </p>

                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Spacer -->
                                    <div style="height:35px;"></div>

                                    <!-- Info -->
                                    <table
                                        width="100%"
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                        style="
                                            background:#eef2ff;
                                            border-radius:12px;
                                        "
                                    >
                                        <tr>
                                            <td style="padding:18px 20px;">

                                                <p style="
                                                    margin:0;
                                                    color:#4338ca;
                                                    font-size:14px;
                                                    line-height:1.7;
                                                ">
                                                    This verification link will expire in
                                                    <strong>1 hour</strong>.
                                                </p>

                                            </td>
                                        </tr>
                                    </table>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td
                                    align="center"
                                    style="
                                        padding:30px 40px;
                                        background:#f9fafb;
                                        border-top:1px solid #e5e7eb;
                                    "
                                >

                                    <p style="
                                        margin:0;
                                        color:#9ca3af;
                                        font-size:13px;
                                        line-height:1.8;
                                    ">
                                        If you did not create this account,
                                        you can safely ignore this email.
                                    </p>

                                    <p style="
                                        margin:10px 0 0;
                                        color:#9ca3af;
                                        font-size:13px;
                                    ">
                                        © ${new Date().getFullYear()} ${businessName}
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
