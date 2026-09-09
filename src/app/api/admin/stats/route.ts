import { NextResponse } from "next/server";
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

    const [prodsRes, catsRes] = await Promise.all([
      supabase.from("products").select("id, stock_status"),
      supabase.from("categories").select("id", { count: "exact", head: true }),
    ]);

    const prods = prodsRes.data || [];
    const inStock = prods.filter((p) => p.stock_status === "in_stock").length;
    const outOfStock = prods.filter((p) => p.stock_status === "out_of_stock").length;

    return NextResponse.json(
      {
        total: prods.length,
        inStock,
        outOfStock,
        categoriesCount: catsRes.count || 0,
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}
