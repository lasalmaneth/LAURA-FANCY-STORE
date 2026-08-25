import { Product } from "@/lib/types";
import ProductCard from "../products/ProductCard";

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
    name: "WIRELESS NOISE-CANCELING EARBUDS",
    slug: "wireless-noise-canceling-earbuds",
    description: "Crystal clear sound with active noise cancellation, touch controls, and 30-hour battery life.",
    short_description: "Active noise cancellation, touch controls, and 30h total battery life.",
    price: 2990,
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
    price: 1500,
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
