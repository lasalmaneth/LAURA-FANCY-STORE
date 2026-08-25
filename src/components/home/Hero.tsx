import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-20 px-6 sm:px-12 md:py-28 min-h-[85vh] border-b border-ink overflow-hidden bg-paper">
      {/* Centered Watermark Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <Image
          src="/assets/images/logo.png"
          alt=""
          width={520}
          height={520}
          className="w-[min(520px,80%)] h-auto opacity-[0.12] grayscale select-none object-contain"
          priority
        />
      </div>

      {/* Main Centered Content */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center">
        <div className="text-[10px] tracking-[0.25em] text-grey mb-6 uppercase">
          [ ONLINE SHOPPING STORE — DAILY ESSENTIALS ]
        </div>

        <h1 className="font-display text-5xl sm:text-7xl lg:text-[96px] tracking-[0.02em] leading-[0.95] mb-7 relative after:content-[''] after:block after:w-24 after:h-1 after:bg-ink after:mt-6 after:mx-auto">
          <span className="block">EVERYDAY NEEDS.</span>
          <span className="block">DELIVERED TO YOU.</span>
        </h1>

        <p className="text-xs sm:text-base leading-relaxed text-[#333] mb-9 max-w-lg mx-auto">
          Discover top-quality daily essentials, lifestyle products & trending goods.<br />
          Curated for your everyday life with fast, reliable home delivery.
        </p>

        <div className="flex flex-wrap gap-4 items-center justify-center mb-12">
          <Link href="/products" className="btn btn--primary">
            Shop Catalog Now
          </Link>
          <Link href="/#story" className="btn btn--ghost">
            About Our Store →
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center border border-ink overflow-hidden mx-auto bg-paper/80 backdrop-blur-sm">
          <div className="px-6 sm:px-8 py-4 text-center hover:bg-ink hover:text-paper group transition-colors">
            <span className="block font-display text-2xl sm:text-3xl leading-none group-hover:text-paper">10k+</span>
            <span className="block text-[9px] tracking-[0.2em] text-grey uppercase mt-1 group-hover:text-paper">Orders Delivered</span>
          </div>
          <div className="w-[1px] bg-ink self-stretch hidden sm:block" />
          <div className="px-6 sm:px-8 py-4 text-center hover:bg-ink hover:text-paper group transition-colors">
            <span className="block font-display text-2xl sm:text-3xl leading-none group-hover:text-paper">100%</span>
            <span className="block text-[9px] tracking-[0.2em] text-grey uppercase mt-1 group-hover:text-paper">Quality Checked</span>
          </div>
          <div className="w-[1px] bg-ink self-stretch hidden sm:block" />
          <div className="px-6 sm:px-8 py-4 text-center hover:bg-ink hover:text-paper group transition-colors">
            <span className="block font-display text-2xl sm:text-3xl leading-none group-hover:text-paper">24/7</span>
            <span className="block text-[9px] tracking-[0.2em] text-grey uppercase mt-1 group-hover:text-paper">Order Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
