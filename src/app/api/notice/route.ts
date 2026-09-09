import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { corsHeaders } from "@/lib/jwt";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("store_notices")
      .select("*")
      .eq("id", "primary")
      .single();

    return NextResponse.json(data || { is_active: false, notice_text: "", badge_text: "" }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ is_active: false }, { headers: corsHeaders() });
  }
}
