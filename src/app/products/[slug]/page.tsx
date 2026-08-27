import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import WhatsAppButton from "@/components/products/WhatsAppButton";
import { Product } from "@/lib/types";

const FALLBACK_PRODUCTS: Record<string, Product> = {
  "sage-green-vacuum-flask-set": {
    id: "1",
    name: "SAGE GREEN VACUUM FLASK SET",
    slug: "sage-green-vacuum-flask-set",
    description: "Embrace the everyday with your sage green travel companion. A complete set for all your hot or cold drinks. Keep them at temperature, wherever life takes you. Features double-wall stainless steel insulation, leakproof lid, matching travel mugs, and premium gift box packaging.",
    short_description: "Sage Green Travel Companion. Complete hot & cold vacuum flask set with matching cups.",
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
  "insulated-stainless-water-bottle": {
    id: "1",
    name: "INSULATED STAINLESS WATER BOTTLE",
    slug: "insulated-stainless-water-bottle",
    description: "Double-wall insulated stainless steel bottle designed for daily hydration. Features a leakproof vacuum-sealed lid, non-slip base, and keeps beverages cold for up to 24 hours or hot for 12 hours.",
    short_description: "Double-wall insulated stainless steel bottle. Keeps drinks cold for 24h.",
    price: 1200,
    category_id: "cat-1",
    product_code: "LFS-101",
    stock_status: "in_stock",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "premium-weekender-travel-bag": {
    id: "2",
    name: "PREMIUM WEEKENDER TRAVEL BAG",
    slug: "premium-weekender-travel-bag",
    description: "Spacious and durable weekender bag designed for short trips and getaways. Features water-resistant canvas, premium leather accents, multiple compartments, and a comfortable shoulder strap for easy carrying.",
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
  "minimalist-canvas-everyday-tote": {
    id: "3",
    name: "MINIMALIST CANVAS EVERYDAY TOTE",
    slug: "minimalist-canvas-everyday-tote",
    description: "Crafted from ultra-durable 16oz organic cotton canvas. Features reinforced handles, a padded 15-inch laptop compartment, key clip, and interior zippered organization pockets for work and daily travel.",
    short_description: "Heavyweight organic cotton tote bag for daily errands and work.",
    price: 35,
    category_id: "cat-3",
    product_code: "LFS-103",
    stock_status: "in_stock",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let product: Product | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("products").select("*").eq("slug", slug).single();
    if (data) product = data;
  } catch (err) {
    console.error("Failed to load product metadata:", err);
  }
  if (!product && FALLBACK_PRODUCTS[slug]) {
    product = FALLBACK_PRODUCTS[slug];
  }

  if (!product) return { title: "Product Not Found — Laura Fancy Store" };

  return {
    title: `${product.name} — Laura Fancy Store`,
    description: product.short_description || product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: Product | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("slug", slug)
      .single();
    if (data) product = data;
  } catch (err) {
    console.error("Failed to load product detail:", err);
  }

  if (!product && FALLBACK_PRODUCTS[slug]) {
    product = FALLBACK_PRODUCTS[slug];
  }

  if (!product) {
    notFound();
  }

  const primaryImage = product.images?.[0]?.image_url || "/assets/images/logo.png";
  const stockBadgeMap: Record<string, string> = {
    in_stock: "In Stock",
    out_of_stock: "Out of Stock",
    pre_order: "Pre-Order",
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="px-6 md:px-12 mb-8">
        <Link
          href="/products"
          className="text-xs font-mono text-grey hover:text-ink transition-colors flex items-center gap-2"
        >
          ← Back to Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 md:px-12">
        {/* Product Image Box */}
        <div className="border-2 border-ink p-8 bg-paper-warm flex flex-col items-center justify-center relative aspect-square">
          {product.images && product.images.length > 0 ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
              <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-40 opacity-80">
                <rect x="40" y="40" width="120" height="100" rx="6" stroke="#111" strokeWidth="2.5" fill="#fcfbfa" />
                <path d="M75 40 C75 18, 125 18, 125 40" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <circle cx="100" cy="90" r="16" fill="#111" />
                <path d="M94 90 L98 94 L106 85" stroke="#fcfbfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
          <span className="font-mono text-xs text-grey uppercase tracking-widest mt-2">Verified Authentic Quality Product</span>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] tracking-[0.2em] px-2.5 py-1 border border-ink bg-ink text-paper uppercase font-bold">
              {stockBadgeMap[product.stock_status] || "Available"}
            </span>
            {product.product_code && (
              <span className="text-xs font-mono text-grey tracking-wider">
                CODE: {product.product_code}
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl sm:text-6xl tracking-wider mb-4 leading-none">
            {product.name}
          </h1>

          <div className="font-display text-3xl sm:text-4xl mb-6">Rs. {product.price.toLocaleString('en-US')}</div>

          <div className="w-full h-[1px] bg-ink/20 mb-6" />

          <p className="text-sm leading-relaxed text-[#333] mb-8">{product.description}</p>

          <div className="border border-ink p-5 mb-8 bg-paper-warm space-y-2">
            <div className="text-[10px] tracking-[0.2em] font-bold text-grey uppercase mb-2">
              ✦ STORE GUARANTEE & SHIPPING SPECS
            </div>
            <div className="text-xs flex justify-between">
              <span className="text-grey">Dispatch Time:</span>
              <span className="font-bold">24 Hours (Express Shipping)</span>
            </div>
            <div className="text-xs flex justify-between">
              <span className="text-grey">Quality Assurance:</span>
              <span className="font-bold">100% Inspected & Sealed</span>
            </div>
            <div className="text-xs flex justify-between">
              <span className="text-grey">Return Guarantee:</span>
              <span className="font-bold">30 Days Easy Replacement</span>
            </div>
          </div>

          <div className="mt-auto">
            <WhatsAppButton
              productName={product.name}
              price={product.price}
              productCode={product.product_code}
              variant="large"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
