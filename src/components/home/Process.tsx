"use client";

import { ArrowRight, Sparkles } from "lucide-react";

// Card 01 Custom Icon Component: Browse & Select
function BrowseSelectIcon() {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      {/* Shopping bag outline (smoothly scales & fades out on hover) */}
      <svg
        className="w-8 h-8 absolute inset-0 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-0 group-hover:scale-75 group-hover:-translate-y-1 text-paper"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>

      {/* Active Ticking / Checkbox Selection Indicator with Animated Checkmark */}
      <div className="w-8 h-8 absolute inset-0 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]">
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            className="stroke-amber-400 fill-amber-400/10 transition-colors duration-300"
          />
          <path
            d="M8 12.5l2.5 2.5 5.5-5.5"
            className="stroke-amber-300 stroke-[2.5] [stroke-dasharray:20] [stroke-dashoffset:20] group-hover:[stroke-dashoffset:0] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] delay-100"
          />
        </svg>
      </div>
    </div>
  );
}

// Card 02 Custom Icon Component: Quality Check
function QualityCheckIcon() {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden rounded-lg">
      {/* Base Shield Icon */}
      <svg
        className="w-8 h-8 transition-colors duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] text-paper group-hover:text-emerald-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" className="stroke-[2] group-hover:stroke-emerald-300 transition-colors" />
      </svg>

      {/* Laser Lens Sweep Beam Line */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] -translate-y-4 group-hover:translate-y-9 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]" />
      </div>

      {/* Scanning Magnifying Hand-Glass */}
      <div className="absolute -inset-1 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          className="w-5 h-5 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)] -translate-x-7 -translate-y-1 group-hover:translate-x-7 group-hover:translate-y-1 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="6" className="fill-emerald-400/20 stroke-emerald-300" />
          <line x1="15.5" y1="15.5" x2="21" y2="21" />
        </svg>
      </div>
    </div>
  );
}

// Card 03 Custom Icon Component: Express Dispatch
function ExpressDispatchIcon() {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <svg
        className="w-8 h-8 transition-colors duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] text-paper group-hover:text-blue-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Parcel Box Base */}
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />

        {/* Folded Top Flaps */}
        <path
          d="M12 12L4 7.5L12 3l8 4.5z"
          className="fill-blue-500/0 group-hover:fill-blue-400/25 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
        />

        {/* Gliding Protective Tape across box */}
        <line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          className="stroke-cyan-300 stroke-[3] opacity-0 [stroke-dasharray:20] [stroke-dashoffset:20] group-hover:opacity-100 group-hover:[stroke-dashoffset:0] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        />
        {/* Protective Tape Seal Badge */}
        <rect
          x="9.5"
          y="10"
          width="5"
          height="4"
          rx="1"
          className="fill-cyan-400 stroke-cyan-200 stroke-[0.5] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"
        />
      </svg>
    </div>
  );
}

// Card 04 Custom Icon Component: Doorstep Delivery
function DoorstepDeliveryIcon() {
  return (
    <div className="relative w-9 h-8 flex items-center justify-center">
      {/* Speed Lines trailing behind truck */}
      <svg
        className="w-4 h-5 absolute left-[-4px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        viewBox="0 0 16 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1="1" y1="4" x2="11" y2="4" className="stroke-purple-300/70" />
        <line x1="4" y1="10" x2="15" y2="10" className="stroke-purple-400" />
        <line x1="2" y1="16" x2="10" y2="16" className="stroke-purple-300/70" />
      </svg>

      {/* Truck Container with Forward Glide */}
      <div className="w-8 h-8 transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1.5">
        <svg
          className="w-8 h-8 text-paper group-hover:text-purple-300 transition-colors duration-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Truck Body */}
          <path d="M1 3h15v13H1z" />
          <path d="M16 8h4l3 3v5h-7V8z" />

          {/* Rotating Rear Tire with Spokes */}
          <g className="origin-[5.5px_18.5px] group-hover:animate-[spin_0.6s_linear_infinite]">
            <circle cx="5.5" cy="18.5" r="2.5" className="fill-ink stroke-purple-300 stroke-[1.5]" />
            <line x1="5.5" y1="16.5" x2="5.5" y2="20.5" className="stroke-purple-300 stroke-[1]" />
            <line x1="3.5" y1="18.5" x2="7.5" y2="18.5" className="stroke-purple-300 stroke-[1]" />
          </g>

          {/* Rotating Front Tire with Spokes */}
          <g className="origin-[18.5px_18.5px] group-hover:animate-[spin_0.6s_linear_infinite]">
            <circle cx="18.5" cy="18.5" r="2.5" className="fill-ink stroke-purple-300 stroke-[1.5]" />
            <line x1="18.5" y1="16.5" x2="18.5" y2="20.5" className="stroke-purple-300 stroke-[1]" />
            <line x1="16.5" y1="18.5" x2="20.5" y2="18.5" className="stroke-purple-300 stroke-[1]" />
          </g>
        </svg>
      </div>
    </div>
  );
}

const STEPS = [
  {
    number: "01",
    IconComponent: BrowseSelectIcon,
    title: "BROWSE & SELECT",
    description: "Explore curated daily needs across top categories. Pick your items easily in seconds.",
    glowColor: "group-hover:border-amber-400/40 group-hover:shadow-[0_0_35px_rgba(245,158,11,0.22)]",
    iconBg: "group-hover:bg-amber-500/20 group-hover:border-amber-400/50",
    badgeText: "Curated Catalog",
  },
  {
    number: "02",
    IconComponent: QualityCheckIcon,
    title: "QUALITY CHECK",
    description: "Every item undergoes multi-point inspection to ensure perfection before packaging.",
    glowColor: "group-hover:border-emerald-400/40 group-hover:shadow-[0_0_35px_rgba(16,185,129,0.22)]",
    iconBg: "group-hover:bg-emerald-500/20 group-hover:border-emerald-400/50",
    badgeText: "100% Inspected",
  },
  {
    number: "03",
    IconComponent: ExpressDispatchIcon,
    title: "EXPRESS DISPATCH",
    description: "Packed securely in protective packaging and dispatched rapidly within 24 hours.",
    glowColor: "group-hover:border-blue-400/40 group-hover:shadow-[0_0_35px_rgba(59,130,246,0.22)]",
    iconBg: "group-hover:bg-blue-500/20 group-hover:border-blue-400/50",
    badgeText: "< 24h Dispatch",
  },
  {
    number: "04",
    IconComponent: DoorstepDeliveryIcon,
    title: "DOORSTEP DELIVERY",
    description: "Safe, reliable delivery right to your door with live tracking & dedicated customer support.",
    glowColor: "group-hover:border-purple-400/40 group-hover:shadow-[0_0_35px_rgba(168,85,247,0.22)]",
    iconBg: "group-hover:bg-purple-500/20 group-hover:border-purple-400/50",
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
          const IconComponent = step.IconComponent;
          return (
            <div
              key={step.number}
              className={`process-step group relative p-8 rounded-2xl border border-paper/10 bg-paper/[0.02] backdrop-blur-sm transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2 hover:bg-paper/[0.08] ${step.glowColor} flex flex-col justify-between`}
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

                <div className={`w-16 h-16 rounded-2xl border border-paper/15 bg-paper/5 flex items-center justify-center text-paper mb-6 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${step.iconBg} group-hover:scale-110 group-hover:rotate-1`}>
                  <IconComponent />
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
