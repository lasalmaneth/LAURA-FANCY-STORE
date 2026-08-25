import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import { Product, Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Collection — Laura Fancy Store",
  description: "Browse our handcrafted boutique collection of furniture and objects.",
};

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "OAK SIDE CHAIR",
    slug: "oak-side-chair",
    description: "Solid white oak. Hand-planed, hand-oiled. Each chair unique in grain.",
    short_description: "Solid white oak. Hand-planed, hand-oiled. Each chair unique in grain.",
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
    description: "Reclaimed pine with dovetail joinery. Seats 6 comfortably. Heirloom quality.",
    short_description: "Reclaimed pine with dovetail joinery. Seats 6 comfortably. Heirloom quality.",
    price: 1240,
    category_id: "cat-2",
    product_code: "LFS-002",
    stock_status: "in_stock",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "WALL SHELF UNIT",
    slug: "wall-shelf-unit",
    description: "Three-tier solid ash. Minimal brackets, maximum character.",
    short_description: "Three-tier solid ash. Minimal brackets, maximum character.",
    price: 320,
    category_id: "cat-3",
    product_code: "LFS-003",
    stock_status: "in_stock",
    featured: false,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const FALLBACK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Seating", slug: "seating", created_at: "", updated_at: "" },
  { id: "cat-2", name: "Tables", slug: "tables", created_at: "", updated_at: "" },
  { id: "cat-3", name: "Shelving", slug: "shelving", created_at: "", updated_at: "" },
];

export default async function ProductsCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;
  let products: Product[] = [];
  let categories: Category[] = [];

  try {
    const supabase = await createClient();
    const [prodRes, catRes] = await Promise.all([
      supabase.from("products").select("*, images:product_images(*)").eq("active", true),
      supabase.from("categories").select("*"),
    ]);

    if (prodRes.data && prodRes.data.length > 0) {
      products = prodRes.data;
    }
    if (catRes.data && catRes.data.length > 0) {
      categories = catRes.data;
    }
  } catch (err) {
    console.error("Failed to load catalog data:", err);
  }

  if (products.length === 0) products = FALLBACK_PRODUCTS;
  if (categories.length === 0) categories = FALLBACK_CATEGORIES;

  // Filter in memory for instantaneous rendering
  let filteredProducts = products;
  if (category) {
    filteredProducts = filteredProducts.filter((p) => p.category?.slug === category || p.category_id === category);
  }
  if (search) {
    const query = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.product_code.toLowerCase().includes(query)
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="px-6 md:px-12 mb-12">
        <span className="font-mono text-[10px] tracking-[0.2em] text-grey uppercase block mb-2">
          // ARCHIVE CATALOG
        </span>
        <h1 className="font-display text-5xl md:text-7xl tracking-wider">ALL PIECES</h1>
        <div className="w-full h-[2px] bg-ink mt-4" />
      </div>

      <div className="px-6 md:px-12 mb-10">
        <ProductFilters categories={categories} />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-ink mx-6 md:mx-12">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id || product.slug} product={product} index={idx + 1} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 mx-6 md:mx-12 border border-ink bg-paper-warm">
          <h3 className="font-display text-2xl tracking-wide mb-2">NO PIECES FOUND</h3>
          <p className="text-xs text-grey">Try clearing your search query or selecting another category.</p>
        </div>
      )}
    </div>
  );
}
