import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { signJwt, corsHeaders } from "@/lib/jwt";
import { sendAdminOtpEmail } from "@/lib/mailer";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400, headers: corsHeaders() });
    }

    const supabase = createAdminClient();
    const { data: user, error } = await supabase
      .from("admin_users")
      .select("*")
      .ilike("email", email.trim())
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401, headers: corsHeaders() });
    }

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401, headers: corsHeaders() });
    }

    // Step 1 Passed: Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpId = "otp_" + Date.now();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const tempToken = signJwt({ id: user.id, email: user.email, type: "otp_pending" }, "10m");

    await supabase.from("admin_otps").insert({
      id: otpId,
      email: user.email,
      otp_code: otp,
      temp_token: tempToken,
      expires_at: expiresAt,
      used: false,
    });

    const emailResult = await sendAdminOtpEmail(user.email, otp);
    if (!emailResult.sent) {
      return NextResponse.json(
        { error: `Failed to send email to ${user.email}: ${emailResult.error}` },
        { status: 500, headers: corsHeaders() }
      );
    }

    const message = emailResult.redirectedToOwner
      ? `Verification code dispatched to owner ${emailResult.ownerEmail} (Resend Sandbox).`
      : `A 6-digit verification code was sent to ${user.email}`;

    return NextResponse.json(
      {
        success: true,
        requireOtp: true,
        tempToken,
        email: user.email,
        message,
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500, headers: corsHeaders() });
  }
}
