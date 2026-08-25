"use client";

import { useState } from "react";
import { login } from "@/actions/auth";

export default function AdminLoginPage() {
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
    <div className="min-h-screen flex items-center justify-center pt-20 pb-16 px-6 bg-paper-warm">
      <div className="w-full max-w-md bg-paper border-2 border-ink p-8 shadow-xl">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] tracking-[0.25em] text-grey uppercase block mb-1">
            PROTECTED PORTAL
          </span>
          <h1 className="font-display text-4xl tracking-wider">ADMIN LOGIN</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-600 bg-red-50 text-red-700 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.2em] font-bold uppercase text-grey">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@laurafancystore.com"
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
      </div>
    </div>
  );
}
