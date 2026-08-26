export default function Story() {
  return (
    <section className="py-24 px-6 md:px-12 border-b border-ink relative overflow-hidden bg-paper" id="story">
      {/* Background Logo Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-5 sm:opacity-[0.08] z-0">
        <img
          src="/assets/images/logo.png"
          alt=""
          className="w-[320px] sm:w-[480px] md:w-[620px] h-auto filter grayscale"
        />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <span className="section-tag inline-block mb-2">// 02</span>
        <h2 className="section-title mb-10 text-center">ABOUT LAURA FANCY STORE</h2>
        
        <div className="text-base sm:text-xl md:text-2xl leading-relaxed text-[#222] font-serif italic space-y-6">
          <p>
            &ldquo;Laura Fancy Store is your ultimate online shopping destination, created to bring high-quality everyday essentials and customer needs right to your doorstep.
          </p>
          <p>
            We source directly from trusted manufacturers to cut out middleman markups. From daily household goods and personal accessories to smart lifestyle essentials, every product in our catalog is handpicked for quality, utility, and modern style.
          </p>
          <p>
            Our promise is simple: fair prices, transparent service, fast order dispatch, and 100% customer satisfaction on every order you make with us.&rdquo;
          </p>
        </div>

        <div className="mt-12 pt-6 border-t border-ink/20 inline-block text-center">
          <div className="font-hand text-2xl mb-1">— Laura Fancy Store Team</div>
          <div className="text-[10px] tracking-[0.2em] text-grey uppercase">Your Trusted Everyday Shopping Partner</div>
        </div>
      </div>
    </section>
  );
}
