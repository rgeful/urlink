"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface SaveButtonProps {
  pageName: string;
  intro: string;
  cardColor: string;
  textColor: string;
}

export default function SaveButton({ pageName, intro, cardColor, textColor }: SaveButtonProps) {
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function getAuthUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }
    getAuthUser();
  }, []);

  async function handleSave() {
    if (!userId) return;
    setSaving(true);

    const backgroundColor = cardColor.startsWith("#") ? cardColor.slice(1) : cardColor;
    const textColorValue = textColor.startsWith("#") ? textColor.slice(1) : textColor;

    const { error } = await supabase
      .from("User")
      .update({
        displayName: pageName.trim() || null,
        bio: intro.trim(),
        backgroundColor: backgroundColor,
        textColor: textColorValue,
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Failed to save changes.");
      return;
    }

    alert("Saved!");
  }

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={saving}
      className="mt-3 cursor-pointer rounded-full bg-black px-7 py-2.5 text-sm font-semibold text-white disabled:opacity-60 hover:bg-slate-800 transition"
    >
      {saving ? "Saving..." : "Save changes"}
    </button>
  );
}

