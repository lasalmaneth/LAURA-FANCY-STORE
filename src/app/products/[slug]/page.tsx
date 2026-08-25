import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import WhatsAppButton from "@/components/products/WhatsAppButton";
import { Product } from "@/lib/types";

const FALLBACK_PRODUCTS: Record<string, Product> = {
  "oak-side-chair": {
    id: "1",
    name: "OAK SIDE CHAIR",
    slug: "oak-side-chair",
    description: "Solid white oak. Hand-planed, hand-oiled. Each chair unique in grain and character. Built with traditional mortise and tenon joinery for heirloom quality. Hand-finished with organic white beeswax.",
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
  "dining-table": {
    id: "2",
    name: "DINING TABLE",
    slug: "dining-table",
    description: "Reclaimed pine with hand-cut dovetail joinery. Seats 6 comfortably. Finished with organic beeswax and linseed oil. Designed for a lifetime of family gatherings.",
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
  "wall-shelf-unit": {
    id: "3",
    name: "WALL SHELF UNIT",
    slug: "wall-shelf-unit",
    description: "Three-tier solid ash wall mounted shelf. Minimal brackets, maximum character. Perfect for displaying ceramics and literature.",
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
  } catch {}
  if (!product) product = FALLBACK_PRODUCTS[slug] || null;

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
  } catch {}

  if (!product) {
    product = FALLBACK_PRODUCTS[slug] || null;
  }

  if (!product) {
    notFound();
  }

  const stockBadgeMap = {
    in_stock: "IN STOCK",
    out_of_stock: "OUT OF STOCK",
    coming_soon: "COMING SOON",
  };

  const mainImage = product.images?.[0]?.image_url;

  return (
    <div className="pt-28 pb-24 min-h-screen px-6 md:px-12">
      <div className="mb-8">
        <Link
          href="/products"
          className="text-xs font-mono font-bold tracking-widest text-grey hover:text-ink transition-colors uppercase inline-flex items-center gap-2"
        >
          ← Back to Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border border-ink bg-paper p-8 md:p-14">
        {/* Gallery / Image Section */}
        <div className="flex flex-col gap-4 items-center justify-center bg-paper-warm border border-ink p-12 min-h-[380px] relative">
          {mainImage ? (
            <div className="relative w-full h-80">
              <Image src={mainImage} alt={product.name} fill className="object-contain" priority />
            </div>
          ) : (
            <div className="w-48 h-48 flex items-center justify-center">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
                <g stroke="#111" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="65" y1="100" x2="58" y2="170" />
                  <line x1="135" y1="100" x2="142" y2="170" />
                  <line x1="70" y1="120" x2="64" y2="185" />
                  <line x1="130" y1="120" x2="136" y2="185" />
                  <path d="M58 112 Q100 100 142 112 Q140 126 100 128 Q60 126 58 112Z" />
                  <path d="M60 100 Q100 88 140 100" />
                  <line x1="60" y1="100" x2="58" y2="112" />
                  <line x1="140" y1="100" x2="142" y2="112" />
                  <path d="M61 106 Q100 95 139 106" strokeWidth="1" />
                </g>
              </svg>
            </div>
          )}
          <span className="font-hand text-xs text-grey italic">Handcrafted drawing prototype</span>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] tracking-[0.2em] px-2.5 py-1 border border-ink bg-ink text-paper uppercase font-bold">
              {stockBadgeMap[product.stock_status]}
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

          <div className="font-display text-3xl sm:text-4xl mb-6">${product.price}</div>

          <div className="w-full h-[1px] bg-ink/20 mb-6" />

          <p className="text-sm leading-relaxed text-[#333] mb-8">{product.description}</p>

          <div className="border border-ink p-5 mb-8 bg-paper-warm space-y-2">
            <div className="text-[10px] tracking-[0.2em] font-bold text-grey uppercase mb-2">
              ✦ SPECIFICATIONS & CRAFT
            </div>
            <div className="text-xs flex justify-between">
              <span className="text-grey">Warranty:</span>
              <span className="font-bold">7-Year Workshop Coverage</span>
            </div>
            <div className="text-xs flex justify-between">
              <span className="text-grey">Build Time:</span>
              <span className="font-bold">35 - 45 Hours</span>
            </div>
            <div className="text-xs flex justify-between">
              <span className="text-grey">Origin:</span>
              <span className="font-bold">Portland Studio</span>
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
