"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { toggleProductActive, toggleProductFeatured, deleteProduct } from "@/actions/products";

interface ProductTableProps {
  initialProducts: Product[];
}

export default function ProductTable({ initialProducts }: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggleActive = async (id: string, current: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !current } : p))
    );
    await toggleProductActive(id, !current);
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
    );
    await toggleProductFeatured(id, !current);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await deleteProduct(id);
    setDeletingId(null);
  };

  return (
    <div className="border-2 border-ink bg-paper overflow-x-auto">
      <table className="w-full text-left font-mono text-xs">
        <thead className="bg-ink text-paper text-[10px] tracking-widest uppercase border-b border-ink">
          <tr>
            <th className="p-4">Code</th>
            <th className="p-4">Product Name</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4">Featured</th>
            <th className="p-4">Active</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/20">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-paper-warm transition-colors">
              <td className="p-4 font-bold text-grey">{p.product_code || "—"}</td>
              <td className="p-4 font-bold">{p.name}</td>
              <td className="p-4">Rs. {p.price.toLocaleString('en-US')}</td>
              <td className="p-4 uppercase">{p.stock_status.replace(/_/g, " ")}</td>
              <td className="p-4">
                <button
                  onClick={() => handleToggleFeatured(p.id, p.featured)}
                  className={`px-2 py-1 text-[10px] uppercase font-bold border border-ink ${
                    p.featured ? "bg-ink text-paper" : "bg-transparent text-grey"
                  }`}
                >
                  {p.featured ? "Featured" : "Normal"}
                </button>
              </td>
              <td className="p-4">
                <button
                  onClick={() => handleToggleActive(p.id, p.active)}
                  className={`px-2 py-1 text-[10px] uppercase font-bold border border-ink ${
                    p.active ? "bg-green-800 text-white" : "bg-red-800 text-white"
                  }`}
                >
                  {p.active ? "Active" : "Hidden"}
                </button>
              </td>
              <td className="p-4 text-right space-x-2">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="px-2 py-1 border border-ink hover:bg-ink hover:text-paper uppercase text-[10px]"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="px-2 py-1 border border-red-700 text-red-700 hover:bg-red-700 hover:text-white uppercase text-[10px]"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
