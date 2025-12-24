"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      // Fetch User Profile
      const { data: profile, error } = await supabase
        .from("User")
        .select("username,avatarUrl")
        .eq("id", user.id)
        .maybeSingle();

      if (error) console.error(error);

      if (!profile?.username) {
        window.location.href = "/dashboard/onboarding";
        return;
      }

      // Fetch all links and sum clickCount
      const { data: links, error: linksError } = await supabase
        .from("Link")
        .select("clickCount")
        .eq("userId", user.id);

      if (linksError) {
        console.error("Error loading links:", linksError);
      } else {
        const total = links?.reduce((sum, link) => sum + (link.clickCount || 0), 0) || 0;
        setTotalClicks(total);
      }

      setUsername(profile.username);
      setAvatarUrl(profile.avatarUrl ?? null);
      setLoading(false);
    }

    load();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Error signing out:", error);
      setLoggingOut(false);
      return;
    }

    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500 animate-pulse">Loading settings...</p>
      </main>
    );
  }

  return (
    <>
      <DashboardNavbar userName={username} avatarUrl={avatarUrl} />
      <main className="min-h-screen pt-24 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Settings</h1>

          {/* Analytics Section */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Analytics</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900">{totalClicks}</span>
              <span className="text-slate-600">total clicks on ur links</span>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Profile</h2>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {loggingOut ? "Logging out..." : "Log Out"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

