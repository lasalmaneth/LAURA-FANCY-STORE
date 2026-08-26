"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6 bg-paper-warm">
      <div className="w-full max-w-md bg-paper border-2 border-ink p-8 shadow-[8px_8px_0px_0px_#111]">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] tracking-[0.25em] text-grey uppercase block mb-1">
            ACCOUNT ACCESS
          </span>
          <h1 className="font-display text-4xl tracking-wider uppercase">SIGN IN</h1>
          <p className="text-xs text-[#555] mt-2">
            Log in with your Email and Password.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-600 bg-red-50 text-red-700 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="••••••••••••"
              className="font-mono text-xs p-3 border border-ink bg-transparent outline-none focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn--primary btn--full mt-4"
          >
            {loading ? "Authenticating..." : "Sign In →"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-ink/15 text-center text-xs font-mono">
          Don't have an account yet?{" "}
          <Link href="/register" className="font-bold text-ink underline hover:opacity-80">
            Create Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
