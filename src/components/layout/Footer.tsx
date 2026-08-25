import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper px-6 md:px-12 pt-12 pb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-paper/10 pb-8 mb-6 gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/images/logo.png"
            alt="Laura Fancy Store"
            width={160}
            height={64}
            className="h-16 w-auto object-contain filter invert mix-blend-screen opacity-90"
          />
        </div>
        <div className="flex flex-wrap gap-7">
          <Link
            href="/products"
            className="text-paper/50 hover:text-paper text-[10px] tracking-[0.2em] uppercase transition-colors"
          >
            Catalog
          </Link>
          <Link
            href="/#story"
            className="text-paper/50 hover:text-paper text-[10px] tracking-[0.2em] uppercase transition-colors"
          >
            Story
          </Link>
          <Link
            href="/#process"
            className="text-paper/50 hover:text-paper text-[10px] tracking-[0.2em] uppercase transition-colors"
          >
            Process
          </Link>
          <Link
            href="/#contact"
            className="text-paper/50 hover:text-paper text-[10px] tracking-[0.2em] uppercase transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/admin"
            className="text-paper/50 hover:text-paper text-[10px] tracking-[0.2em] uppercase transition-colors"
          >
            Admin Portal
          </Link>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] tracking-wider text-paper/30 gap-2">
        <span>©2026 Laura Fancy Store — All Rights Reserved.</span>
        <span className="font-hand text-sm italic">Made with love.</span>
      </div>
    </footer>
  );
}
