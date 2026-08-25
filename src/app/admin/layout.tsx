import Link from "next/link";
import { logout } from "@/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-24 min-h-screen flex flex-col md:flex-row bg-paper-warm">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-ink bg-paper p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="mb-8 pb-4 border-b border-ink">
            <span className="font-mono text-[9px] tracking-[0.25em] text-grey uppercase block">
              MANAGEMENT CONSOLE
            </span>
            <h2 className="font-display text-2xl tracking-wide">STORE ADMIN</h2>
          </div>

          <nav className="flex flex-col gap-2 font-mono text-xs font-bold uppercase tracking-wider">
            <Link
              href="/admin"
              className="p-3 border border-ink bg-paper hover:bg-ink hover:text-paper transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="p-3 border border-ink bg-paper hover:bg-ink hover:text-paper transition-colors"
            >
              Products Catalog
            </Link>
            <Link
              href="/admin/categories"
              className="p-3 border border-ink bg-paper hover:bg-ink hover:text-paper transition-colors"
            >
              Categories
            </Link>
          </nav>
        </div>

        <div className="mt-12 pt-4 border-t border-ink">
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-left font-mono text-xs font-bold tracking-widest text-red-700 hover:underline py-2 uppercase"
            >
              ← Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
