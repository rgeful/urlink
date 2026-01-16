"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

export default function OnboardingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function ensureAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (!user.email) {
        setError("No email found for this account.");
        setCheckingUser(false);
        return;
      }

      setCheckingUser(false);
    }

    ensureAuth();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    if (!user.email) {
      setError("No email found for this account.");
      setLoading(false);
      return;
    }

    const cleanUsername = username.trim().toLowerCase();

    if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
      setError(
        "Username must be 3–20 characters: lowercase letters, numbers, underscores."
      );
      setLoading(false);
      return;
    }

    const { error: upsertError } = await supabase
      .from("User")
      .upsert(
        {
          id: user.id,
          email: user.email,
          username: cleanUsername,
        },
        { onConflict: "id" }
      );

    setLoading(false);

    if (upsertError) {
      console.error(upsertError);

      // PostgreSQL error code 23505 = unique_violation
      if ("code" in upsertError && upsertError.code === "23505") {
        setError("That username is already taken.");
      } else {
        setError(upsertError.message);
      }
      return;
    }

    router.push("/dashboard");
  }

  if (checkingUser) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex bg-white">
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

      <section className="w-full md:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold mb-1">Welcome to UrLink!</h1>
            <p className="text-sm text-slate-500">
              Choose ur username. You can always change it later.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Username
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-500 mr-1">urlink.fyi/</span>
                <input
                  className="flex-1 bg-transparent text-sm outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500">
                This becomes your public link. You cannot change it as of now sry :/
              </p>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-[#111] cursor-pointer px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
            >
              {loading ? "Saving…" : "Continue"}
            </button>
          </form>
        </div>
      </section>

      <section className="relative hidden md:flex items-center justify-center bg-[#d6a02f]"></section>
    </main>
  );
}
