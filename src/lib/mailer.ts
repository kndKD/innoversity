import nodemailer from "nodemailer";

export function getTransporter() {
  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_APP_PASSWORD;

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: smtpEmail,
      pass: smtpPassword,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
}

export const transporter = getTransporter();

export async function sendOtpEmail(toEmail: string, otpCode: string, fullName?: string) {
  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_APP_PASSWORD;

  if (!smtpEmail || !smtpPassword) {
    throw new Error(
      "SMTP credentials are not configured in environment variables (SMTP_EMAIL, SMTP_APP_PASSWORD)."
    );
  }

  const recipientName = fullName ? fullName.trim() : "Valued Member";

  const mailOptions = {
    from: `"Innoversity Sri Lanka" <${smtpEmail}>`,
    to: toEmail,
    replyTo: `"Innoversity Support" <${smtpEmail}>`,
    subject: `${otpCode} is your Innoversity verification code`,
    // Clean plain-text fallback alongside HTML for maximum deliverability
    text: `Your Innoversity verification code is: ${otpCode}. Valid for 2 minutes.\n\nHello ${recipientName},\n\nPlease enter the following 6-digit one-time password (OTP) to complete your verification on Innoversity:\n\n${otpCode}\n\nThis verification code expires in exactly 2 minutes (120 seconds). Do not share this code with anyone.\n\nIf you did not request this verification, you can safely ignore this email.\n\n--\nInnoversity Marketplace Sri Lanka\nhttps://innoversity.lk`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Innoversity Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f7ff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td align="center" style="padding: 40px 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e0e7ff; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.08);">
                
                <!-- Header Banner -->
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <div style="background-color: #ffffff; width: 44px; height: 44px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; line-height: 44px; font-size: 22px; font-weight: 900; color: #4f46e5; margin-bottom: 8px;">
                            ⚡
                          </div>
                          <div style="color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                            Innoversity
                          </div>
                          <div style="color: #e0e7ff; font-size: 12px; font-weight: 500; margin-top: 4px;">
                            Sri Lanka's Verified Innovation Marketplace
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 36px 32px 28px 32px;">
                    <h1 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 800; color: #0f172a; text-align: center;">
                      Verify Your Account
                    </h1>
                    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #475569; text-align: center;">
                      Hello <strong>${recipientName}</strong>, thank you for signing up. Please enter the 6-digit confirmation code below to complete your identity verification:
                    </p>

                    <!-- 6-Digit OTP Box -->
                    <div style="margin: 28px 0; text-align: center;">
                      <div style="display: inline-block; background-color: #f5f3ff; border: 2px dashed #6366f1; border-radius: 16px; padding: 18px 28px;">
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 10px; color: #4338ca; padding-left: 10px;">
                          ${otpCode}
                        </span>
                      </div>
                    </div>

                    <!-- Expiration Alert -->
                    <div style="background-color: #fff1f2; border: 1px solid #ffe4e6; border-radius: 12px; padding: 12px 16px; margin-bottom: 24px; text-align: center;">
                      <p style="margin: 0; font-size: 12px; font-weight: 700; color: #be123c;">
                        ⏳ This code expires in exactly 2 minutes (120 seconds).
                      </p>
                    </div>

                    <p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b; text-align: center;">
                      Never share this code with anyone. Innoversity personnel will never ask for your verification code.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 20px 32px; text-align: center;">
                    <p style="margin: 0 0 6px 0; font-size: 11px; color: #94a3b8;">
                      If you did not initiate this request, you can safely ignore this email.
                    </p>
                    <p style="margin: 0; font-size: 11px; font-weight: 600; color: #64748b;">
                      &copy; ${new Date().getFullYear()} Innoversity Sri Lanka · All Rights Reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    headers: {
      "Reply-To": smtpEmail,
      "X-Entity-Ref-ID": `${Date.now()}-${otpCode}`,
    },
  };

  const activeTransporter = getTransporter();
  return await activeTransporter.sendMail(mailOptions);
}
