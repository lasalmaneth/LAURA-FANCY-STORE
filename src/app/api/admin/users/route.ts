import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUserFromRequest, corsHeaders } from "@/lib/jwt";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders() });
    }

    const supabase = createAdminClient();
    const { data: users, error } = await supabase
      .from("admin_users")
      .select("id, email, role, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
    }

    return NextResponse.json(users || [], { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request: Request) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders() });
    }

    const { email, password, role } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400, headers: corsHeaders() });
    }

    const supabase = createAdminClient();

    // Check duplicate
    const { data: existing } = await supabase
      .from("admin_users")
      .select("id")
      .ilike("email", email.trim())
      .single();

    if (existing) {
      return NextResponse.json({ error: `An admin account with email "${email}" already exists.` }, { status: 400, headers: corsHeaders() });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newId = "admin_" + Date.now();

    const { error: insertErr } = await supabase.from("admin_users").insert({
      id: newId,
      email: email.trim().toLowerCase(),
      password_hash: hash,
      role: role || "admin",
      created_at: new Date().toISOString(),
    });

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500, headers: corsHeaders() });
    }

    return NextResponse.json(
      { success: true, message: `Admin account created for ${email}`, user: { id: newId, email, role: role || "admin" } },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}
