export default function Features() {
  return (
    <section className="border-b border-ink">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="feature-item p-12 border-b lg:border-b-0 border-r border-ink hover:bg-ink hover:text-paper group transition-colors duration-200">
          <div className="font-display text-22 text-grey-light group-hover:text-paper mb-5">—</div>
          <h3 className="font-display text-lg tracking-wide mb-3 group-hover:text-paper">EVERYDAY VALUE</h3>
          <p className="text-xs leading-relaxed text-grey group-hover:text-paper/70">
            Top-rated customer products priced fairly without inflated retail markups or hidden fees.
          </p>
        </div>

        <div className="feature-item p-12 border-b lg:border-b-0 border-r border-ink hover:bg-ink hover:text-paper group transition-colors duration-200">
          <div className="font-display text-22 text-grey-light group-hover:text-paper mb-5">—</div>
          <h3 className="font-display text-lg tracking-wide mb-3 group-hover:text-paper">FAST DELIVERY</h3>
          <p className="text-xs leading-relaxed text-grey group-hover:text-paper/70">
            Quick order processing with safe doorstep delivery to fulfill your everyday needs promptly.
          </p>
        </div>

        <div className="feature-item p-12 border-b sm:border-b-0 border-r border-ink hover:bg-ink hover:text-paper group transition-colors duration-200">
          <div className="font-display text-22 text-grey-light group-hover:text-paper mb-5">—</div>
          <h3 className="font-display text-lg tracking-wide mb-3 group-hover:text-paper">QUALITY GUARANTEED</h3>
          <p className="text-xs leading-relaxed text-grey group-hover:text-paper/70">
            Every product is tested and verified for quality, safety, and long-lasting customer utility.
          </p>
        </div>

        <div className="feature-item p-12 hover:bg-ink hover:text-paper group transition-colors duration-200">
          <div className="font-display text-22 text-grey-light group-hover:text-paper mb-5">—</div>
          <h3 className="font-display text-lg tracking-wide mb-3 group-hover:text-paper">24/7 SUPPORT</h3>
          <p className="text-xs leading-relaxed text-grey group-hover:text-paper/70">
            Dedicated customer care team ready to assist with order inquiries, tracking, and advice.
          </p>
        </div>
      </div>
    </section>
  );
}
