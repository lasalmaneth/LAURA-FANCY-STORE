export default function Process() {
  return (
    <section className="py-24 border-b border-ink bg-ink text-paper" id="process">
      <div className="flex flex-col items-start mb-12 px-6 md:px-12">
        <span className="font-mono text-[10px] tracking-[0.2em] text-paper/40 mb-2">// 03</span>
        <h2 className="font-display text-4xl sm:text-5xl tracking-wider leading-none text-paper">THE PROCESS</h2>
        <div className="w-full h-[2px] bg-paper/20 mt-4" />
      </div>

      <div className="flex flex-col lg:flex-row items-stretch px-6 md:px-12 overflow-x-auto">
        <div className="process-step flex-1 p-10 border-t border-paper/15 min-w-[200px] hover:bg-paper/5 transition-colors">
          <div className="font-display text-6xl text-paper/10 leading-none mb-3">01</div>
          <div className="text-3xl mb-4">🪵</div>
          <h3 className="font-display text-2xl tracking-wider mb-3">SOURCE</h3>
          <p className="text-xs leading-relaxed text-paper/60">
            We visit local mills. Touch the timber. Choose by feel and grain. No compromises on material.
          </p>
        </div>

        <div className="hidden lg:flex font-display text-2xl text-paper/20 self-center px-2 shrink-0">
          →
        </div>

        <div className="process-step flex-1 p-10 border-t border-paper/15 min-w-[200px] hover:bg-paper/5 transition-colors">
          <div className="font-display text-6xl text-paper/10 leading-none mb-3">02</div>
          <div className="text-3xl mb-4">📐</div>
          <h3 className="font-display text-2xl tracking-wider mb-3">SKETCH</h3>
          <p className="text-xs leading-relaxed text-paper/60">
            Paper and pencil. Every design begins by hand. No CAD, no renderings — just honest drawings.
          </p>
        </div>

        <div className="hidden lg:flex font-display text-2xl text-paper/20 self-center px-2 shrink-0">
          →
        </div>

        <div className="process-step flex-1 p-10 border-t border-paper/15 min-w-[200px] hover:bg-paper/5 transition-colors">
          <div className="font-display text-6xl text-paper/10 leading-none mb-3">03</div>
          <div className="text-3xl mb-4">🔨</div>
          <h3 className="font-display text-2xl tracking-wider mb-3">BUILD</h3>
          <p className="text-xs leading-relaxed text-paper/60">
            Chisels, planes, saws. Traditional joinery. Each piece is fitted, not fastened. No nails in our furniture.
          </p>
        </div>

        <div className="hidden lg:flex font-display text-2xl text-paper/20 self-center px-2 shrink-0">
          →
        </div>

        <div className="process-step flex-1 p-10 border-t border-paper/15 min-w-[200px] hover:bg-paper/5 transition-colors">
          <div className="font-display text-6xl text-paper/10 leading-none mb-3">04</div>
          <div className="text-3xl mb-4">✦</div>
          <h3 className="font-display text-2xl tracking-wider mb-3">FINISH</h3>
          <p className="text-xs leading-relaxed text-paper/60">
            Hand-sanded through 5 grits. Oiled and waxed. Signed. Shipped with care in recycled packaging.
          </p>
        </div>
      </div>
    </section>
  );
}
