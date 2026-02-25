"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  css: string;
  tags: string[];
  featured: boolean;
  approved: boolean;
  downloads: number;
  rating: { average: number; count: number };
  copiedFrom?: string;
  createdAt: string;
  updatedAt: string;
}

interface ModalState {
  type: "confirm" | "error" | null;
  title: string;
  message: string;
  onConfirm?: () => void;
}

export default function MyThemesPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");
  const [modal, setModal] = useState<ModalState>({ type: null, title: "", message: "" });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchThemes();
    }
  }, [isAuthenticated]);

  const fetchThemes = async () => {
    setLoadingData(true);
    try {
      const token = localStorage.getItem("mpdf_auth_token");
      const response = await fetch("/api/themes/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setThemes(data.themes);
      }
    } catch (error) {
      console.error("Failed to fetch themes:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const showError = (message: string) => {
    setModal({ type: "error", title: "Error", message });
  };

  const confirmDelete = (id: string) => {
    setModal({
      type: "confirm",
      title: "Delete Theme",
      message: "Are you sure you want to delete this theme? This action cannot be undone.",
      onConfirm: () => executeDelete(id),
    });
  };

  const executeDelete = async (id: string) => {
    setModal({ type: null, title: "", message: "" });
    setDeletingId(id);
    try {
      const token = localStorage.getItem("mpdf_auth_token");
      const response = await fetch(`/api/themes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setThemes(themes.filter((theme) => theme.id !== id));
      } else {
        const data = await response.json();
        showError(data.error || "Failed to delete theme");
      }
    } catch (error) {
      console.error("Failed to delete theme:", error);
      showError("Failed to delete theme");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (id: string, currentlyPublic: boolean) => {
    setTogglingId(id);
    try {
      const token = localStorage.getItem("mpdf_auth_token");
      const response = await fetch(`/api/themes/${id}/publish`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic: !currentlyPublic }),
      });

      if (response.ok) {
        // Update local state
        setThemes(themes.map((theme) => 
          theme.id === id ? { ...theme, approved: !currentlyPublic } : theme
        ));
      } else {
        const data = await response.json();
        showError(data.error || "Failed to update theme visibility");
      }
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
      showError("Failed to update theme visibility");
    } finally {
      setTogglingId(null);
    }
  };

  const handleUseInEditor = (themeId: string) => {
    router.push(`/editor?theme=${themeId}`);
  };

  const filteredThemes = themes.filter((theme) => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (filter) {
      case "public":
        return theme.approved;
      case "private":
        return !theme.approved;
      default:
        return true;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navigation />
        <div className="pt-32 text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navigation />

      {/* Modal */}
      {modal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModal({ type: null, title: "", message: "" })}
          />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              {modal.type === "error" ? (
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              )}
              <h3 className="text-lg font-semibold text-white">{modal.title}</h3>
            </div>
            <p className="text-zinc-400 mb-6">{modal.message}</p>
            <div className="flex justify-end gap-3">
              {modal.type === "confirm" ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setModal({ type: null, title: "", message: "" })}
                    className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={modal.onConfirm}
                    className="bg-red-600 hover:bg-red-500 text-white"
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setModal({ type: null, title: "", message: "" })}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white"
                >
                  OK
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-400">
                Dashboard
              </Link>
              <span className="text-zinc-600">/</span>
              <span className="text-white">My Themes</span>
            </div>
            <h1 className="text-3xl font-bold">My Themes</h1>
            <p className="text-zinc-400 mt-1">
              Create, edit, and publish your custom themes
            </p>
          </div>
          <Link href="/themes/create">
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Theme
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex gap-2">
            {[
              { value: "all", label: "All" },
              { value: "public", label: "Public" },
              { value: "private", label: "Private" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilter(opt.value as typeof filter)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  filter === opt.value
                    ? "bg-violet-500/10 text-violet-400 border border-violet-500/30"
                    : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Themes Grid */}
        {loadingData ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden animate-pulse">
                <div className="h-32 bg-zinc-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-zinc-800 rounded w-3/4" />
                  <div className="h-4 bg-zinc-800 rounded w-full" />
                  <div className="h-4 bg-zinc-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredThemes.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-xl">
            <svg
              className="w-12 h-12 text-zinc-600 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            {searchQuery || filter !== "all" ? (
              <>
                <h3 className="text-lg font-medium mb-2">No themes found</h3>
                <p className="text-zinc-500 mb-4">
                  No themes match your filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setFilter("all");
                  }}
                  className="border-zinc-700"
                >
                  Clear Filters
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">No themes yet</h3>
                <p className="text-zinc-500 mb-4">
                  Create your first theme to get started
                </p>
                <Link href="/themes/create">
                  <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500">
                    Create Theme
                  </Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredThemes.map((theme) => (
              <div
                key={theme.id}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
              >
                {/* Preview */}
                <div
                  className="h-32 transition-transform group-hover:scale-105"
                  style={{ background: theme.preview }}
                />

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-white truncate group-hover:text-violet-400 transition-colors">
                      {theme.name}
                    </h3>
                    <span
                      className={cn(
                        "shrink-0 px-2 py-0.5 text-xs font-medium rounded",
                        theme.approved
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      )}
                    >
                      {theme.approved ? "Published" : "Private"}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
                    {theme.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-zinc-500 mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {theme.downloads}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {theme.rating.average} ({theme.rating.count})
                    </div>
                    <span>{formatDate(theme.updatedAt)}</span>
                  </div>

                  {/* Tags */}
                  {theme.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {theme.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded capitalize"
                        >
                          {tag}
                        </span>
                      ))}
                      {theme.tags.length > 3 && (
                        <span className="px-2 py-0.5 text-zinc-500 text-xs">
                          +{theme.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/themes/${theme.id}/edit`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      onClick={() => handleUseInEditor(theme.id)}
                      className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                      title="Use in Editor"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleToggleVisibility(theme.id, theme.approved)}
                      disabled={togglingId === theme.id}
                      className={cn(
                        "border-zinc-700",
                        theme.approved
                          ? "bg-emerald-500/10 hover:bg-amber-500/10 text-emerald-400 hover:text-amber-400 border-emerald-700 hover:border-amber-700"
                          : "bg-zinc-800 hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-400 hover:border-emerald-700"
                      )}
                      title={theme.approved ? "Make Private" : "Share to Theme Store"}
                    >
                      {togglingId === theme.id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : theme.approved ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => confirmDelete(theme.id)}
                      disabled={deletingId === theme.id}
                      className="border-zinc-700 bg-zinc-800 hover:bg-red-900/20 hover:border-red-800 text-zinc-400 hover:text-red-400"
                    >
                      {deletingId === theme.id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {themes.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{themes.length}</div>
              <div className="text-sm text-zinc-500">Total Themes</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {themes.filter((t) => t.approved).length}
              </div>
              <div className="text-sm text-zinc-500">Public</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {themes.reduce((sum, t) => sum + t.downloads, 0)}
              </div>
              <div className="text-sm text-zinc-500">Total Downloads</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {themes.length > 0
                  ? (themes.reduce((sum, t) => sum + t.rating.average, 0) / themes.length).toFixed(1)
                  : "0.0"}
              </div>
              <div className="text-sm text-zinc-500">Avg Rating</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
