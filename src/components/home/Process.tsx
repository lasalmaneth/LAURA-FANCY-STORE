"use client";

import { ShoppingBag, ShieldCheck, Zap, Truck, ArrowRight, Sparkles } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: ShoppingBag,
    title: "BROWSE & SELECT",
    description: "Explore curated daily needs across top categories. Pick your items easily in seconds.",
    glowColor: "group-hover:shadow-[0_0_35px_rgba(245,158,11,0.2)]",
    iconBg: "group-hover:bg-amber-500/20 group-hover:border-amber-400/50 group-hover:text-amber-300",
    badgeText: "Curated Catalog",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "QUALITY CHECK",
    description: "Every item undergoes multi-point inspection to ensure perfection before packaging.",
    glowColor: "group-hover:shadow-[0_0_35px_rgba(16,185,129,0.2)]",
    iconBg: "group-hover:bg-emerald-500/20 group-hover:border-emerald-400/50 group-hover:text-emerald-300",
    badgeText: "100% Inspected",
  },
  {
    number: "03",
    icon: Zap,
    title: "EXPRESS DISPATCH",
    description: "Packed securely in protective packaging and dispatched rapidly within 24 hours.",
    glowColor: "group-hover:shadow-[0_0_35px_rgba(59,130,246,0.2)]",
    iconBg: "group-hover:bg-blue-500/20 group-hover:border-blue-400/50 group-hover:text-blue-300",
    badgeText: "< 24h Dispatch",
  },
  {
    number: "04",
    icon: Truck,
    title: "DOORSTEP DELIVERY",
    description: "Safe, reliable delivery right to your door with live tracking & dedicated customer support.",
    glowColor: "group-hover:shadow-[0_0_35px_rgba(168,85,247,0.2)]",
    iconBg: "group-hover:bg-purple-500/20 group-hover:border-purple-400/50 group-hover:text-purple-300",
    badgeText: "Live Tracking",
  },
];

export default function Process() {
  return (
    <section className="py-24 border-b border-ink bg-ink text-paper relative overflow-hidden" id="process">
      {/* Ambient background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-paper/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col items-start mb-16 px-6 md:px-12 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] tracking-[0.2em] text-paper/40">// 03</span>
          <Sparkles className="w-3.5 h-3.5 text-paper/40" />
        </div>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider leading-none text-paper">
          HOW WE SERVE YOU
        </h2>
        <div className="w-full h-[1px] bg-gradient-to-r from-paper/40 via-paper/10 to-transparent mt-5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-12 relative z-10">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className={`process-step group relative p-8 rounded-2xl border border-paper/10 bg-paper/[0.02] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-paper/[0.06] hover:border-paper/30 ${step.glowColor} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display text-5xl text-paper/20 group-hover:text-paper/50 transition-colors duration-300">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border border-paper/10 bg-paper/5 text-paper/60 group-hover:border-paper/30 group-hover:text-paper transition-all">
                    {step.badgeText}
                  </span>
                </div>

                <div className={`w-16 h-16 rounded-2xl border border-paper/15 bg-paper/5 flex items-center justify-center text-paper mb-6 transition-all duration-500 ${step.iconBg} group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className="w-8 h-8 stroke-[1.75] transition-transform duration-500 group-hover:scale-110" />
                </div>

                <h3 className="font-display text-2xl tracking-wider mb-3 text-paper group-hover:translate-x-1 transition-transform duration-300">
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed text-paper/60 group-hover:text-paper/80 transition-colors duration-300">
                  {step.description}
                </p>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <div className="w-6 h-6 rounded-full bg-ink border border-paper/20 flex items-center justify-center text-paper/30 group-hover:text-paper/70 group-hover:border-paper/50 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
