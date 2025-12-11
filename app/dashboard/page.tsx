"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // editor state
  const [pageName, setPageName] = useState("");
  const [intro, setIntro] = useState("");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: profile, error } = await supabase
        .from("User")
        .select("username,bio,avatarUrl")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
      }

      if (!profile?.username) {
        window.location.href = "/dashboard/onboarding";
        return;
      }

      setEmail(user.email ?? null);
      setUsername(profile.username);
      setPageName(profile.username);
      setIntro(profile.bio ?? "");
      setAvatarUrl(profile.avatarUrl ?? null);
      setLoading(false);
    }

    load();
  }, []);

  async function handleSave() {
    if (!username) return;
    setSaving(true);

    const { error } = await supabase
      .from("User")
      .update({
        bio: intro.trim(),
      })
      .eq("username", username);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Failed to save changes.");
      return;
    }

    alert("Saved!");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </main>
    );
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  setError(null);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Not logged in");
    setError("Not logged in");
    setUploading(false);
    return;
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError) {
    console.error(uploadError);
    alert("Error uploading image");
    setError("Error uploading image");
    setUploading(false);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  // save URL to User table
  const { error: updateError } = await supabase
    .from("User")
    .update({ avatarUrl: publicUrl })
    .eq("id", user.id);

  setUploading(false);

  if (updateError) {
    console.error(updateError);
    alert("Error saving avatar");
    setError("Error saving avatar");
    return;
  }

  setError(null);
  setAvatarUrl(publicUrl);
}


return (
  <main className="min-h-screen px-6 py-8">
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 md:flex-row">
      {/* Left Editor */}
      <section className="w-full md:w-1/2">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">My Page</h1>
            <p className="text-sm text-slate-500">Logged in as {email}</p>
          </div>
        </header>

        {/* Page URL */}
        <div className="mb-5">
          <p className="mb-1 text-sm font-medium text-slate-600">
            Your page URL
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
              urlink.app/<span className="font-mono">{username}</span>
            </div>
            <button
              type="button"
              className="cursor-pointer rounded-full bg-black px-5 py-2 text-xs font-semibold text-white"
              onClick={() =>
                navigator.clipboard.writeText(`https://urlink.app/${username}`)
              }
            >
              Copy URL
            </button>
          </div>
        </div>

        {/* Profile photo */}
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-slate-600">Profile photo</p>
          <div className="flex items-center gap-4">
            <label className="relative h-20 w-20 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-200">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-500">Add</span>
                )}
              </div>
              <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-black text-[11px] text-white">
                +
              </div>
            </label>
            <span className="text-xs text-slate-500">
              JPG, PNG, or GIF. Recommended square image.
            </span>
          </div>
          {uploading && (
            <p className="mt-1 text-[11px] text-slate-400">Uploading…</p>
          )}
          {error && (
            <p className="mt-1 text-[11px] text-red-500">{error}</p>
          )}
        </div>

        {/* Page Name */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Page name
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-base outline-none focus:border-black"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            placeholder="Your name or brand"
          />
        </div>

        {/* Intro / bio */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Bio
          </label>
          <textarea
            className="h-36 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="Tell others about yourself"
            maxLength={500}
          />
          <p className="mt-1 text-[11px] text-slate-400">
            {intro.length}/500
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-3 cursor-pointer rounded-full bg-black px-7 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </section>

      {/* Right Preview */}
      <section className="w-full md:w-1/2 flex justify-center md:justify-end">
        <div className="w-full max-w-sm rounded-3xl px-4 py-6 flex items-center justify-center">
          <div className="w-full max-w-[320px] aspect-9/16 rounded-[30px] bg-white px-6 py-8 shadow-md overflow-y-auto">
            <div className="flex flex-col items-center">
              {/* avatar */}
              <div className="mb-3 h-20 w-20 overflow-hidden rounded-full bg-slate-200">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              {/* name */}
              <p className="mb-1 text-base font-semibold">
                {pageName || username}
              </p>

              {/* bio */}
              {intro && (
                <div className="mt-2 w-full rounded-xl px-4 py-2 text-xs text-center text-slate-600 wrap-break-word">
                  {intro}
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <Image
                  src="/UrLinkLogo2.svg"
                  alt="URLink Logo"
                  width={90}
                  height={24}
                  className="opacity-60"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
);

}
