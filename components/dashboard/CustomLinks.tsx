"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Link {
  id: string;
  userId: string;
  title: string;
  subtitle: string | null;
  url: string;
  imageUrl: string | null;
  clickCount: number;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CustomLinksProps {
  userId: string;
  links: Link[];
  setLinks: (val: Link[]) => void;
}

export default function CustomLinks({
  userId,
  links = [],
  setLinks,
}: CustomLinksProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkSubtitle, setNewLinkSubtitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editLinkTitle, setEditLinkTitle] = useState("");
  const [editLinkSubtitle, setEditLinkSubtitle] = useState("");
  const [editLinkUrl, setEditLinkUrl] = useState("");
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  async function handleAddLink() {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      alert("Please enter a title and URL");
      return;
    }

    try {
      new URL(newLinkUrl.trim());
    } catch {
      alert("Please enter a valid URL");
      return;
    }

    const maxOrderIndex = links.length > 0 
      ? Math.max(...links.map(link => link.orderIndex))
      : -1;

    const { data, error } = await supabase
      .from("Link")
      .insert({
        userId,
        title: newLinkTitle.trim(),
        subtitle: newLinkSubtitle.trim() || null,
        url: newLinkUrl.trim(),
        imageUrl: null,
        orderIndex: maxOrderIndex + 1,
        isActive: true,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("Failed to add link.");
      return;
    }

    setLinks([...links, data]);
    setNewLinkTitle("");
    setNewLinkSubtitle("");
    setNewLinkUrl("");
    setShowAddLink(false);
  }

  async function handleDeleteLink(id: string) {
    if (!confirm("Are you sure you want to delete this link?")) return;

    const { error } = await supabase
      .from("Link")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to delete link.");
      return;
    }

    setLinks(links.filter(link => link.id !== id));
  }

  async function handleUpdateLink(id: string) {
    if (!editLinkTitle.trim() || !editLinkUrl.trim()) {
      alert("Please enter a title and URL");
      return;
    }

    try {
      new URL(editLinkUrl.trim());
    } catch {
      alert("Please enter a valid URL");
      return;
    }

    const { error } = await supabase
      .from("Link")
      .update({ 
        title: editLinkTitle.trim(),
        subtitle: editLinkSubtitle.trim() || null,
        url: editLinkUrl.trim(),
        imageUrl: null,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to update link.");
      return;
    }

    setLinks(
      links.map(link => 
        link.id === id 
          ? { 
              ...link, 
              title: editLinkTitle.trim(),
              subtitle: editLinkSubtitle.trim() || null,
              url: editLinkUrl.trim(),
              imageUrl: null,
            } 
          : link
      )
    );
    setEditingLinkId(null);
    setEditLinkTitle("");
    setEditLinkSubtitle("");
    setEditLinkUrl("");
  }

  function startEditingLink(link: Link) {
    setEditingLinkId(link.id);
    setEditLinkTitle(link.title);
    setEditLinkSubtitle(link.subtitle || "");
    setEditLinkUrl(link.url);
  }

  function cancelEditingLink() {
    setEditingLinkId(null);
    setEditLinkTitle("");
    setEditLinkSubtitle("");
    setEditLinkUrl("");
  }

  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", id);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (draggedItemId && draggedItemId !== id) {
      setDragOverItemId(id);
    }
  }

  function handleDragLeave() {
    setDragOverItemId(null);
  }

  async function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedItemId || draggedItemId === targetId) {
      setDraggedItemId(null);
      setDragOverItemId(null);
      return;
    }

    const sortedLinks = [...links].sort((a, b) => a.orderIndex - b.orderIndex);
    const draggedIndex = sortedLinks.findIndex(link => link.id === draggedItemId);
    const targetIndex = sortedLinks.findIndex(link => link.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItemId(null);
      setDragOverItemId(null);
      return;
    }

    // Swap orderIndex values
    const draggedLink = sortedLinks[draggedIndex];
    const targetLink = sortedLinks[targetIndex];
    const newDraggedOrderIndex = targetLink.orderIndex;
    const newTargetOrderIndex = draggedLink.orderIndex;
    
    // Update both links in the database
    const updates = [
      supabase
        .from("Link")
        .update({ orderIndex: newDraggedOrderIndex })
        .eq("id", draggedLink.id),
      supabase
        .from("Link")
        .update({ orderIndex: newTargetOrderIndex })
        .eq("id", targetLink.id),
    ];
    
    const results = await Promise.all(updates);
    
    // Check for errors
    const hasError = results.some(result => result.error);
    if (hasError) {
      console.error("Error reordering links");
      alert("Failed to reorder links.");
      setDraggedItemId(null);
      setDragOverItemId(null);
      return;
    }
    
    // Update local state
    const updatedLinks = links.map(link => {
      if (link.id === draggedLink.id) {
        return { ...link, orderIndex: newDraggedOrderIndex };
      }
      if (link.id === targetLink.id) {
        return { ...link, orderIndex: newTargetOrderIndex };
      }
      return link;
    });
    
    setLinks(updatedLinks);
    setDraggedItemId(null);
    setDragOverItemId(null);
  }

  function handleDragEnd() {
    setDraggedItemId(null);
    setDragOverItemId(null);
  }

  const sortedLinks = [...links].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Custom Links</h1>
          <p className="text-sm text-slate-500">Add links with captions</p>
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
          {/* Existing Links */}
          <div className="mb-3 space-y-2">
            {sortedLinks.map((link) => {
              const isDragging = draggedItemId === link.id;
              const isDragOver = dragOverItemId === link.id;
              const isEditing = editingLinkId === link.id;
              
              return (
                <div
                  key={link.id}
                  draggable={!isEditing}
                  onDragStart={(e) => !isEditing && handleDragStart(e, link.id)}
                  onDragOver={(e) => !isEditing && handleDragOver(e, link.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => !isEditing && handleDrop(e, link.id)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 rounded-xl border border-slate-400 bg-white px-3 py-3 transition ${
                    isDragging ? "opacity-50 cursor-grabbing" : isEditing ? "cursor-default" : "cursor-grab"
                  } ${
                    isDragOver ? "border-black border-2" : ""
                  }`}
                >
                  {/* Drag Handle */}
                  {!isEditing && (
                    <div className="flex cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 touch-none select-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-4"
                      >
                        <path d="M9 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM18 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                      </svg>
                    </div>
                  )}

                  {isEditing ? (
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={editLinkTitle}
                        onChange={(e) => setEditLinkTitle(e.target.value)}
                        placeholder="Link title"
                        className="w-full rounded-lg border border-slate-400 px-2 py-1.5 text-sm outline-none focus:border-black"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editLinkSubtitle}
                        onChange={(e) => setEditLinkSubtitle(e.target.value)}
                        placeholder="Subtitle (optional)"
                        className="w-full rounded-lg border border-slate-400 px-2 py-1.5 text-sm outline-none focus:border-black"
                      />
                      <input
                        type="url"
                        value={editLinkUrl}
                        onChange={(e) => setEditLinkUrl(e.target.value)}
                        placeholder="URL"
                        className="w-full rounded-lg border border-slate-400 px-2 py-1.5 text-sm outline-none focus:border-black"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateLink(link.id)}
                          className="rounded-lg bg-black px-3 py-1 text-xs text-white hover:bg-slate-800"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditingLink}
                          className="rounded-lg border border-slate-400 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-slate-900 truncate">
                          {link.title}
                        </div>
                        {link.subtitle && (
                          <div className="text-xs text-slate-600 truncate mt-0.5">
                            {link.subtitle}
                          </div>
                        )}
                        <div className="text-xs text-slate-400 truncate mt-1">
                          {link.url}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => startEditingLink(link)}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 shrink-0"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLink(link.id)}
                        className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 shrink-0"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Link Button */}
          {!showAddLink ? (
            <button
              type="button"
              onClick={() => setShowAddLink(true)}
              className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
            >
              + Add Custom Link
            </button>
          ) : (
            <div className="rounded-xl border border-slate-400 bg-white p-3 space-y-2">
              <input
                type="text"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                placeholder="Link title *"
                className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setShowAddLink(false);
                    setNewLinkTitle("");
                    setNewLinkSubtitle("");
                    setNewLinkUrl("");
                  }
                }}
              />
              <input
                type="text"
                value={newLinkSubtitle}
                onChange={(e) => setNewLinkSubtitle(e.target.value)}
                placeholder="Subtitle (optional)"
                className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-sm outline-none focus:border-black"
              />
              <input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="URL *"
                className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddLink();
                  } else if (e.key === "Escape") {
                    setShowAddLink(false);
                    setNewLinkTitle("");
                    setNewLinkSubtitle("");
                    setNewLinkUrl("");
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
                  className="flex-1 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddLink(false);
                    setNewLinkTitle("");
                    setNewLinkSubtitle("");
                    setNewLinkUrl("");
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
