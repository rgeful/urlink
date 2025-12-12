"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AVAILABLE_ICONS, getIcon, IconKey } from "@/constants/icons";

interface IconLink {
  id: string;
  platform: string;
  url: string;
  orderIndex: number;
  isActive: boolean;
}

interface ProfileEditorProps {
  userId: string;
  email: string | null;
  username: string | null;
  pageName: string;
  setPageName: (val: string) => void;
  intro: string;
  setIntro: (val: string) => void;
  avatarUrl: string | null;
  setAvatarUrl: (val: string | null) => void;
  iconLinks: IconLink[];
  setIconLinks: (val: IconLink[]) => void;
}

export default function ProfileEditor({
  userId,
  email,
  username,
  pageName,
  setPageName,
  intro,
  setIntro,
  avatarUrl,
  setAvatarUrl,
  iconLinks = [],
  setIconLinks,
}: ProfileEditorProps) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddIconLink, setShowAddIconLink] = useState(false);
  const [newIconLinkPlatform, setNewIconLinkPlatform] = useState<string>("");
  const [newIconLinkUrl, setNewIconLinkUrl] = useState<string>("");
  const [editingIconLinkId, setEditingIconLinkId] = useState<string | null>(null);
  const [editIconLinkUrl, setEditIconLinkUrl] = useState<string>("");

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

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
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

    const { error: updateError } = await supabase
      .from("User")
      .update({ avatarUrl: publicUrl })
      .eq("id", userId);

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

  async function handleAddIconLink() {
    if (!newIconLinkPlatform || !newIconLinkUrl.trim()) {
      alert("Please select a platform and enter a URL");
      return;
    }

    try {
      new URL(newIconLinkUrl.trim());
    } catch {
      alert("Please enter a valid URL");
      return;
    }

    const maxOrderIndex = iconLinks.length > 0 
      ? Math.max(...iconLinks.map(link => link.orderIndex))
      : -1;

    const { data, error } = await supabase
      .from("IconLink")
      .insert({
        userId,
        platform: newIconLinkPlatform,
        url: newIconLinkUrl.trim(),
        orderIndex: maxOrderIndex + 1,
        isActive: true,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      if (error.code === "23505") {
        alert("This platform is already added. Please edit the existing one instead.");
      } else {
        alert("Failed to add icon link.");
      }
      return;
    }

    setIconLinks([...iconLinks, data]);
    setNewIconLinkPlatform("");
    setNewIconLinkUrl("");
    setShowAddIconLink(false);
  }

  async function handleDeleteIconLink(id: string) {
    if (!confirm("Are you sure you want to delete this icon link?")) return;

    const { error } = await supabase
      .from("IconLink")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to delete icon link.");
      return;
    }

    setIconLinks(iconLinks.filter(link => link.id !== id));
  }

  async function handleUpdateIconLink(id: string, newUrl: string) {
    if (!newUrl.trim()) {
      alert("Please enter a valid URL");
      return;
    }

    try {
      new URL(newUrl.trim());
    } catch {
      alert("Please enter a valid URL");
      return;
    }

    const { error } = await supabase
      .from("IconLink")
      .update({ url: newUrl.trim() })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to update icon link.");
      return;
    }

    setIconLinks(
      iconLinks.map(link => 
        link.id === id ? { ...link, url: newUrl.trim() } : link
      )
    );
    setEditingIconLinkId(null);
    setEditIconLinkUrl("");
  }

  function startEditingIconLink(link: IconLink) {
    setEditingIconLinkId(link.id);
    setEditIconLinkUrl(link.url);
  }

  function cancelEditingIconLink() {
    setEditingIconLinkId(null);
    setEditIconLinkUrl("");
  }

  const availablePlatforms = AVAILABLE_ICONS.filter(
    icon => !iconLinks.some(link => link.platform === icon.value)
  );

  return (
    <section className="w-full md:w-1/2">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Page</h1>
          <p className="text-sm text-slate-500">Logged in as {email}</p>
        </div>
      </header>

      {/* Page URL */}
      <div className="mb-5">
        <p className="mb-1 text-sm font-medium text-slate-600">Your page URL</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
            urlink.app/<span className="font-mono">{username}</span>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-full bg-black px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
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
          <label className="relative h-20 w-20 cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={uploading}
            />
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-200 border border-slate-300">
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
            <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-black text-[11px] text-white transition group-hover:scale-110">
              +
            </div>
          </label>
          <span className="text-xs text-slate-500 max-w-[150px]">
            JPG, PNG, or GIF. Recommended square image.
          </span>
        </div>
        {uploading && (
          <p className="mt-1 text-[11px] text-slate-400">Uploading...</p>
        )}
        {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
      </div>

      {/* Page Name */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-slate-600">
          Page name
        </label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-base outline-none focus:border-black transition"
          value={pageName}
          onChange={(e) => setPageName(e.target.value)}
          placeholder="Your name or brand"
        />
      </div>

      {/* bio */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-slate-600">
          Bio
        </label>
        <textarea
          className="h-36 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black transition"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="Tell others about yourself"
          maxLength={500}
        />
        <p className="mt-1 text-[11px] text-slate-400 text-right">
          {intro.length}/500
        </p>
      </div>

      {/* Icon Links Section */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Social Links
        </label>
        
        {/* Existing Icon Links */}
        <div className="mb-3 space-y-2">
          {iconLinks
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2"
              >
                <div className="shrink-0 text-slate-600">
                  {getIcon(link.platform)}
                </div>
                {editingIconLinkId === link.id ? (
                  <>
                    <input
                      type="text"
                      value={editIconLinkUrl}
                      onChange={(e) => setEditIconLinkUrl(e.target.value)}
                      placeholder="Enter URL"
                      className="flex-1 rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-black"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUpdateIconLink(link.id, editIconLinkUrl);
                        } else if (e.key === "Escape") {
                          cancelEditingIconLink();
                        }
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateIconLink(link.id, editIconLinkUrl)}
                      className="rounded-lg bg-black px-3 py-1 text-xs text-white hover:bg-slate-800"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditingIconLink}
                      className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 truncate text-sm text-slate-600">
                      {link.url}
                    </div>
                    <button
                      type="button"
                      onClick={() => startEditingIconLink(link)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteIconLink(link.id)}
                      className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))}
        </div>

        {/* Add Icon Link Button */}
        {!showAddIconLink ? (
          <button
            type="button"
            onClick={() => setShowAddIconLink(true)}
            className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
          >
            + Add Social Link
          </button>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
            <select
              value={newIconLinkPlatform}
              onChange={(e) => setNewIconLinkPlatform(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-black"
            >
              <option value="">Select platform</option>
              {availablePlatforms.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
            <input
              type="url"
              value={newIconLinkUrl}
              onChange={(e) => setNewIconLinkUrl(e.target.value)}
              placeholder="Enter URL (e.g., https://github.com/username)"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-black"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddIconLink();
                } else if (e.key === "Escape") {
                  setShowAddIconLink(false);
                  setNewIconLinkPlatform("");
                  setNewIconLinkUrl("");
                }
              }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddIconLink}
                disabled={!newIconLinkPlatform || !newIconLinkUrl.trim()}
                className="flex-1 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddIconLink(false);
                  setNewIconLinkPlatform("");
                  setNewIconLinkUrl("");
                }}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-3 cursor-pointer rounded-full bg-black px-7 py-2.5 text-sm font-semibold text-white disabled:opacity-60 hover:bg-slate-800 transition"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </section>
  );
}