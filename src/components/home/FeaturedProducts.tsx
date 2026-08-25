import { Product } from "@/lib/types";
import ProductCard from "../products/ProductCard";

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

interface FeaturedProductsProps {
  products?: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const displayProducts = products && products.length > 0 ? products : FALLBACK_PRODUCTS;

  return (
    <section className="py-24 border-b border-ink" id="products">
      <div className="section-header">
        <span className="section-tag">// 01</span>
        <h2 className="section-title">THE COLLECTION</h2>
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
