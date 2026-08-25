"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import WhatsAppButton from "./WhatsAppButton";
import ProductQuickViewModal from "./ProductQuickViewModal";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 1 }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const isFeatured = product.featured;
  const numStr = String(index).padStart(3, "0");
  const mainImage = product.images?.[0]?.image_url;

  return (
    <>
      <article
        className={`product-card relative flex flex-col border-b md:border-b-0 md:border-r border-ink transition-colors duration-200 ${
          isFeatured
            ? "bg-ink text-paper hover:bg-[#111]"
            : "bg-paper text-ink hover:bg-paper-warm"
        }`}
        id={`product-${product.slug}`}
      >
        {/* Top Product Image Container with Full-Box Coverage */}
        <div className="relative w-full aspect-[4/3] overflow-hidden flex items-center justify-center border-b border-ink/20 group">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="w-[130px] h-[130px] flex items-center justify-center">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
                <g stroke={isFeatured ? "#f5f4f0" : "#111"} strokeWidth="2" strokeLinecap="round">
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

          {isFeatured && (
            <div className="absolute top-4 right-4 text-[9px] tracking-[0.2em] px-2.5 py-1 border border-paper bg-ink/80 text-paper z-10 backdrop-blur-sm">
              BESTSELLER
            </div>
          )}

          {/* Quick View Pill Button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[80%] max-w-[200px]">
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuickViewOpen(true);
              }}
              className="w-full py-2.5 px-4 bg-white/95 text-ink font-mono text-xs font-bold tracking-wider rounded-lg shadow-xl hover:bg-ink hover:text-white transition-all transform hover:scale-105 uppercase text-center border border-ink/20"
            >
              Quick view
            </button>
          </div>

          <div
            className={`absolute bottom-3 right-5 font-display text-4xl pointer-events-none select-none z-10 ${
              mainImage ? "text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" : isFeatured ? "text-paper/10" : "text-ink/10"
            }`}
          >
            {numStr}
          </div>
        </div>

        {/* Product Card Details */}
        <div className={`p-8 pt-0 flex flex-col flex-1 border-t ${isFeatured ? "border-paper/30" : "border-ink/10"}`}>
          <h3 className="font-display text-2xl tracking-wider pt-5 mb-2.5">
            <Link href={`/products/${product.slug}`} className="hover:underline">
              {product.name}
            </Link>
          </h3>
          <p
            className={`text-xs leading-relaxed flex-1 mb-6 ${
              isFeatured ? "text-paper/60" : "text-grey"
            }`}
          >
            {product.short_description || product.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="font-display text-2xl tracking-wide">
              Rs. {product.price.toLocaleString('en-US')}
            </span>
            <WhatsAppButton
              productName={product.name}
              price={product.price}
              productCode={product.product_code}
              variant={isFeatured ? "featured" : "default"}
            />
          </div>
        </div>
      </article>

      {/* Quick View Modal Popup */}
      <ProductQuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
