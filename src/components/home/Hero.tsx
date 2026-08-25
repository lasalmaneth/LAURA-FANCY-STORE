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
        <div className="text-[10px] tracking-[0.25em] text-grey mb-6">
          [ NEW COLLECTION — 2026 ]
        </div>
        <h1 className="font-display text-6xl sm:text-7xl lg:text-[100px] tracking-[0.02em] leading-[0.95] mb-7 relative after:content-[''] after:block after:w-20 after:h-1 after:bg-ink after:mt-5">
          <span className="block">HAND</span>
          <span className="block pl-6">CRAFTED.</span>
          <span className="block">BUILT</span>
          <span className="block pl-6">FOR USE.</span>
        </h1>
        <p className="text-xs sm:text-sm leading-relaxed text-[#333] mb-9 max-w-[380px]">
          Simple objects. Honest materials.<br />
          Made by hand. No excess. Only function.
        </p>
        <div className="flex flex-wrap gap-4 items-center mb-12">
          <Link href="/products" className="btn btn--primary">
            Explore Collection
          </Link>
          <Link href="/#story" className="btn btn--ghost">
            Our Story →
          </Link>
        </div>
        <div className="flex items-center border border-ink overflow-hidden w-fit">
          <div className="px-6 py-4 text-center hover:bg-ink hover:text-paper group transition-colors">
            <span className="block font-display text-2xl leading-none group-hover:text-paper">247</span>
            <span className="block text-[9px] tracking-[0.2em] text-grey uppercase mt-1 group-hover:text-paper">Pieces Made</span>
          </div>
          <div className="w-[1px] bg-ink self-stretch" />
          <div className="px-6 py-4 text-center hover:bg-ink hover:text-paper group transition-colors">
            <span className="block font-display text-2xl leading-none group-hover:text-paper">100%</span>
            <span className="block text-[9px] tracking-[0.2em] text-grey uppercase mt-1 group-hover:text-paper">By Hand</span>
          </div>
          <div className="w-[1px] bg-ink self-stretch" />
          <div className="px-6 py-4 text-center hover:bg-ink hover:text-paper group transition-colors">
            <span className="block font-display text-2xl leading-none group-hover:text-paper">7yr</span>
            <span className="block text-[9px] tracking-[0.2em] text-grey uppercase mt-1 group-hover:text-paper">Warranty</span>
          </div>
        </div>
      </div>

      {/* Right Column — Technical SVG Sketch Panel */}
      <div className="relative z-10 bg-paper-warm flex items-center justify-center p-8 sm:p-14 overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(0deg,transparent,transparent_28px,rgba(0,0,0,0.04)_28px,rgba(0,0,0,0.04)_29px)]">
        <div className="relative w-full max-w-[360px] aspect-[1/1.1] border-2 border-ink bg-paper/50">
          <div className="absolute top-2.5 left-3 font-hand text-xs text-grey pointer-events-none">solid oak</div>
          <div className="absolute top-2.5 right-3 font-hand text-xs text-grey pointer-events-none">↗ visible grain</div>
          <div className="w-full h-full flex items-center justify-center p-10">
            <svg viewBox="0 0 400 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[280px] animate-float" aria-hidden="true">
              <g stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="120" y1="200" x2="105" y2="360" />
                <line x1="280" y1="200" x2="295" y2="360" />
                <line x1="130" y1="250" x2="118" y2="390" />
                <line x1="270" y1="250" x2="282" y2="390" />
                <path d="M110 240 Q200 220 290 240 Q285 260 200 265 Q115 260 110 240Z" />
                <path d="M118 200 Q200 180 282 200 L280 200 Q200 188 120 200Z" />
                <line x1="120" y1="200" x2="115" y2="240" />
                <line x1="280" y1="200" x2="285" y2="240" />
                <path d="M120 210 Q200 195 280 210" />
                <path d="M119 225 Q200 210 281 225" />
                <path d="M130 248 Q200 235 270 248" strokeWidth="1" strokeDasharray="4 3" />
                <path d="M128 254 Q200 242 272 254" strokeWidth="1" strokeDasharray="4 3" />
                <line x1="115" y1="300" x2="290" y2="310" strokeWidth="1.5" />
                <line x1="55" y1="250" x2="108" y2="252" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="345" y1="248" x2="292" y2="252" strokeWidth="1" strokeDasharray="3 3" />
              </g>
              <circle cx="52" cy="250" r="3" fill="#111" />
              <circle cx="348" cy="248" r="3" fill="#111" />
              <line x1="105" y1="380" x2="285" y2="395" stroke="#111" strokeWidth="1" strokeDasharray="2 2" />
              <text x="180" y="415" fontFamily="'Space Mono', monospace" fontSize="10" fill="#111">W: 62cm</text>
              <text x="30" y="200" fontFamily="'Space Mono', monospace" fontSize="10" fill="#111" transform="rotate(-90 30 290)">H: 88cm</text>
            </svg>
          </div>
          <div className="absolute bottom-2.5 right-3 font-hand text-xs text-grey pointer-events-none">hand-finished</div>
          <div className="absolute bottom-2.5 left-3 font-hand text-xs text-grey italic">← draft 03</div>
        </div>
      </div>
    </section>
  );
}
