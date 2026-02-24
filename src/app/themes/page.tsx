"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { cn } from "@/lib/utils";

// Interface matching API response
interface ThemeData {
  _id: string;
  name: string;
  description: string;
  css: string;
  preview: string;
  tags: string[];
  featured: boolean;
  downloads: number;
  ratingSum: number;
  ratingCount: number;
  author: {
    _id: string;
    username: string;
    verified?: boolean;
  };
  createdAt: string;
}

type SortOption = "popular" | "rating" | "newest" | "name";

export default function ThemeStorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch themes from API
  useEffect(() => {
    async function fetchThemes() {
      try {
        const res = await fetch("/api/themes");
        if (res.ok) {
          const data = await res.json();
          setThemes(data.themes || []);
        }
      } catch (error) {
        console.error("Failed to fetch themes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchThemes();
  }, []);

  // Extract unique tags from themes
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    themes.forEach((t) => t.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [themes]);

  // Get featured themes
  const featuredThemes = useMemo(() => {
    return themes.filter((t) => t.featured);
  }, [themes]);

  const filteredThemes = useMemo(() => {
    let filtered = [...themes];

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((t) =>
        t.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case "rating":
        filtered.sort((a, b) => {
          const avgA = a.ratingCount > 0 ? a.ratingSum / a.ratingCount : 0;
          const avgB = b.ratingCount > 0 ? b.ratingSum / b.ratingCount : 0;
          return avgB - avgA;
        });
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [themes, searchQuery, selectedTag, sortBy]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-12 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-3">Theme Store</h1>
              <p className="text-zinc-400 text-lg">
                Discover beautiful themes created by the community
              </p>
            </div>
            <Link
              href="/themes/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-violet-500/25"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Theme
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Themes */}
      {!loading && !searchQuery && !selectedTag && featuredThemes.length > 0 && (
        <section className="py-12 border-b border-zinc-800 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-yellow-400 text-2xl">⭐</span>
              <h2 className="text-2xl font-bold">Featured Themes</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredThemes.map((theme) => (
                <ThemeCard key={theme._id} theme={theme} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Search */}
              <div>
                <label htmlFor="search" className="sr-only">
                  Search themes
                </label>
                <div className="relative">
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
                    id="search"
                    type="text"
                    placeholder="Search themes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  Sort By
                </h3>
                <div className="space-y-1">
                  {[
                    { value: "popular", label: "Most Popular" },
                    { value: "rating", label: "Highest Rated" },
                    { value: "newest", label: "Newest First" },
                    { value: "name", label: "Name (A-Z)" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSortBy(opt.value as SortOption)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        sortBy === opt.value
                          ? "bg-violet-500/10 text-violet-400"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  Categories
                </h3>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedTag(null)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      !selectedTag
                        ? "bg-violet-500/10 text-violet-400"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    )}
                  >
                    All Themes
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors",
                        selectedTag === tag
                          ? "bg-violet-500/10 text-violet-400"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Theme Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-zinc-400">
                {filteredThemes.length} theme{filteredThemes.length !== 1 && "s"}
                {selectedTag && (
                  <span className="ml-2">
                    in <span className="text-white capitalize">{selectedTag}</span>
                  </span>
                )}
              </p>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden animate-pulse">
                    <div className="h-36 bg-zinc-800" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-zinc-800 rounded w-3/4" />
                      <div className="h-4 bg-zinc-800 rounded w-full" />
                      <div className="h-4 bg-zinc-800 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredThemes.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredThemes.map((theme) => (
                  <ThemeCard key={theme._id} theme={theme} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-lg font-medium mb-2">No themes found</h3>
                <p className="text-zinc-500">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Components
// =============================================================================

function ThemeCard({
  theme,
  featured = false,
}: {
  theme: ThemeData;
  featured?: boolean;
}) {
  const averageRating = theme.ratingCount > 0 
    ? (theme.ratingSum / theme.ratingCount).toFixed(1) 
    : "0.0";

  return (
    <Link
      href={`/themes/${theme._id}`}
      className={cn(
        "group block bg-zinc-900 border rounded-xl overflow-hidden transition-all",
        featured
          ? "border-yellow-500/30 hover:border-yellow-500/50"
          : "border-zinc-800 hover:border-zinc-700"
      )}
    >
      {/* Preview */}
      <div
        className="h-36 transition-transform group-hover:scale-105"
        style={{ background: theme.preview }}
      />

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors">
              {theme.name}
            </h3>
            <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
              {theme.description}
            </p>
          </div>
          {featured && (
            <span className="shrink-0 px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/20">
              Featured
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-yellow-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{averageRating}</span>
              <span className="text-zinc-600">({theme.ratingCount})</span>
            </div>
            <span className="text-zinc-500">
              {theme.downloads.toLocaleString()} downloads
            </span>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
          <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-medium">
            {theme.author.username[0]}
          </div>
          <span className="text-sm text-zinc-400">{theme.author.username}</span>
          {theme.author.verified && (
            <svg
              className="w-4 h-4 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {theme.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded capitalize"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
