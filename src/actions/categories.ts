"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createCategory(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert([{ name, slug }])
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true, data };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true };
}
