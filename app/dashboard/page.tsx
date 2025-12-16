"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import SocialLinks from "@/components/dashboard/SocialLinks";
import SaveButton from "@/components/dashboard/SaveButton";
import MobilePreview from "@/components/dashboard/MobilePreview";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { IconLink } from "@/components/dashboard/SocialLinks";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // User Auth Data
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // Editable Content State
  const [pageName, setPageName] = useState("");
  const [intro, setIntro] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [iconLinks, setIconLinks] = useState<IconLink[]>([]);
  const [cardColor, setCardColor] = useState("#ffffff");

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
        .select("username,bio,avatarUrl,backgroundColor")
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
      setCardColor(profile.backgroundColor ?? "#ffffff");
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
      <main className="min-h-screen flex overflow-x-hidden">
        <div className="w-full md:w-1/2 px-6 py-8 pt-24 max-w-full overflow-x-hidden">
          {/* Preview Design Button - Mobile Only */}
          <button
            onClick={() => setShowPreview(true)}
            className="md:hidden fixed bottom-6 right-6 z-40 bg-black text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:bg-slate-800 transition"
          >
            Preview Design
          </button>

          {userId && (
            <>
              <ProfileSettings
                userId={userId}
                email={email}
                username={username}
                pageName={pageName}
                setPageName={setPageName}
                intro={intro}
                setIntro={setIntro}
                avatarUrl={avatarUrl}
                setAvatarUrl={setAvatarUrl}
                cardColor={cardColor}
                setCardColor={setCardColor}
              />
              <SocialLinks
                userId={userId}
                iconLinks={iconLinks}
                setIconLinks={setIconLinks}
              />
              <div className="mt-6 pb-8">
                <SaveButton username={username} intro={intro} cardColor={cardColor} />
              </div>
            </>
          )}
        </div>

        {/* Desktop Preview - Fixed Right Side */}
        <section className="hidden md:flex fixed top-16 right-0 w-1/2 h-[calc(100vh-4rem)] bg-slate-50 items-center justify-center">
          <MobilePreview
            avatarUrl={avatarUrl}
            pageName={pageName}
            username={username}
            intro={intro}
            iconLinks={iconLinks}
            cardColor={cardColor}
          />
        </section>

        {/* Mobile Preview Modal - Fullscreen */}
        {showPreview && (
          <div className="md:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
            <button
              onClick={() => setShowPreview(false)}
              className="fixed top-4 right-4 z-10 bg-black/80 text-white rounded-full p-2 shadow-lg hover:bg-black transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="min-h-screen flex items-center justify-center">
              <MobilePreview
                avatarUrl={avatarUrl}
                pageName={pageName}
                username={username}
                intro={intro}
                iconLinks={iconLinks}
                cardColor={cardColor}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}