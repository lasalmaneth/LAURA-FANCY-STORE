import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyJwt, signJwt, corsHeaders } from "@/lib/jwt";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    const { tempToken, otp } = await request.json();
    if (!tempToken || !otp) {
      return NextResponse.json({ error: "Temporary token and OTP are required" }, { status: 400, headers: corsHeaders() });
    }

    const decoded = verifyJwt(tempToken);
    if (!decoded || decoded.type !== "otp_pending") {
      return NextResponse.json({ error: "Session expired. Please sign in again." }, { status: 401, headers: corsHeaders() });
    }

    const supabase = createAdminClient();
    const { data: record, error } = await supabase
      .from("admin_otps")
      .select("*")
      .eq("email", decoded.email)
      .eq("temp_token", tempToken)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !record) {
      return NextResponse.json({ error: "No active verification code found. Please request a new code." }, { status: 400, headers: corsHeaders() });
    }

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json({ error: "Verification code has expired. Please request a new code." }, { status: 400, headers: corsHeaders() });
    }

    if (record.otp_code.trim() !== otp.toString().trim()) {
      return NextResponse.json({ error: "Incorrect verification code. Please check and try again." }, { status: 400, headers: corsHeaders() });
    }

    // Mark used
    await supabase.from("admin_otps").update({ used: true }).eq("id", record.id);

    // Get user details
    const { data: user } = await supabase
      .from("admin_users")
      .select("id, email, role")
      .eq("email", decoded.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404, headers: corsHeaders() });
    }

    const token = signJwt({ id: user.id, email: user.email, role: user.role }, "24h");

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500, headers: corsHeaders() });
  }
}
