import transporter from "../config/mailer.js";

const roleLabel = (role) => {
    if (role === "user") return "Customer";
    if (role === "delivery") return "Delivery Agent";
    return "Admin";
};

const sendOTP = async (email, otp, name, role, purpose = "login") => {
    const isReset = purpose === "reset";
    const title = isReset ? "Password Reset" : "Account Verification";
    const intro = isReset
        ? "We received a request to reset your password. Please use the One-Time Password (OTP) below to continue:"
        : "We received a request to verify your account. Please use the One-Time Password (OTP) below to proceed:";

    const mailOptions = {
        from: `CraveIt:${process.env.EMAIL_USER}`,
        to: email,
        subject: isReset
            ? "Password Reset OTP - CraveIt"
            : "Your One-Time Password - CraveIt",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px 0;">
          <tr>
            <td align="center">
              
              <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                
                <!-- Header -->
                <tr>
                <td style="background:#2d89ef; color:#ffffff; padding:20px; text-align:center;">
    
                    <h2 style="margin:0; font-size:22px;">
                      ${title}
                    </h2>

                    <p style="margin:6px 0 0; font-size:14px; color:#dbe9ff;">
                      ${roleLabel(role)}
                    </p>

                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px; color:#333333;">
                    <p style="margin-top:0;">Dear <span style="color:#90EE90;">${name}</span>,</p>
                    
                    <p>
                      ${intro}
                    </p>

                    <!-- OTP Box -->
                    <div style="text-align:center; margin:30px 0;">
                      <span style="display:inline-block; font-size:28px; letter-spacing:6px; font-weight:bold; color:#2d89ef; border:2px dashed #2d89ef; padding:12px 20px; border-radius:6px;">
                        ${otp}
                      </span>
                    </div>

                    <p>
                      This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone for security reasons.
                    </p>

                    <p>
                      If you did not initiate this request, you can safely ignore this email.
                    </p>

                    <p style="margin-bottom:0;">
                      Regards,<br/>
                      <strong style="color:#FF9800;">CraveIt</strong>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#888;">
                    © 2026 CraveIt. All rights reserved.
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    };

    await transporter.sendMail(mailOptions);
};

export default sendOTP;