"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: rows, error } = await supabase
        .from("User")
        .select("username")
        .eq("id", user.id)
        .limit(1);

      if (error) {
        console.error(error);
      }

      const profile = rows?.[0];

      if (!profile || !profile.username) {
        window.location.href = "/dashboard/onboarding";
        return;
      }

      setEmail(user.email ?? null);
      setLoading(false);
    }

    loadUser();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <p className="text-sm text-slate-600 mb-6">
          Logged in as <span className="font-medium">{email}</span>
        </p>

        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6">
          <p className="text-sm text-slate-500">
            Card editor coming next
          </p>
        </div>
      </div>
    </main>
  );
}