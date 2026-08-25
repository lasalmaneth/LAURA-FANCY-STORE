import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[90vh] border-b border-ink">
      {/* Watermark logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <Image
          src="/assets/images/logo.png"
          alt=""
          width={420}
          height={420}
          className="w-[min(420px,60%)] h-auto opacity-[0.04] grayscale select-none"
        />
      </div>

      {/* Left Column */}
      <div className="relative z-10 p-8 md:p-18 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-ink">
        <div className="text-[10px] tracking-[0.25em] text-grey mb-6 uppercase">
          [ ONLINE SHOPPING STORE — DAILY ESSENTIALS ]
        </div>
        <h1 className="font-display text-6xl sm:text-7xl lg:text-[90px] tracking-[0.02em] leading-[0.95] mb-7 relative after:content-[''] after:block after:w-20 after:h-1 after:bg-ink after:mt-5">
          <span className="block">EVERYDAY</span>
          <span className="block pl-6">NEEDS.</span>
          <span className="block">DELIVERED</span>
          <span className="block pl-6">TO YOU.</span>
        </h1>
        <p className="text-xs sm:text-sm leading-relaxed text-[#333] mb-9 max-w-[420px]">
          Discover top-quality daily essentials, lifestyle products & trending goods.<br />
          Curated for your everyday life with fast, reliable home delivery.
        </p>
        <div className="flex flex-wrap gap-4 items-center mb-12">
          <Link href="/products" className="btn btn--primary">
            Shop Catalog Now
          </Link>
          <Link href="/#story" className="btn btn--ghost">
            About Our Store →
          </Link>
        </div>
        <div className="flex items-center border border-ink overflow-hidden w-fit">
          <div className="px-6 py-4 text-center hover:bg-ink hover:text-paper group transition-colors">
            <span className="block font-display text-2xl leading-none group-hover:text-paper">10k+</span>
            <span className="block text-[9px] tracking-[0.2em] text-grey uppercase mt-1 group-hover:text-paper">Orders Delivered</span>
          </div>
          <div className="w-[1px] bg-ink self-stretch" />
          <div className="px-6 py-4 text-center hover:bg-ink hover:text-paper group transition-colors">
            <span className="block font-display text-2xl leading-none group-hover:text-paper">100%</span>
            <span className="block text-[9px] tracking-[0.2em] text-grey uppercase mt-1 group-hover:text-paper">Quality Checked</span>
          </div>
          <div className="w-[1px] bg-ink self-stretch" />
          <div className="px-6 py-4 text-center hover:bg-ink hover:text-paper group transition-colors">
            <span className="block font-display text-2xl leading-none group-hover:text-paper">24/7</span>
            <span className="block text-[9px] tracking-[0.2em] text-grey uppercase mt-1 group-hover:text-paper">Order Support</span>
          </div>
        </div>
      </div>

      {/* Right Column — Shopping Experience Feature Card */}
      <div className="relative z-10 bg-paper-warm flex items-center justify-center p-8 sm:p-14 overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(0deg,transparent,transparent_28px,rgba(0,0,0,0.04)_28px,rgba(0,0,0,0.04)_29px)]">
        <div className="relative w-full max-w-[380px] border-2 border-ink bg-paper p-6 sm:p-8 flex flex-col gap-5 shadow-[6px_6px_0px_0px_#111]">
          <div className="flex items-center justify-between border-b border-ink/10 pb-4">
            <span className="font-mono text-[10px] tracking-widest text-grey uppercase">DAILY FEATURED DEALS</span>
            <span className="bg-ink text-paper text-[9px] px-2 py-0.5 font-mono uppercase">In Stock</span>
          </div>
          
          <div className="w-full aspect-[4/3] bg-paper-warm border border-ink flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32 animate-float">
              {/* Shopping Bag & Package Illustration */}
              <rect x="45" y="50" width="110" height="90" rx="4" stroke="#111" strokeWidth="2.5" fill="#fcfbfa" />
              <path d="M75 50 C75 25, 125 25, 125 50" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="100" cy="95" r="18" fill="#111" />
              <path d="M93 95 L98 100 L108 90" stroke="#fcfbfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="60" y1="120" x2="140" y2="120" stroke="#111" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
            <div className="absolute top-2 right-2 font-mono text-[9px] bg-ink/10 px-2 py-0.5 uppercase">Express Dispatch</div>
          </div>

          <div className="space-y-1.5">
            <div className="font-mono text-xs text-grey uppercase tracking-wider">Laura Fancy Store</div>
            <div className="font-display text-2xl tracking-wide">EVERYDAY CUSTOMER ESSENTIALS</div>
            <p className="text-xs text-[#444] leading-relaxed">
              Curated daily items engineered for convenience, durability, and unbeatable everyday value.
            </p>
          </div>

          <div className="pt-3 border-t border-ink/10 flex items-center justify-between">
            <span className="font-mono text-xs text-grey uppercase">Best Price Guaranteed</span>
            <span className="font-display text-xl">100% Authentic</span>
          </div>
        </div>
      </div>
    </section>
  );
}
