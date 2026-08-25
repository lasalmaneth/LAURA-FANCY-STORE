"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { StockStatus } from "@/lib/types";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const description = formData.get("description") as string;
  const short_description = formData.get("short_description") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const category_id = formData.get("category_id") as string || null;
  const product_code = formData.get("product_code") as string;
  const stock_status = (formData.get("stock_status") as StockStatus) || "in_stock";
  const featured = formData.get("featured") === "true";
  const active = formData.get("active") !== "false";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name,
        slug,
        description,
        short_description,
        price,
        category_id,
        product_code,
        stock_status,
        featured,
        active,
      },
    ])
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true, data };
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const short_description = formData.get("short_description") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const category_id = formData.get("category_id") as string || null;
  const product_code = formData.get("product_code") as string;
  const stock_status = (formData.get("stock_status") as StockStatus) || "in_stock";
  const featured = formData.get("featured") === "true";
  const active = formData.get("active") !== "false";

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      description,
      short_description,
      price,
      category_id,
      product_code,
      stock_status,
      featured,
      active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/admin/products");
  return { success: true };
}

export async function toggleProductActive(id: string, active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ active, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function toggleProductFeatured(id: string, featured: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ featured, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}
