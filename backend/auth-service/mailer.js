const nodemailer = require("nodemailer");

// Initialize Resend if available
let ResendClass = null;
try {
  const resendPkg = require("resend");
  ResendClass = resendPkg.Resend;
} catch (e) {
  // resend package not found
}

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = port === 465;
  const user = process.env.SMTP_USER || "laurafancystore@gmail.com";
  const pass = process.env.SMTP_PASS;

  if (!pass) return null;

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
 * Generate branded HTML for OTP email
 */
function getOtpHtml(toEmail, otpCode) {
  return `
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
}

/**
 * Send 6-digit OTP code to the administrator
 * @param {string} toEmail 
 * @param {string} otpCode 
 */
async function sendAdminOtpEmail(toEmail, otpCode) {
  const subject = `${otpCode} is your Laura Fancy Store Admin verification code`;
  const text = `Your Laura Fancy Store Admin verification code is: ${otpCode}. It is valid for 10 minutes.`;
  const html = getOtpHtml(toEmail, otpCode);

  // 1. Check Resend API
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && ResendClass) {
    try {
      const resend = new ResendClass(resendApiKey);
      const sender = process.env.RESEND_FROM || "Laura Fancy Store <onboarding@resend.dev>";
      const result = await resend.emails.send({
        from: sender,
        to: toEmail,
        subject,
        html,
        text,
      });

      if (result.error) {
        console.error("⚠️ [RESEND ERROR]:", result.error);
        const errMsg = result.error.message || JSON.stringify(result.error);
        
        // If Resend is in free testing mode and blocks sending to other recipients
        if (errMsg.includes("only send testing emails to your own email address") || errMsg.includes("testing emails")) {
          const ownerEmail = "lasaljayasinghe331@gmail.com";
          console.log(`⚠️ [RESEND SANDBOX] Direct delivery to ${toEmail} restricted. Routing OTP to primary account owner ${ownerEmail}...`);
          
          try {
            const forwardSubject = `[Admin OTP for ${toEmail}] ${otpCode} is the verification code`;
            const forwardHtml = `
              <div style="font-family: sans-serif; padding: 20px; color: #111;">
                <h2>Laura Fancy Store — Admin Sign-In Request</h2>
                <p>An administrator sign-in was requested for: <strong>${toEmail}</strong></p>
                <p><em>Note: Your Resend account is currently in test mode, so this verification email was routed to the primary account owner (${ownerEmail}).</em></p>
                <div style="background: #f4f4f4; border: 2px dashed #333; padding: 16px 24px; border-radius: 8px; display: inline-block; margin: 16px 0;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">${otpCode}</span>
                </div>
                <p style="color: #666; font-size: 13px;">To send directly to ${toEmail}'s inbox in the future, verify your domain at <a href="https://resend.com/domains">resend.com/domains</a> or configure a Gmail App Password in <code>backend/.env</code>.</p>
              </div>
            `;
            const forwardResult = await resend.emails.send({
              from: sender,
              to: ownerEmail,
              subject: forwardSubject,
              html: forwardHtml,
              text: `Admin verification code for ${toEmail} is: ${otpCode}. Routed to ${ownerEmail} due to Resend test sandbox.`,
            });
            
            if (!forwardResult.error) {
              console.log(`✅ [OTP ROUTED TO OWNER via Resend] Delivered to ${ownerEmail} for ${toEmail}`);
              return { sent: true, redirectedToOwner: true, ownerEmail, messageId: forwardResult.data?.id };
            }
          } catch (fErr) {
            console.error("⚠️ [FORWARD ERROR]:", fErr.message);
          }
        }

        return { sent: false, error: errMsg };
      }

      console.log(`✅ [EMAIL SENT via Resend] Message ID: ${result.data?.id}`);
      return { sent: true, messageId: result.data?.id };
    } catch (err) {
      console.error("⚠️ [RESEND EXCEPTION]:", err.message);
      return { sent: false, error: err.message };
    }
  }

  // 2. Check Brevo API
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey) {
    try {
      const senderEmail = process.env.BREVO_SENDER_EMAIL || "laurafancystore@gmail.com";
      const senderName = process.env.BREVO_SENDER_NAME || "Laura Fancy Store";

      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: toEmail }],
          subject,
          htmlContent: html,
          textContent: text,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("⚠️ [BREVO ERROR]:", data);
        return { sent: false, error: data.message || "Failed to send via Brevo" };
      }

      console.log(`✅ [EMAIL SENT via Brevo] Message ID: ${data.messageId}`);
      return { sent: true, messageId: data.messageId };
    } catch (err) {
      console.error("⚠️ [BREVO EXCEPTION]:", err.message);
      return { sent: false, error: err.message };
    }
  }

  // 3. Check Nodemailer SMTP
  const transporter = getTransporter();
  if (transporter) {
    try {
      const senderEmail = process.env.SMTP_USER || "laurafancystore@gmail.com";
      const info = await transporter.sendMail({
        from: `"Laura Fancy Store Security" <${senderEmail}>`,
        to: toEmail,
        subject,
        text,
        html,
      });
      console.log(`✅ [EMAIL SENT via SMTP] Message ID: ${info.messageId}`);
      return { sent: true, messageId: info.messageId };
    } catch (error) {
      console.error(`⚠️ [SMTP ERROR]:`, error.message);
      return { sent: false, error: error.message };
    }
  }

  // If no email service is configured
  console.error("❌ [EMAIL CONFIG ERROR] No email service configured. Please provide RESEND_API_KEY, BREVO_API_KEY, or SMTP_PASS in backend/.env.");
  return {
    sent: false,
    error: "No email API key or SMTP password configured. Please provide your API key (e.g. Resend, Brevo, or Gmail App Password).",
  };
}

module.exports = {
  sendAdminOtpEmail,
};
