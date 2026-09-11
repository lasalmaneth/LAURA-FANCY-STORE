import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUserFromRequest, corsHeaders } from "@/lib/jwt";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders() });

    const { id } = await params;
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
    let priority_order: number | null = null;
    const newImageUrls: string[] = [];

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
      if (formData.has("priority_order")) {
        const pVal = parseInt(formData.get("priority_order") as string, 10);
        if (!isNaN(pVal)) priority_order = pVal;
      }

      const files: File[] = [];
      formData.forEach((value, key) => {
        if ((key === "images" || key === "image" || key.startsWith("image_") || key.startsWith("image")) && value instanceof File && value.size > 0) {
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
          if (publicData?.publicUrl) newImageUrls.push(publicData.publicUrl);
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
      if (body.priority_order !== undefined && body.priority_order !== null) {
        const pNum = parseInt(body.priority_order, 10);
        if (!isNaN(pNum)) priority_order = pNum;
      }
    }

    const updatePayload: Record<string, any> = {
      name,
      description,
      short_description,
      price,
      category_id,
      product_code,
      stock_status,
      featured,
      active,
      updated_at: new Date().toISOString(),
    };

    if (slug && slug.trim()) {
      updatePayload.slug = slug.trim();
    }

    if (priority_order !== null) {
      updatePayload.priority_order = priority_order;
    }

    let { data: updated, error: updateErr } = await supabase
      .from("products")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updateErr && updateErr.message?.includes("priority_order")) {
      delete updatePayload.priority_order;
      const retry = await supabase
        .from("products")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();
      updated = retry.data;
      updateErr = retry.error;
    }

    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500, headers: corsHeaders() });

    if (newImageUrls.length > 0) {
      await supabase.from("product_images").delete().eq("product_id", id);
      for (let i = 0; i < newImageUrls.length; i++) {
        await supabase.from("product_images").insert({
          product_id: id,
          image_url: newImageUrls[i],
          storage_path: newImageUrls[i],
          sort_order: i + 1,
        });
      }
    }

    return NextResponse.json({ success: true, message: "Product updated", product: updated }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = getAdminUserFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders() });

    const { id } = await params;
    const supabase = createAdminClient();

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });

    return NextResponse.json({ success: true, message: "Product deleted" }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}
