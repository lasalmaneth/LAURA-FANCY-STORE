export default function Features() {
  return (
    <section className="border-b border-ink">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="feature-item p-12 border-b lg:border-b-0 border-r border-ink hover:bg-ink hover:text-paper group transition-colors duration-200">
          <div className="font-display text-22 text-grey-light group-hover:text-paper mb-5">—</div>
          <h3 className="font-display text-lg tracking-wide mb-3 group-hover:text-paper">HONEST CRAFT</h3>
          <p className="text-xs leading-relaxed text-grey group-hover:text-paper/70">
            Each piece is unique. Small inconsistencies are a feature, not a bug. No two pieces are identical.
          </p>
        </div>

        <div className="feature-item p-12 border-b lg:border-b-0 border-r border-ink hover:bg-ink hover:text-paper group transition-colors duration-200">
          <div className="font-display text-22 text-grey-light group-hover:text-paper mb-5">—</div>
          <h3 className="font-display text-lg tracking-wide mb-3 group-hover:text-paper">SUSTAINABLE MATERIALS</h3>
          <p className="text-xs leading-relaxed text-grey group-hover:text-paper/70">
            Sourced locally, repurposed when possible. We document every board's origin.
          </p>
        </div>

        <div className="feature-item p-12 border-b sm:border-b-0 border-r border-ink hover:bg-ink hover:text-paper group transition-colors duration-200">
          <div className="font-display text-22 text-grey-light group-hover:text-paper mb-5">—</div>
          <h3 className="font-display text-lg tracking-wide mb-3 group-hover:text-paper">BUILT TO LAST</h3>
          <p className="text-xs leading-relaxed text-grey group-hover:text-paper/70">
            Heavy-duty construction built for life. 7-year warranty. Repair service available.
          </p>
        </div>

        <div className="feature-item p-12 hover:bg-ink hover:text-paper group transition-colors duration-200">
          <div className="font-display text-22 text-grey-light group-hover:text-paper mb-5">—</div>
          <h3 className="font-display text-lg tracking-wide mb-3 group-hover:text-paper">SMALL BATCH</h3>
          <p className="text-xs leading-relaxed text-grey group-hover:text-paper/70">
            Max 12 pieces per design per season. You won't see it everywhere. That's the point.
          </p>
        </div>
      </div>
    </section>
  );
}
