"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "@/actions/auth";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setSuccess(result.success);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6 bg-paper-warm">
      <div className="w-full max-w-md bg-paper border-2 border-ink p-8 shadow-[8px_8px_0px_0px_#111]">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] tracking-[0.25em] text-grey uppercase block mb-1">
            NEW CUSTOMER
          </span>
          <h1 className="font-display text-4xl tracking-wider uppercase">CREATE ACCOUNT</h1>
          <p className="text-xs text-[#555] mt-2">
            Join Laura Fancy Store to manage your purchases and fast checkout.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-600 bg-red-50 text-red-700 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 border border-emerald-600 bg-emerald-50 text-emerald-800 text-xs font-mono flex flex-col gap-2">
            <span>✅ {success}</span>
            <Link href="/login" className="underline font-bold hover:text-emerald-900">
              Proceed to Sign In →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.2em] font-bold uppercase text-grey">
              FIRST NAME
            </label>
            <input
              type="text"
              name="firstName"
              required
              placeholder="Your first name"
              className="font-mono text-xs p-3 border border-ink bg-transparent outline-none focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.2em] font-bold uppercase text-grey">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="font-mono text-xs p-3 border border-ink bg-transparent outline-none focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.2em] font-bold uppercase text-grey">
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="••••••••••••"
              className="font-mono text-xs p-3 border border-ink bg-transparent outline-none focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn--primary btn--full mt-4"
          >
            {loading ? "Registering..." : "Create Account →"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-ink/15 text-center text-xs font-mono">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-ink underline hover:opacity-80">
            Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
}
