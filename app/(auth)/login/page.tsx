"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="relative min-h-screen grid md:grid-cols-2 bg-white">
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center"
        aria-label="Go to homepage"
      >
        <Image
          src="/UrLinkLogo2.svg"
          alt="UrLink"
          width={140}
          height={40}
          priority
          className="w-24 h-auto md:w-36"
        />
      </Link>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">
              Log in to manage your UrLink card.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Email</label>
              <input
                type="email"
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#bcbcbc]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Password</label>
              <input
                type="password"
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#bcbcbc]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#111] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-black disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-slate-800 underline">
              Sign up
            </Link>
          </p>
        </div>
      </section>

      <section className="relative hidden md:flex items-center justify-center bg-[#d6a02f]">
      </section>
    </main>
  );
}
