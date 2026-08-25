"use client";

import { useState } from "react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    }, 800);
  };

  return (
    <section className="py-24 px-6 md:px-12 border-b border-ink" id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="contact__left">
          <span className="section-tag">// 04</span>
          <h2 className="font-display text-4xl sm:text-6xl tracking-wider mb-5">GET IN TOUCH</h2>
          <p className="text-[#444] mb-10 max-w-[360px] text-xs sm:text-sm">
            Have a piece in mind? Want to visit the workshop? Commission a custom order? We'd love to hear from you.
          </p>
          <div className="flex flex-col border-t border-ink">
            <div className="flex items-baseline gap-5 py-4 border-b border-ink">
              <span className="text-[9px] tracking-[0.25em] text-grey min-w-[110px]">EMAIL</span>
              <span className="text-xs sm:text-sm">hello@laurafancystore.com</span>
            </div>
            <div className="flex items-baseline gap-5 py-4 border-b border-ink">
              <span className="text-[9px] tracking-[0.25em] text-grey min-w-[110px]">LOCATION</span>
              <span className="text-xs sm:text-sm">Portland, Oregon</span>
            </div>
            <div className="flex items-baseline gap-5 py-4 border-b border-ink">
              <span className="text-[9px] tracking-[0.25em] text-grey min-w-[110px]">STUDIO VISITS</span>
              <span className="text-xs sm:text-sm">By appointment</span>
            </div>
          </div>
        </div>

        <div className="contact__right">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5 mb-5">
              <label htmlFor="name" className="text-[9px] tracking-[0.25em] text-grey">
                NAME
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                required
                className="font-mono text-xs text-ink bg-transparent border-b border-ink py-2.5 outline-none focus:border-b-2 transition-all placeholder:text-grey-light"
              />
            </div>
            <div className="flex flex-col gap-1.5 mb-5">
              <label htmlFor="email" className="text-[9px] tracking-[0.25em] text-grey">
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                required
                className="font-mono text-xs text-ink bg-transparent border-b border-ink py-2.5 outline-none focus:border-b-2 transition-all placeholder:text-grey-light"
              />
            </div>
            <div className="flex flex-col gap-1.5 mb-5">
              <label htmlFor="interest" className="text-[9px] tracking-[0.25em] text-grey">
                INTEREST
              </label>
              <select
                id="interest"
                name="interest"
                className="font-mono text-xs text-ink bg-transparent border-b border-ink py-2.5 outline-none focus:border-b-2 transition-all appearance-none cursor-pointer"
              >
                <option value="">— Select —</option>
                <option value="chair">Oak Side Chair</option>
                <option value="table">Dining Table</option>
                <option value="shelf">Wall Shelf Unit</option>
                <option value="custom">Custom Commission</option>
                <option value="visit">Studio Visit</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 mb-5">
              <label htmlFor="message" className="text-[9px] tracking-[0.25em] text-grey">
                MESSAGE
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Tell us about your project..."
                className="font-mono text-xs text-ink bg-transparent border-b border-ink py-2.5 outline-none focus:border-b-2 transition-all placeholder:text-grey-light resize-y"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn--primary btn--full mt-2">
              {loading ? "Sending..." : "Send Message"}
            </button>

            {submitted && (
              <div className="mt-4 text-xs tracking-wider p-4 border border-ink bg-paper-warm animate-fadeIn">
                ✦ Message received. We'll be in touch within 2 business days.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
