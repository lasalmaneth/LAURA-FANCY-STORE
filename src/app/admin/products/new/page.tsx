"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProduct } from "@/actions/products";

export default function NewProductPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createProduct(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/products");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="font-mono text-xs font-bold text-grey hover:text-ink uppercase mb-2 inline-block"
        >
          ← Back to Products
        </Link>
        <h1 className="font-display text-4xl tracking-wider">NEW PRODUCT</h1>
      </div>

      {error && (
        <div className="p-4 border border-red-700 bg-red-50 text-red-700 text-xs font-mono">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-2 border-ink p-8 bg-paper space-y-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-[0.2em] font-bold uppercase text-grey">
            PRODUCT NAME *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. OAK SIDE CHAIR"
            className="font-mono text-xs p-3 border border-ink bg-transparent outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.2em] font-bold uppercase text-grey">
              PRICE (Rs.) *
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              required
              placeholder="485.00"
              className="font-mono text-xs p-3 border border-ink bg-transparent outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.2em] font-bold uppercase text-grey">
              PRODUCT CODE
            </label>
            <input
              type="text"
              name="product_code"
              placeholder="LFS-001"
              className="font-mono text-xs p-3 border border-ink bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-[0.2em] font-bold uppercase text-grey">
            STOCK STATUS
          </label>
          <select
            name="stock_status"
            className="font-mono text-xs p-3 border border-ink bg-transparent outline-none cursor-pointer"
          >
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-[0.2em] font-bold uppercase text-grey">
            SHORT DESCRIPTION
          </label>
          <input
            type="text"
            name="short_description"
            placeholder="Solid white oak. Hand-planed, hand-oiled."
            className="font-mono text-xs p-3 border border-ink bg-transparent outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-[0.2em] font-bold uppercase text-grey">
            FULL DESCRIPTION
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Detailed craftsmanship information..."
            className="font-mono text-xs p-3 border border-ink bg-transparent outline-none resize-y"
          />
        </div>

        <div className="flex gap-6 border-t border-ink pt-4">
          <label className="flex items-center gap-2 font-mono text-xs cursor-pointer">
            <input type="checkbox" name="featured" value="true" className="w-4 h-4 accent-black" />
            <span>Mark as Bestseller / Featured</span>
          </label>
          <label className="flex items-center gap-2 font-mono text-xs cursor-pointer">
            <input type="checkbox" name="active" value="true" defaultChecked className="w-4 h-4 accent-black" />
            <span>Active / Visible on site</span>
          </label>
        </div>

        <button type="submit" disabled={loading} className="btn btn--primary btn--full mt-4">
          {loading ? "Saving Product..." : "Create Product →"}
        </button>
      </form>
    </div>
  );
}
