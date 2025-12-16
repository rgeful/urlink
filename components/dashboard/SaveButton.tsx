"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface SaveButtonProps {
  username: string | null;
  intro: string;
  cardColor: string;
}

export default function SaveButton({ username, intro, cardColor }: SaveButtonProps) {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!username) return;
    setSaving(true);

    const { error } = await supabase
      .from("User")
      .update({
        bio: intro.trim(),
        backgroundColor: cardColor,
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

