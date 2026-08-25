export default function Story() {
  return (
    <section className="py-24 px-6 md:px-12 border-b border-ink" id="story">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="story__left">
          <span className="section-tag">// 02</span>
          <h2 className="section-title mb-8">OUR STORY</h2>
          <div className="space-y-5 text-[#333]">
            <p>
              We started in a small garage in 2019 with a single workbench, a few hand tools, and an obsession with things that last.
            </p>
            <p>
              No algorithms. No assembly lines. Every piece passes through human hands from raw timber to finished object. We work with local mills, choose materials that age well, and refuse to rush.
            </p>
            <p>
              The marks you see — small tool lines, grain variation, the slight unevenness in a joint — these aren't flaws. They're proof.
            </p>
          </div>
          <div className="mt-9 pt-5 border-t border-ink">
            <div className="font-hand text-xl mb-1">— Marcus &amp; Elena</div>
            <div className="text-[10px] tracking-[0.2em] text-grey uppercase">Founders, Laura Fancy Store</div>
          </div>
        </div>

        <div className="relative story__right">
          <div className="grid grid-cols-2 gap-3 relative">
            <div className="border border-ink p-6 flex flex-col gap-2.5 bg-paper-warm hover:bg-ink hover:text-paper group transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-default">
              <div className="text-2xl">⚒</div>
              <div className="text-[11px] font-bold tracking-wider uppercase">Hand tools only</div>
            </div>
            <div className="border border-ink p-6 flex flex-col gap-2.5 bg-paper-warm hover:bg-ink hover:text-paper group transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-default">
              <div className="text-2xl">🌲</div>
              <div className="text-[11px] font-bold tracking-wider uppercase">Local timber</div>
            </div>
            <div className="border border-ink p-6 flex flex-col gap-2.5 bg-paper-warm hover:bg-ink hover:text-paper group transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-default">
              <div className="text-2xl">⏱</div>
              <div className="text-[11px] font-bold tracking-wider uppercase">Avg 40hrs / piece</div>
            </div>
            <div className="border border-ink p-6 flex flex-col gap-2.5 bg-paper-warm hover:bg-ink hover:text-paper group transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-default">
              <div className="text-2xl">🤝</div>
              <div className="text-[11px] font-bold tracking-wider uppercase">Small batch</div>
            </div>
            <div className="absolute -bottom-5 -right-2 font-display text-[120px] text-ink/[0.06] leading-none pointer-events-none select-none z-0">
              07
            </div>
          </div>
          <div className="text-right text-[10px] tracking-[0.2em] text-grey uppercase mt-2">
            years of craft
          </div>
        </div>
      </div>
    </section>
  );
}
