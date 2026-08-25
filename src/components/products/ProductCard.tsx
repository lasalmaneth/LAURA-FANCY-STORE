import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import WhatsAppButton from "./WhatsAppButton";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 1 }: ProductCardProps) {
  const isFeatured = product.featured;
  const numStr = String(index).padStart(3, "0");
  const mainImage = product.images?.[0]?.image_url;

  return (
    <article
      className={`product-card relative flex flex-col border-b md:border-b-0 md:border-r border-ink transition-colors duration-200 ${
        isFeatured
          ? "bg-ink text-paper hover:bg-[#111]"
          : "bg-paper text-ink hover:bg-paper-warm"
      }`}
      id={`product-${product.slug}`}
    >
      {isFeatured && (
        <div className="absolute top-4 right-4 text-[9px] tracking-[0.2em] px-2.5 py-1 border border-paper text-paper">
          BESTSELLER
        </div>
      )}

      <div className="p-10 pb-6 relative flex items-center justify-center min-h-[220px]">
        {mainImage ? (
          <div className="relative w-full h-44">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
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
        <div
          className={`absolute bottom-3 right-5 font-display text-4xl pointer-events-none select-none ${
            isFeatured ? "text-paper/10" : "text-ink/10"
          }`}
        >
          {numStr}
        </div>
      </div>

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
            ${product.price}
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
  );
}
