import { Resend } from "resend";

export async function sendAdminOtpEmail(toEmail: string, otpCode: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not set in environment variables.");
    return { sent: false, error: "RESEND_API_KEY not configured." };
  }
  const sender = process.env.RESEND_FROM || "Laura Fancy Store <onboarding@resend.dev>";
  const resend = new Resend(resendApiKey);

  const subject = `${otpCode} is your Laura Fancy Store Admin verification code`;
  const text = `Your Laura Fancy Store Admin verification code is: ${otpCode}. Valid for 10 minutes.`;
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f7f7f5; margin: 0; padding: 40px 20px;">
        <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e5e5; padding: 32px; text-align: center;">
          <h2 style="margin: 0 0 16px 0; font-size: 20px; letter-spacing: 2px; text-transform: uppercase;">Laura Fancy Store</h2>
          <p style="color: #666; font-size: 14px;">Sign-in request for administrator account: <strong>${toEmail}</strong></p>
          <div style="background: #f4f4f2; border: 2px dashed #111; border-radius: 8px; padding: 16px 24px; margin: 24px 0;">
            <span style="font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #111;">${otpCode}</span>
          </div>
          <p style="color: #888; font-size: 12px; margin: 0;">Code expires in 10 minutes. Do not share with anyone.</p>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: sender,
      to: toEmail,
      subject,
      html,
      text,
    });

    if (result.error) {
      const errMsg = result.error.message || JSON.stringify(result.error);
      // Handle Resend free sandbox testing restriction (forward to account owner)
      if (errMsg.includes("only send testing emails to your own email address") || errMsg.includes("testing emails")) {
        const ownerEmail = "lasaljayasinghe331@gmail.com";
        console.log(`[RESEND SANDBOX] Routing OTP for ${toEmail} to owner ${ownerEmail}...`);
        const forwardResult = await resend.emails.send({
          from: sender,
          to: ownerEmail,
          subject: `[Admin OTP for ${toEmail}] ${otpCode} is the verification code`,
          html: `<p>Admin sign-in requested for <strong>${toEmail}</strong>.</p><p>OTP Code: <strong>${otpCode}</strong></p>`,
          text: `Admin OTP for ${toEmail} is: ${otpCode}.`,
        });

        if (!forwardResult.error) {
          return { sent: true, redirectedToOwner: true, ownerEmail, messageId: forwardResult.data?.id };
        }
      }
      return { sent: false, error: errMsg };
    }

    return { sent: true, messageId: result.data?.id };
  } catch (err: any) {
    console.error("Resend send error:", err);
    return { sent: false, error: err.message };
  }
}
