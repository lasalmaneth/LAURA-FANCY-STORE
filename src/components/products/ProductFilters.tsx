"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/lib/types";

interface ProductFiltersProps {
  categories: Category[];
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("search", e.target.value);
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-center justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange("")}
          className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border border-ink transition-colors ${
            !activeCategory ? "bg-ink text-paper" : "bg-transparent text-ink hover:bg-paper-warm"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border border-ink transition-colors ${
              activeCategory === cat.slug ? "bg-ink text-paper" : "bg-transparent text-ink hover:bg-paper-warm"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="relative flex-1 max-w-xs">
        <input
          type="text"
          defaultValue={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search pieces..."
          className="w-full font-mono text-xs text-ink bg-transparent border-b border-ink py-2 outline-none focus:border-b-2 placeholder:text-grey-light transition-all"
        />
      </div>
    </div>
  );
}
