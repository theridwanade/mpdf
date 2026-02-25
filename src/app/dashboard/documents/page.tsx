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
  content: string;
  css: string;
  themeId?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDocuments();
    }
  }, [isAuthenticated]);

  const fetchDocuments = async () => {
    setLoadingData(true);
    try {
      const token = localStorage.getItem("mpdf_auth_token");
      const response = await fetch("/api/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const token = localStorage.getItem("mpdf_auth_token");
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete document");
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
      alert("Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-400">
                Dashboard
              </Link>
              <span className="text-zinc-600">/</span>
              <span className="text-white">Documents</span>
            </div>
            <h1 className="text-3xl font-bold">My Documents</h1>
            <p className="text-zinc-400 mt-1">
              Manage all your saved documents
            </p>
          </div>
          <Link href="/editor">
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Document
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
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
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Documents Grid */}
        {loadingData ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-pulse">
                <div className="h-5 bg-zinc-800 rounded w-3/4 mb-4" />
                <div className="h-4 bg-zinc-800 rounded w-1/2 mb-2" />
                <div className="h-4 bg-zinc-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {searchQuery ? (
              <>
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-zinc-500 mb-4">
                  No documents match "{searchQuery}"
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="border-zinc-700"
                >
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">No documents yet</h3>
                <p className="text-zinc-500 mb-4">
                  Create your first document to get started
                </p>
                <Link href="/editor">
                  <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500">
                    Create Document
                  </Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
              >
                {/* Preview Header */}
                <div className="h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border-b border-zinc-800">
                  <svg
                    className="w-10 h-10 text-zinc-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-white mb-2 truncate group-hover:text-violet-400 transition-colors">
                    {doc.name}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-sm text-zinc-500 mb-4">
                    <span>{formatDate(doc.updatedAt)}</span>
                    {doc.isPublic && (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                        Public
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/editor?document=${doc.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                      className="border-zinc-700 bg-zinc-800 hover:bg-red-900/20 hover:border-red-800 text-zinc-400 hover:text-red-400"
                    >
                      {deletingId === doc.id ? (
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
        {documents.length > 0 && (
          <div className="mt-8 text-center text-zinc-500 text-sm">
            {filteredDocuments.length} of {documents.length} documents
          </div>
        )}
      </div>
    </div>
  );
}
