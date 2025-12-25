"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import MobilePreview from "@/components/dashboard/MobilePreview";
import { IconLink } from "@/components/dashboard/SocialLinks";
import { Link } from "@/components/dashboard/CustomLinks";
import SignupButton from "@/components/SignupButton";

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [pageName, setPageName] = useState("");
  const [intro, setIntro] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [iconLinks, setIconLinks] = useState<IconLink[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [cardColor, setCardColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");

  useEffect(() => {
    async function load() {
      if (!username) return;

      // Fetch User Profile by username
      const { data: profile, error } = await supabase
        .from("User")
        .select("id,username,displayName,bio,avatarUrl,backgroundColor,textColor")
        .eq("username", username)
        .maybeSingle();

      if (error) {
        console.error(error);
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (!profile) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Fetch Icons
      const { data: icons, error: iconsError } = await supabase
        .from("IconLink")
        .select("*")
        .eq("userId", profile.id)
        .order("orderIndex", { ascending: true });
        
      if (iconsError) console.error("Error loading icons:", iconsError);

      // Fetch Custom Links
      const { data: customLinks, error: linksError } = await supabase
        .from("Link")
        .select("*")
        .eq("userId", profile.id)
        .order("orderIndex", { ascending: true });
        
      if (linksError) console.error("Error loading links:", linksError);

      // Initialize state
      setPageName(profile.displayName ?? profile.username);
      setIntro(profile.bio ?? "");
      setAvatarUrl(profile.avatarUrl ?? null);
      setCardColor(profile.backgroundColor ? (profile.backgroundColor.startsWith("#") ? profile.backgroundColor : `#${profile.backgroundColor}`) : "#ffffff");
      setTextColor(profile.textColor ? (profile.textColor.startsWith("#") ? profile.textColor : `#${profile.textColor}`) : "#000000");
      setIconLinks(icons || []);
      setLinks(customLinks || []);

      setLoading(false);
    }

    load();
  }, [username]);

  async function handleLinkClick(linkId: string) {
    // find the current link to get its current count
    const link = links.find(l => l.id === linkId);
    if (link) {
      await supabase
        .from("Link")
        .update({ clickCount: link.clickCount + 1 })
        .eq("id", linkId);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-slate-500 animate-pulse">Loading profile...</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile not found</h1>
          <p className="text-slate-600">The user you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white md:bg-slate-50 md:flex md:flex-col md:items-center md:justify-center md:py-8" style={{ backgroundColor: cardColor }}>
      {/* Mobile: Full screen */}
      <div className="md:hidden w-full h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <MobilePreview
            avatarUrl={avatarUrl}
            pageName={pageName}
            username={username}
            intro={intro}
            iconLinks={iconLinks}
            links={links}
            cardColor={cardColor}
            textColor={textColor}
            onLinkClick={handleLinkClick}
            fullScreen={true}
          />
        </div>
        <div className="p-4 pb-6">
          <SignupButton />
        </div>
      </div>
      {/* Desktop: Using mobile preview basically */}
      <div className="hidden md:flex md:flex-col md:items-center md:gap-6">
        <MobilePreview
          avatarUrl={avatarUrl}
          pageName={pageName}
          username={username}
          intro={intro}
          iconLinks={iconLinks}
          links={links}
          cardColor={cardColor}
          textColor={textColor}
          onLinkClick={handleLinkClick}
        />
        <SignupButton />
      </div>
    </main>
  );
}

