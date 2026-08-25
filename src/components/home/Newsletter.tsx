"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setEmail("");
    }, 800);
  };

  return (
    <section className="bg-paper-warm border-b border-ink py-20 px-6 md:px-12 text-center">
      <div className="max-w-[560px] mx-auto newsletter__inner">
        <h2 className="font-display text-4xl sm:text-6xl tracking-wide mb-3">JOIN THE LIST</h2>
        <p className="text-grey mb-9 text-xs sm:text-sm">
          Be first to know about new pieces, limited runs, and workshop events.
        </p>

        <form onSubmit={handleSubmit} className="flex border border-ink overflow-hidden max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 font-mono text-xs border-none px-5 py-4 bg-paper outline-none text-ink placeholder:text-grey-light"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn--primary !border-none !border-l !border-ink !rounded-none shrink-0"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {submitted && (
          <div className="mt-4 text-xs tracking-widest text-grey animate-fadeIn">
            ✦ You're on the list. Thank you.
          </div>
        )}
      </div>
    </section>
  );
}
