import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductTable from "@/components/admin/ProductTable";
import { Product } from "@/lib/types";

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "OAK SIDE CHAIR",
    slug: "oak-side-chair",
    description: "Solid white oak. Hand-planed, hand-oiled. Each chair unique in grain.",
    short_description: "Solid white oak.",
    price: 485,
    category_id: "cat-1",
    product_code: "LFS-001",
    stock_status: "in_stock",
    featured: false,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "DINING TABLE",
    slug: "dining-table",
    description: "Reclaimed pine with dovetail joinery. Seats 6 comfortably.",
    short_description: "Reclaimed pine.",
    price: 1240,
    category_id: "cat-2",
    product_code: "LFS-002",
    stock_status: "in_stock",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default async function AdminProductsPage() {
  let products: Product[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("products").select("*, category:categories(*)").order("created_at", { ascending: false });
    if (data && data.length > 0) products = data;
  } catch {}

  if (products.length === 0) products = FALLBACK_PRODUCTS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-grey uppercase block mb-1">
            CATALOG MANAGEMENT
          </span>
          <h1 className="font-display text-4xl tracking-wider">PRODUCTS</h1>
        </div>
        <Link href="/admin/products/new" className="btn btn--primary">
          + Add Product
        </Link>
      </div>

      <ProductTable initialProducts={products} />
    </div>
  );
}
