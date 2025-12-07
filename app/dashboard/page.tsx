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
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row">
        {/* Left Editor */}
        <section className="w-full md:w-1/2">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">My Page</h1>
              <p className="text-[11px] text-slate-500">
                Logged in as {email}
              </p>
            </div>
          </header>

          {/* Page URL */}
          <div className="mb-4">
            <p className="text-[11px] font-medium text-slate-600 mb-1">
              Your page URL
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                urlink.app/<span className="font-mono">{username}</span>
              </div>
              <button
                type="button"
                className="rounded-full bg-black cursor-pointer px-4 py-2 text-[11px] font-semibold text-white"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `https://urlink.app/${username}`
                  )
                }
              >
                Copy URL
              </button>
            </div>
          </div>


          <div className="mb-6">
            <p className="text-[11px] font-medium text-slate-600 mb-2">
              Profile photo
            </p>
            <div className="flex items-center gap-3">
              <label className="relative h-16 w-16 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
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
                <div className="absolute -right-1 -bottom-1 h-5 w-5 rounded-full bg-black text-[10px] text-white flex items-center justify-center">
                  +
                </div>
              </label>
              <span className="text-[11px] text-slate-500">
                JPG, PNG, or GIF. Recommended square image.
              </span>
            </div>
            {uploading && (
              <p className="mt-1 text-[10px] text-slate-400">Uploading…</p>
            )}
            {error && (
              <p className="mt-1 text-[10px] text-red-500">{error}</p>
            )}
          </div>


          {/* Page Name */}
          <div className="mb-4">
            <label className="mb-1 block text-[11px] font-medium text-slate-600">
              Page name
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-black"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              placeholder="Your name or brand"
            />
          </div>

          {/* Intro / bio */}
          <div className="mb-4">
            <label className="mb-1 block text-[11px] font-medium text-slate-600">
              Bio
            </label>
            <textarea
              className="h-28 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-black"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="Tell others about yourself"
              maxLength={500}
            />
            <p className="mt-1 text-[10px] text-slate-400">
              {intro.length}/500
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-2 rounded-full bg-black cursor-pointer px-6 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </section>

        {/* Right Preview (might have to separate everything tbh) */}
        <section className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="w-full max-w-md rounded-3xl px-6 py-8 flex items-center justify-center">
            <div className="w-full aspect-9/16 max-w-xs rounded-4xl bg-white px-6 py-8 shadow-md overflow-y-auto">
              <div className="flex flex-col items-center">
                {/* avatar placeholder */}
                <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-200 mb-3">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>


                {/* name */}
                <p className="text-sm font-semibold mb-1">
                  {pageName || username}
                </p>

                {/* intro / bio */}
                {intro && (
                  <div className="mt-1 w-full rounded-xl px-4 py-1 text-[11px] text-center text-slate-600 wrap-break-word">
                    {intro}
                  </div>

                )}

                <div className="flex justify-center mt-6">
                  <Image
                    src="/UrLinkLogo2.svg"
                    alt="URLink Logo"
                    width={80}
                    height={20}
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
