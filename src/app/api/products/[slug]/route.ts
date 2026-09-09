import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { corsHeaders } from "@/lib/jwt";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const supabase = createAdminClient();

    // Query by slug or id
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    let query = supabase.from("products").select("*, categories(*), images:product_images(*)");

    if (isUuid) {
      query = query.or(`slug.eq.${slug},id.eq.${slug}`);
    } else {
      query = query.eq("slug", slug);
    }

    const { data, error } = await query.single();
    if (error || !data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404, headers: corsHeaders() });
    }

    const formatted = {
      ...data,
      image: data.images?.[0]?.image_url || null,
    };

    return NextResponse.json(formatted, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}
