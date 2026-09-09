import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUserFromRequest, corsHeaders } from "@/lib/jwt";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders() });

    const contentType = request.headers.get("content-type") || "";
    const supabase = createAdminClient();

    let name = "";
    let slug = "";
    let description = "";
    let short_description = "";
    let price = 0;
    let category_id: string | null = null;
    let product_code = "";
    let stock_status = "in_stock";
    let featured = false;
    let active = true;
    const uploadedImageUrls: string[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      name = (formData.get("name") as string) || "";
      slug = (formData.get("slug") as string) || "";
      description = (formData.get("description") as string) || "";
      short_description = (formData.get("short_description") as string) || "";
      price = parseFloat(formData.get("price") as string) || 0;
      category_id = (formData.get("category_id") as string) || null;
      product_code = (formData.get("product_code") as string) || "";
      stock_status = (formData.get("stock_status") as string) || "in_stock";
      featured = formData.get("featured") === "true" || formData.get("featured") === "1";
      active = formData.get("active") !== "false" && formData.get("active") !== "0";

      // Process uploaded files into Supabase Storage
      const files: File[] = [];
      formData.forEach((value, key) => {
        if ((key === "images" || key === "image") && value instanceof File && value.size > 0) {
          files.push(value);
        }
      });

      for (const file of files) {
        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const buffer = await file.arrayBuffer();

        const { error: uploadErr } = await supabase.storage
          .from("products")
          .upload(fileName, buffer, { contentType: file.type, upsert: true });

        if (!uploadErr) {
          const { data: publicData } = supabase.storage.from("products").getPublicUrl(fileName);
          if (publicData?.publicUrl) uploadedImageUrls.push(publicData.publicUrl);
        }
      }
    } else {
      const body = await request.json();
      name = body.name || "";
      slug = body.slug || "";
      description = body.description || "";
      short_description = body.short_description || "";
      price = parseFloat(body.price) || 0;
      category_id = body.category_id || null;
      product_code = body.product_code || "";
      stock_status = body.stock_status || "in_stock";
      featured = Boolean(body.featured);
      active = body.active !== false;
      if (body.image) uploadedImageUrls.push(body.image);
    }

    if (!name) return NextResponse.json({ error: "Product name is required" }, { status: 400, headers: corsHeaders() });
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);

    const { data: product, error: insertErr } = await supabase
      .from("products")
      .insert({
        name,
        slug: finalSlug,
        description,
        short_description,
        price,
        category_id,
        product_code,
        stock_status,
        featured,
        active,
      })
      .select()
      .single();

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500, headers: corsHeaders() });
    }

    // Insert image records
    for (let i = 0; i < uploadedImageUrls.length; i++) {
      await supabase.from("product_images").insert({
        product_id: product.id,
        image_url: uploadedImageUrls[i],
        storage_path: uploadedImageUrls[i],
        sort_order: i + 1,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product: { ...product, image: uploadedImageUrls[0] || null },
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    console.error("Create product error:", err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}
