const nodemailer = require("nodemailer");

// Create Nodemailer Transporter
function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = port === 465;
  const user = process.env.SMTP_USER || "laurafancystore@gmail.com";
  const pass = process.env.SMTP_PASS;

  if (!pass) {
    return null; // SMTP password not configured yet
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Send 6-digit OTP code to the administrator
 * @param {string} toEmail 
 * @param {string} otpCode 
 */
async function sendAdminOtpEmail(toEmail, otpCode) {
  console.log("\n========================================================");
  console.log("🔐 [ADMIN TWO-FACTOR AUTHENTICATION]");
  console.log(`📧 Recipient: ${toEmail}`);
  console.log(`🔑 6-Digit OTP Code: >>> ${otpCode} <<<`);
  console.log("⏳ Validity: 10 Minutes");
  console.log("========================================================\n");

  const transporter = getTransporter();
  if (!transporter) {
    console.log("ℹ️ Note: SMTP_PASS not found in backend/.env. OTP displayed in console above for instant use.");
    return { sent: false, reason: "SMTP not configured" };
  }

  const senderEmail = process.env.SMTP_USER || "laurafancystore@gmail.com";
  const subject = `${otpCode} is your Laura Fancy Store Admin verification code`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f5; margin: 0; padding: 40px 20px; color: #111111; }
          .container { max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { background: #111111; padding: 28px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 20px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; }
          .header p { margin: 6px 0 0 0; font-size: 11px; opacity: 0.7; letter-spacing: 1.5px; text-transform: uppercase; }
          .body { padding: 36px 32px; text-align: center; }
          .body p { font-size: 14px; line-height: 1.6; color: #444444; margin: 0 0 24px 0; }
          .otp-box { display: inline-block; background: #f4f4f2; border: 2px dashed #111111; border-radius: 12px; padding: 18px 36px; margin: 12px 0 28px 0; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #111111; margin: 0; }
          .alert { font-size: 12px; color: #666666; background: #fffbe6; border: 1px solid #ffe58f; padding: 10px 14px; border-radius: 8px; margin-top: 20px; line-height: 1.5; }
          .footer { padding: 20px; text-align: center; font-size: 11px; color: #888888; border-top: 1px solid #f0f0f0; background: #fafafa; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Laura Fancy Store</h1>
            <p>Admin Security Portal</p>
          </div>
          <div class="body">
            <p>A sign-in request was initiated for your administrator account (<strong>${toEmail}</strong>).</p>
            <p style="margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #777;">Your One-Time Password (OTP)</p>
            <div class="otp-box">
              <div class="otp-code">${otpCode}</div>
            </div>
            <p style="font-size: 13px; color: #555;">This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.</p>
            <div class="alert">
              If you did not request this login code, please change your admin password immediately.
            </div>
          </div>
          <div class="footer">
            © 2026 Laura Fancy Store • Colombo, Sri Lanka • High-Security Admin Portal
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Laura Fancy Store Security" <${senderEmail}>`,
      to: toEmail,
      subject,
      text: `Your Laura Fancy Store Admin verification code is: ${otpCode}. It is valid for 10 minutes.`,
      html,
    });
    console.log(`✅ [EMAIL SENT] OTP successfully sent to ${toEmail}. MessageId: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`⚠️ [EMAIL ERROR] Could not deliver email via SMTP:`, error.message);
    return { sent: false, error: error.message };
  }
}

module.exports = {
  sendAdminOtpEmail,
};
