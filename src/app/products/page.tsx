import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import { Product, Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Online Store Catalog — Laura Fancy Store",
  description: "Shop everyday customer needs, gadgets, fashion, home essentials, and lifestyle products.",
};

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "SAGE GREEN VACUUM FLASK SET",
    slug: "sage-green-vacuum-flask-set",
    description: "A complete set for all your hot or cold drinks. Keep them at temperature, wherever life takes you. Includes insulated vacuum bottle and matching travel cups.",
    short_description: "Your Sage Green Travel Companion. Complete hot & cold vacuum flask set.",
    price: 1200,
    category_id: "cat-1",
    product_code: "LFS-100",
    stock_status: "in_stock",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: "img-1",
        product_id: "1",
        image_url: "/assets/images/vacuum-flask-set.jpg",
        storage_path: "assets/images/vacuum-flask-set.jpg",
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "2",
    name: "PREMIUM WEEKENDER TRAVEL BAG",
    slug: "premium-weekender-travel-bag",
    description: "Spacious and durable weekender bag designed for short trips and getaways. Features water-resistant canvas, premium leather accents, and multiple compartments.",
    short_description: "Spacious water-resistant canvas travel bag with leather accents.",
    price: 4500,
    category_id: "cat-3",
    product_code: "LFS-102",
    stock_status: "in_stock",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "MINIMALIST CANVAS EVERYDAY TOTE",
    slug: "minimalist-canvas-everyday-tote",
    description: "Heavyweight organic cotton canvas tote with interior zip pocket for laptop and daily essentials.",
    short_description: "Heavyweight organic cotton tote bag for daily errands and work.",
    price: 1500,
    category_id: "cat-3",
    product_code: "LFS-103",
    stock_status: "in_stock",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "SMART AMBIENT DESK LAMP",
    slug: "smart-ambient-desk-lamp",
    description: "Touch-controlled LED lamp with adjustable brightness, color temperature, and wireless charging pad base.",
    short_description: "Touch LED desk lamp with adjustable brightness and wireless phone charger.",
    price: 49,
    category_id: "cat-4",
    product_code: "LFS-104",
    stock_status: "in_stock",
    featured: false,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "ORGANIC SKINCARE HYDRATION SET",
    slug: "organic-skincare-hydration-set",
    description: "Gentle daily facial cleanser, hydrating serum, and lightweight moisturizer for healthy daily skin care.",
    short_description: "3-piece organic daily skincare hydration set.",
    price: 42,
    category_id: "cat-5",
    product_code: "LFS-105",
    stock_status: "in_stock",
    featured: false,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const FALLBACK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Household & Living", slug: "household-living", created_at: "", updated_at: "" },
  { id: "cat-2", name: "Electronics & Gadgets", slug: "electronics-gadgets", created_at: "", updated_at: "" },
  { id: "cat-3", name: "Fashion & Accessories", slug: "fashion-accessories", created_at: "", updated_at: "" },
  { id: "cat-4", name: "Home & Office", slug: "home-office", created_at: "", updated_at: "" },
  { id: "cat-5", name: "Beauty & Care", slug: "beauty-care", created_at: "", updated_at: "" },
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
          // SHOP ALL PRODUCTS
        </span>
        <h1 className="font-display text-5xl md:text-7xl tracking-wider">STORE CATALOG</h1>
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
