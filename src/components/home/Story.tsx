export default function Story() {
  return (
    <section className="py-24 px-6 md:px-12 border-b border-ink" id="story">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="story__left">
          <span className="section-tag">// 02</span>
          <h2 className="section-title mb-8">ABOUT LAURA FANCY STORE</h2>
          <div className="space-y-5 text-[#333]">
            <p>
              Laura Fancy Store is your ultimate online shopping destination, created to bring high-quality everyday essentials and customer needs right to your doorstep.
            </p>
            <p>
              We source directly from trusted manufacturers to cut out middleman markups. From daily household goods and personal accessories to smart lifestyle essentials, every product in our catalog is handpicked for quality, utility, and modern style.
            </p>
            <p>
              Our promise is simple: fair prices, transparent service, fast order dispatch, and 100% customer satisfaction on every order you make with us.
            </p>
          </div>
          <div className="mt-9 pt-5 border-t border-ink">
            <div className="font-hand text-xl mb-1">— Laura Fancy Store Team</div>
            <div className="text-[10px] tracking-[0.2em] text-grey uppercase">Your Trusted Everyday Shopping Partner</div>
          </div>
        </div>

        <div className="relative story__right">
          <div className="grid grid-cols-2 gap-3 relative">
            <div className="border border-ink p-6 flex flex-col gap-2.5 bg-paper-warm hover:bg-ink hover:text-paper group transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-default">
              <div className="text-2xl">🛍</div>
              <div className="text-[11px] font-bold tracking-wider uppercase">100% Authentic</div>
            </div>
            <div className="border border-ink p-6 flex flex-col gap-2.5 bg-paper-warm hover:bg-ink hover:text-paper group transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-default">
              <div className="text-2xl">⚡</div>
              <div className="text-[11px] font-bold tracking-wider uppercase">Express Shipping</div>
            </div>
            <div className="border border-ink p-6 flex flex-col gap-2.5 bg-paper-warm hover:bg-ink hover:text-paper group transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-default">
              <div className="text-2xl">🏷</div>
              <div className="text-[11px] font-bold tracking-wider uppercase">Best Daily Prices</div>
            </div>
            <div className="border border-ink p-6 flex flex-col gap-2.5 bg-paper-warm hover:bg-ink hover:text-paper group transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-default">
              <div className="text-2xl">😊</div>
              <div className="text-[11px] font-bold tracking-wider uppercase">Customer Support</div>
            </div>
            <div className="absolute -bottom-5 -right-2 font-display text-[120px] text-ink/[0.06] leading-none pointer-events-none select-none z-0">
              24/7
            </div>
          </div>
          <div className="text-right text-[10px] tracking-[0.2em] text-grey uppercase mt-2">
            Everyday Customer Store
          </div>
        </div>
      </div>
    </section>
  );
}
