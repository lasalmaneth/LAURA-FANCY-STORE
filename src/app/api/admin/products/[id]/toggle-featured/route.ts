import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUserFromRequest, corsHeaders } from "@/lib/jwt";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders() });

    const { id } = await params;
    const { featured } = await request.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("products")
      .update({ featured: Boolean(featured), updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
    return NextResponse.json({ success: true, product: data }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}
