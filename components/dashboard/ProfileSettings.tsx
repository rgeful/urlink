"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RiPaintFill } from "react-icons/ri";

interface ProfileSettingsProps {
  userId: string;
  email: string | null;
  username: string | null;
  pageName: string;
  setPageName: (val: string) => void;
  intro: string;
  setIntro: (val: string) => void;
  avatarUrl: string | null;
  setAvatarUrl: (val: string | null) => void;
  cardColor: string;
  setCardColor: (val: string) => void;
  textColor: string;
  setTextColor: (val: string) => void;
}

export default function ProfileSettings({
  userId,
  email,
  username,
  pageName,
  setPageName,
  intro,
  setIntro,
  avatarUrl,
  setAvatarUrl,
  cardColor,
  setCardColor,
  textColor,
  setTextColor,
}: ProfileSettingsProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const textColorInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Profile</h1>
          <p className="text-sm text-slate-500">Logged in as {email}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-slate-700 transition"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </header>

      {isExpanded && (
        <>
          {/* Page URL */}
          <div className="mb-5">
        <p className="mb-1 text-sm font-medium text-slate-600">Ur Link</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-full border border-slate-400 bg-white px-4 py-2 text-sm text-slate-600">
            urlink.fyi/<span className="font-mono">{username}</span>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-full bg-black px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            onClick={() =>
              navigator.clipboard.writeText(`https://urlink.fyi/${username}`)
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
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-200 border border-slate-500">
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
          Ur name
        </label>
        <input
          className="w-full rounded-2xl border border-slate-400 bg-white px-4 py-2.5 text-base outline-none focus:border-black transition"
          value={pageName}
          onChange={(e) => setPageName(e.target.value)}
          placeholder="Your name or brand"
          maxLength={80}
        />
      </div>

      {/* bio */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-slate-600">
          Ur Bio
        </label>
        <textarea
          className="h-36 w-full resize-none rounded-2xl border border-slate-400 bg-white px-4 py-2.5 text-sm outline-none focus:border-black transition"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="Tell others about yourself"
          maxLength={200}
        />
        <p className="mt-1 text-[11px] text-slate-400 text-right">
          {intro.length}/200
        </p>
      </div>

      {/* Card Color */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-slate-600">
          Background Color
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative shrink-0">
            <input
              ref={colorInputRef}
              type="color"
              value={cardColor}
              onChange={(e) => setCardColor(e.target.value)}
              className="absolute inset-0 w-10 h-10 opacity-0 cursor-pointer z-10"
            />
            <div
              className="h-10 w-10 rounded-full border-2 border-slate-300 flex items-center justify-center transition-all hover:scale-110 hover:border-black pointer-events-none"
              style={{ backgroundColor: cardColor }}
              aria-label="Open color picker"
            >
              <RiPaintFill className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {[
              "#ffffff", // White
              "#000000", // Black
              "#ef4444", // Red
              "#f97316", // Orange
              "#eab308", // Yellow
              "#22c55e", // Green
              "#3b82f6", // Blue
              "#a855f7", // Purple
              "#ec4899", // Pink
              "#6b7280", // Gray
            ].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setCardColor(color)}
                className="h-10 w-10 shrink-0 rounded-full border-2 border-slate-300 transition-all hover:scale-110"
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Text Color */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-slate-600">
          Text Color
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative shrink-0">
            <input
              ref={textColorInputRef}
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="absolute inset-0 w-10 h-10 opacity-0 cursor-pointer z-10"
            />
            <div
              className="h-10 w-10 rounded-full border-2 border-slate-300 flex items-center justify-center transition-all hover:scale-110 hover:border-black pointer-events-none"
              style={{ backgroundColor: textColor }}
              aria-label="Open color picker"
            >
              <RiPaintFill className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {[
              "#ffffff", // White
              "#000000", // Black
              "#ef4444", // Red
              "#f97316", // Orange
              "#eab308", // Yellow
              "#22c55e", // Green
              "#3b82f6", // Blue
              "#a855f7", // Purple
              "#ec4899", // Pink
              "#6b7280", // Gray
            ].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setTextColor(color)}
                className="h-10 w-10 shrink-0 rounded-full border-2 border-slate-300 transition-all hover:scale-110"
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}

