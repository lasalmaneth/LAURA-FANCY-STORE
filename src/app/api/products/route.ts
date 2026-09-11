import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { corsHeaders } from "@/lib/jwt";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    const featuredOnly = searchParams.get("featured") === "true";
    const category = searchParams.get("category");

    const supabase = createAdminClient();
    let query = supabase
      .from("products")
      .select("*, categories(*), images:product_images(*)")
      .order("priority_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (activeOnly) query = query.eq("active", true);
    if (featuredOnly) query = query.eq("featured", true);
    if (category) query = query.eq("category_id", category);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });

    // Format products with main image and category for backward compatibility
    const formatted = (data || []).map((p: any) => ({
      ...p,
      category: p.categories || null,
      image: p.images?.[0]?.image_url || null,
    }));

    return NextResponse.json(formatted, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}
