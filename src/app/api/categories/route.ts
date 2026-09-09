import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUserFromRequest, corsHeaders } from "@/lib/jwt";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
    return NextResponse.json(data || [], { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request: Request) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders() });

    const { name, slug } = await request.json();
    if (!name) return NextResponse.json({ error: "Category name is required" }, { status: 400, headers: corsHeaders() });

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("categories")
      .insert({ name, slug: finalSlug })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
    return NextResponse.json({ success: true, category: data }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}
