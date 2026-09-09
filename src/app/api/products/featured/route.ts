import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { corsHeaders } from "@/lib/jwt";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*), images:product_images(*)")
      .eq("active", true)
      .eq("featured", true)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });

    const formatted = (data || []).map((p: any) => ({
      ...p,
      image: p.images?.[0]?.image_url || null,
    }));

    return NextResponse.json(formatted, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}
