import { Product } from "@/lib/types";
import ProductCard from "../products/ProductCard";

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "INSULATED STAINLESS WATER BOTTLE",
    slug: "insulated-stainless-water-bottle",
    description: "Double-wall insulated stainless steel bottle. Keeps drinks cold for 24h, leakproof cap.",
    short_description: "Double-wall insulated stainless steel bottle. Keeps drinks cold for 24h.",
    price: 28,
    category_id: "cat-1",
    product_code: "LFS-101",
    stock_status: "in_stock",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "WIRELESS NOISE-CANCELING EARBUDS",
    slug: "wireless-noise-canceling-earbuds",
    description: "Crystal clear sound with active noise cancellation, touch controls, and 30-hour battery life.",
    short_description: "Active noise cancellation, touch controls, and 30h total battery life.",
    price: 79,
    category_id: "cat-2",
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
    price: 35,
    category_id: "cat-3",
    product_code: "LFS-103",
    stock_status: "in_stock",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

interface FeaturedProductsProps {
  products?: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const displayProducts = products && products.length > 0 ? products : FALLBACK_PRODUCTS;

  return (
    <section className="py-24 border-b border-ink" id="products">
      <div className="section-header">
        <span className="section-tag">// 01</span>
        <h2 className="section-title">FEATURED ESSENTIALS</h2>
        <div className="section-line" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-ink mx-6 md:mx-12">
        {displayProducts.map((product, idx) => (
          <ProductCard key={product.id || product.slug} product={product} index={idx + 1} />
        ))}
      </div>
    </section>
  );
}
