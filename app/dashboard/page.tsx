"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProfileEditor from "@/components/dashboard/ProfileEditor";
import MobilePreview from "@/components/dashboard/MobilePreview";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

interface IconLink {
  id: string;
  platform: string;
  url: string;
  orderIndex: number;
  isActive: boolean;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  // User Auth Data
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // Editable Content State
  const [pageName, setPageName] = useState("");
  const [intro, setIntro] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [iconLinks, setIconLinks] = useState<IconLink[]>([]);

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
        .select("username,bio,avatarUrl")
        .eq("id", user.id)
        .maybeSingle();

      if (error) console.error(error);

      if (!profile?.username) {
        window.location.href = "/dashboard/onboarding";
        return;
      }

      // Fetch Icons
      const { data: icons, error: iconsError } = await supabase
        .from("IconLink")
        .select("*")
        .eq("userId", user.id)
        .order("orderIndex", { ascending: true });
        
      if (iconsError) console.error("Error loading icons:", iconsError);

      setUserId(user.id);
      setEmail(user.email ?? null);
      setUsername(profile.username);
      
      // Initialize shared state
      setPageName(profile.username);
      setIntro(profile.bio ?? "");
      setAvatarUrl(profile.avatarUrl ?? null);
      setIconLinks(icons || []);

      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500 animate-pulse">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <>
      <DashboardNavbar userName={pageName || username} avatarUrl={avatarUrl} />
      <main className="min-h-screen px-6 py-8 bg-slate-50 pt-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 md:flex-row">

        {userId && (
          <ProfileEditor
            userId={userId}
            email={email}
            username={username}
            pageName={pageName}
            setPageName={setPageName}
            intro={intro}
            setIntro={setIntro}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            iconLinks={iconLinks} 
            setIconLinks={setIconLinks}
          />
        )}

        <section className="w-full md:w-1/2 flex justify-center md:justify-end sticky top-8 h-fit">
          <MobilePreview
            avatarUrl={avatarUrl}
            pageName={pageName}
            username={username}
            intro={intro}
            iconLinks={iconLinks}
          />
        </section>
      </div>
    </main>
    </>
  );
}