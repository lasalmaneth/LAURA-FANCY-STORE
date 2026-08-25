"use client";

import { useState } from "react";
import { createCategory, deleteCategory } from "@/actions/categories";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: "cat-1", name: "Seating", slug: "seating" },
  { id: "cat-2", name: "Tables", slug: "tables" },
  { id: "cat-3", name: "Shelving", slug: "shelving" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    const newCat = {
      id: `cat-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    setCategories((prev) => [...prev, newCat]);
    await createCategory(name);
    setName("");
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    await deleteCategory(id);
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-grey uppercase block mb-1">
          ORGANIZATION
        </span>
        <h1 className="font-display text-4xl tracking-wider">CATEGORIES</h1>
      </div>

      <form onSubmit={handleAdd} className="border-2 border-ink p-6 bg-paper flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Category Name (e.g. Lighting)"
          required
          className="flex-1 font-mono text-xs p-3 border border-ink bg-transparent outline-none"
        />
        <button type="submit" disabled={loading} className="btn btn--primary shrink-0">
          + Add Category
        </button>
      </form>

      <div className="border-2 border-ink bg-paper divide-y divide-ink/20">
        {categories.map((c) => (
          <div key={c.id} className="p-4 flex items-center justify-between font-mono text-xs">
            <div>
              <span className="font-bold">{c.name}</span>
              <span className="text-grey ml-3 text-[10px]">/products?category={c.slug}</span>
            </div>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-red-700 hover:underline uppercase text-[10px] font-bold"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
