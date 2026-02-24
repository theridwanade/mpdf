"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  updatedAt: string;
}

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  approved: boolean;
  downloads: number;
  rating: { average: number; count: number };
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const token = localStorage.getItem("mpdf_auth_token");
      const headers = { Authorization: `Bearer ${token}` };

      const [docsRes, themesRes] = await Promise.all([
        fetch("/api/documents?limit=5", { headers }),
        fetch("/api/themes/my?limit=5", { headers }),
      ]);

      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData.documents);
      }

      if (themesRes.ok) {
        const themesData = await themesRes.json();
        setThemes(themesData.themes);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoadingData(false);
    }
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

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.username}
          </h1>
          <p className="text-zinc-400">
            Manage your documents, themes, and account settings
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="text-2xl font-bold text-white">{documents.length}</div>
            <div className="text-sm text-zinc-500">Documents</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="text-2xl font-bold text-white">{themes.length}</div>
            <div className="text-sm text-zinc-500">Themes</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="text-2xl font-bold text-white">
              {themes.filter((t) => t.approved).length}
            </div>
            <div className="text-sm text-zinc-500">Published</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="text-2xl font-bold text-white">
              {themes.reduce((sum, t) => sum + t.downloads, 0)}
            </div>
            <div className="text-sm text-zinc-500">Total Downloads</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Documents */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="font-semibold">Recent Documents</h2>
              <Link
                href="/dashboard/documents"
                className="text-sm text-violet-400 hover:text-violet-300"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-zinc-800">
              {loadingData ? (
                <div className="px-6 py-8 text-center text-zinc-500">
                  Loading...
                </div>
              ) : documents.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-zinc-500 mb-4">No documents yet</p>
                  <Link
                    href="/editor"
                    className="text-violet-400 hover:text-violet-300 text-sm font-medium"
                  >
                    Create your first document →
                  </Link>
                </div>
              ) : (
                documents.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/editor?document=${doc.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-zinc-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-white">{doc.name}</span>
                    </div>
                    <span className="text-xs text-zinc-500">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* My Themes */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="font-semibold">My Themes</h2>
              <Link
                href="/dashboard/themes"
                className="text-sm text-violet-400 hover:text-violet-300"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-zinc-800">
              {loadingData ? (
                <div className="px-6 py-8 text-center text-zinc-500">
                  Loading...
                </div>
              ) : themes.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-zinc-500 mb-4">No themes yet</p>
                  <Link
                    href="/themes/create"
                    className="text-violet-400 hover:text-violet-300 text-sm font-medium"
                  >
                    Create your first theme →
                  </Link>
                </div>
              ) : (
                themes.map((theme) => (
                  <Link
                    key={theme.id}
                    href={`/themes/${theme.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-800/50 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg shrink-0"
                      style={{ background: theme.preview }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white truncate">{theme.name}</span>
                        <span
                          className={cn(
                            "px-1.5 py-0.5 text-xs rounded",
                            theme.approved
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-500/10 text-amber-400"
                          )}
                        >
                          {theme.approved ? "Published" : "Pending"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">
                        {theme.downloads} downloads
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/editor">
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Document
            </Button>
          </Link>
          <Link href="/themes/create">
            <Button
              variant="outline"
              className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              Create Theme
            </Button>
          </Link>
          <Link href="/themes">
            <Button
              variant="outline"
              className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
            >
              Browse Themes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
