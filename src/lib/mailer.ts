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

  // Clean, spam-free subject line (no emojis, no ALL CAPS, no promotional phrasing)
  const cleanSubject = `Your Innoversity verification code: ${otpCode}`;

  // Clean plain-text fallback version alongside HTML for maximum deliverability
  const plainText = `Your Innoversity verification code is: ${otpCode}

This code will expire in 2 minutes.

If you didn't request this code, you can safely ignore this email.

--
Innoversity
Sri Lanka's Verified Innovation Marketplace`;

  // Minimalist, high-deliverability transactional HTML template (Stripe/Notion style)
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 24px;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; margin: 0; padding: 32px 16px;">
    <tr>
      <td align="left">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; margin: 0 auto;">
          <!-- Minimalist Brand Header -->
          <tr>
            <td style="padding-bottom: 24px;">
              <span style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.3px;">Innoversity</span>
            </td>
          </tr>
          
          <!-- Instructions -->
          <tr>
            <td style="padding-bottom: 16px; color: #374151;">
              Please use the verification code below to complete your account setup:
            </td>
          </tr>

          <!-- Minimalist Bold 6-Digit OTP Box -->
          <tr>
            <td style="padding: 10px 0 22px 0;">
              <div style="display: inline-block; background-color: #f3f4f6; border-radius: 8px; padding: 14px 22px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #111827;">
                ${otpCode}
              </div>
            </td>
          </tr>

          <!-- Expiry Notice -->
          <tr>
            <td style="padding-bottom: 24px; color: #4b5563; font-size: 14px; line-height: 20px;">
              This code will expire in 2 minutes. If you didn&rsquo;t request this verification code, please ignore this email.
            </td>
          </tr>

          <!-- Simple Divider & Footer -->
          <tr>
            <td style="border-top: 1px solid #e5e7eb; padding-top: 18px; color: #9ca3af; font-size: 12px; line-height: 18px;">
              Innoversity &middot; Sri Lanka&rsquo;s Verified Innovation Marketplace
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  const mailOptions = {
    from: `"Innoversity" <${smtpEmail}>`,
    to: toEmail,
    replyTo: process.env.SMTP_EMAIL || smtpEmail,
    subject: cleanSubject,
    text: plainText,
    html,
  };

  const activeTransporter = getTransporter();
  return await activeTransporter.sendMail(mailOptions);
}
