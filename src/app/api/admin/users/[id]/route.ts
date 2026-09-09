import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUserFromRequest, corsHeaders } from "@/lib/jwt";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders() });
    }

    const { id } = await params;
    const supabase = createAdminClient();

    const { data: targetUser } = await supabase.from("admin_users").select("*").eq("id", id).single();
    if (!targetUser) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404, headers: corsHeaders() });
    }

    if (admin.id === id || admin.email.toLowerCase() === targetUser.email.toLowerCase()) {
      return NextResponse.json({ error: "You cannot delete your own admin account while logged in." }, { status: 400, headers: corsHeaders() });
    }

    const { count } = await supabase.from("admin_users").select("*", { count: "exact", head: true });
    if ((count || 0) <= 1) {
      return NextResponse.json({ error: "Cannot delete the sole remaining administrator account." }, { status: 400, headers: corsHeaders() });
    }

    await supabase.from("admin_users").delete().eq("id", id);

    return NextResponse.json({ success: true, message: `Admin account ${targetUser.email} deleted.` }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}
