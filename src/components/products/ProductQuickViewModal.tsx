"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import WhatsAppButton from "./WhatsAppButton";

interface ProductQuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickViewModal({
  product,
  isOpen,
  onClose,
}: ProductQuickViewModalProps) {
  // Extract up to 4 images from product.images sorted by sort_order
  const imageList =
    product?.images && product.images.length > 0
      ? product.images
          .slice()
          .sort((a, b) => (a.sort_order || 1) - (b.sort_order || 1))
          .slice(0, 4)
          .map((img) => img.image_url)
      : [product?.images?.[0]?.image_url || "/assets/images/vacuum-flask-set.jpg"];

  const primaryImage = imageList[0];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Always reset to the 1st image as default when modal opens or product changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id, isOpen]);

  if (!isOpen) return null;

  const currentImage = imageList[activeImageIndex] || primaryImage;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-4xl bg-paper border-2 border-ink p-6 sm:p-10 shadow-2xl rounded-2xl z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 flex items-center justify-center rounded-full bg-paper-warm border border-ink text-ink hover:bg-ink hover:text-paper font-bold transition-all z-20"
          aria-label="Close Quick View"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery Thumbnails + Main Image */}
          <div className="md:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-start">
            {/* Thumbnail Column */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[380px] w-full sm:w-20 shrink-0">
              {imageList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? "border-ink ring-2 ring-ink/30 scale-105"
                      : "border-ink/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>

            {/* Main Preview Box */}
            <div className="relative w-full aspect-square rounded-2xl border-2 border-ink bg-paper-warm overflow-hidden flex items-center justify-center p-6">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  priority
                />
              ) : (
                <span className="font-mono text-xs text-grey">No image available</span>
              )}
            </div>
          </div>

          {/* Right Column: Product Information & Actions */}
          <div className="md:col-span-5 flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.25em] text-grey uppercase mb-1">
              LAURA FANCY STORE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl tracking-wide mb-2 leading-tight">
              {product.name}
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <span className="font-display text-3xl text-ink font-bold">
                Rs. {product.price.toLocaleString('en-US')}
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 border border-ink bg-ink text-paper font-bold rounded">
                {product.stock_status === "in_stock" ? "In Stock" : "Available"}
              </span>
            </div>

            <p className="text-xs text-grey mb-3">
              Free shipping & 24h express dispatch calculated at checkout.
            </p>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 text-amber-500 text-xs mb-5">
              <span>★★★★★</span>
              <span className="text-grey font-mono text-[11px] ml-1">4.9 / 5.0 (Customer Favorite)</span>
            </div>

            <div className="w-full h-[1px] bg-ink/15 mb-5" />

            {/* Bullet Point Highlights */}
            <ul className="space-y-2 text-xs text-[#333] mb-6 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-ink font-bold">•</span>
                <span>{product.description || "High quality customer everyday essential."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ink font-bold">•</span>
                <span>Engineered for durability, daily convenience, and premium utility.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ink font-bold">•</span>
                <span>Includes 100% authenticity guarantee & 30-day easy replacement.</span>
              </li>
            </ul>

            {/* Action Buttons */}
            <div className="mt-auto space-y-3">
              <WhatsAppButton
                productName={product.name}
                price={product.price}
                productCode={product.product_code}
                variant="large"
              />

              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="block text-center w-full py-2.5 font-mono text-xs font-bold tracking-wider uppercase border border-ink text-ink hover:bg-ink hover:text-paper transition-colors"
              >
                View Full Product Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
