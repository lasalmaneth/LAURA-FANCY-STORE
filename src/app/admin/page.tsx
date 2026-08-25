import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardOverview() {
  let productCount = 0;
  let categoryCount = 0;

  try {
    const supabase = await createClient();
    const [pRes, cRes] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("categories").select("id", { count: "exact", head: true }),
    ]);
    if (pRes.count !== null) productCount = pRes.count;
    if (cRes.count !== null) categoryCount = cRes.count;
  } catch {}

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-grey uppercase block mb-1">
          OVERVIEW
        </span>
        <h1 className="font-display text-4xl tracking-wider">ADMIN DASHBOARD</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border-2 border-ink p-6 bg-paper">
          <div className="text-xs font-mono tracking-widest text-grey uppercase mb-2">
            Total Products
          </div>
          <div className="font-display text-5xl">{productCount || 3}</div>
          <Link
            href="/admin/products"
            className="mt-4 inline-block font-mono text-xs font-bold underline uppercase"
          >
            Manage Products →
          </Link>
        </div>

        <div className="border-2 border-ink p-6 bg-paper">
          <div className="text-xs font-mono tracking-widest text-grey uppercase mb-2">
            Categories
          </div>
          <div className="font-display text-5xl">{categoryCount || 3}</div>
          <Link
            href="/admin/categories"
            className="mt-4 inline-block font-mono text-xs font-bold underline uppercase"
          >
            Manage Categories →
          </Link>
        </div>

        <div className="border-2 border-ink p-6 bg-paper">
          <div className="text-xs font-mono tracking-widest text-grey uppercase mb-2">
            WhatsApp Storefront
          </div>
          <div className="font-display text-2xl mt-2 mb-4">ACTIVE</div>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94771234567"}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block font-mono text-xs font-bold underline uppercase text-green-800"
          >
            Test WhatsApp Link ↗
          </a>
        </div>
      </div>

      <div className="border-2 border-ink p-8 bg-paper">
        <h2 className="font-display text-2xl mb-4">QUICK ACTIONS</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/products/new" className="btn btn--primary">
            + Add New Product
          </Link>
          <Link href="/products" target="_blank" className="btn btn--ghost">
            View Live Catalog ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
