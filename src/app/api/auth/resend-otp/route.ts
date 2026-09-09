import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyJwt, corsHeaders } from "@/lib/jwt";
import { sendAdminOtpEmail } from "@/lib/mailer";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    const { tempToken } = await request.json();
    if (!tempToken) {
      return NextResponse.json({ error: "Temporary token is required" }, { status: 400, headers: corsHeaders() });
    }

    const decoded = verifyJwt(tempToken);
    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: "Session expired. Please sign in again." }, { status: 401, headers: corsHeaders() });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpId = "otp_" + Date.now();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const supabase = createAdminClient();
    await supabase.from("admin_otps").insert({
      id: otpId,
      email: decoded.email,
      otp_code: otp,
      temp_token: tempToken,
      expires_at: expiresAt,
      used: false,
    });

    const emailResult = await sendAdminOtpEmail(decoded.email, otp);
    if (!emailResult.sent) {
      return NextResponse.json(
        { error: `Failed to send email to ${decoded.email}: ${emailResult.error}` },
        { status: 500, headers: corsHeaders() }
      );
    }

    const message = emailResult.redirectedToOwner
      ? `A new verification code was dispatched to owner ${emailResult.ownerEmail} (Resend Sandbox).`
      : `A new verification code was sent to ${decoded.email}`;

    return NextResponse.json({ success: true, message }, { headers: corsHeaders() });
  } catch (err: any) {
    console.error("Resend OTP error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500, headers: corsHeaders() });
  }
}
