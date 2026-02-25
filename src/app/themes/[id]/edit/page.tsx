"use client";

import { useState, useCallback, useEffect, useRef, use } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { marked } from "marked";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PDF_BASE_CSS } from "@/lib/pdf-base";
import {
  validateTheme,
  type ValidationResult,
} from "@/lib/theme-schema";
import { useAuth } from "@/contexts/AuthContext";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const PREVIEW_CONTENT = `# My Theme Preview

<p class="subtitle">A beautiful theme for stunning documents</p>

---

## Introduction

This preview shows how your theme renders different elements.

### Typography

Regular paragraph with **bold text**, *italic text*, and \`inline code\`. You can create [links](#) that stand out.

> "The details are not the details. They make the design."

### Code Example

\`\`\`javascript
function createTheme(options) {
  return { name: options.name, colors: options.colors };
}
\`\`\`

### Data Table

| Property | Value | Description |
|----------|-------|-------------|
| Primary | #667eea | Main color |
| Accent | #764ba2 | Secondary |

### Callouts

<div class="callout callout-info">
<strong>Info:</strong> This is an informational callout.
</div>

<div class="callout callout-success">
<strong>Success:</strong> This is a success callout.
</div>

### Badges

<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>

### Card

<div class="card">
<h3 style="margin-top:0">Card Title</h3>
<p style="margin-bottom:0">Cards help organize content.</p>
</div>
`;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditThemePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Theme data
  const [themeName, setThemeName] = useState("");
  const [themeDescription, setThemeDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [themeCss, setThemeCss] = useState("");
  const [themePreview, setThemePreview] = useState("linear-gradient(135deg, #667eea 0%, #764ba2 100%)");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isApproved, setIsApproved] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // UI state
  const [loading, setLoading] = useState(true);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const availableTags = [
    "professional",
    "minimal",
    "dark",
    "colorful",
    "corporate",
    "creative",
    "academic",
    "tech",
    "modern",
    "classic",
  ];

  // Fetch theme data
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
      return;
    }

    if (isAuthenticated && id) {
      fetchTheme();
    }
  }, [authLoading, isAuthenticated, id]);

  const fetchTheme = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("mpdf_auth_token");
      const response = await fetch(`/api/themes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 404) {
          router.push("/dashboard/themes");
        }
        return;
      }

      const data = await response.json();
      const theme = data.theme;

      if (!theme.isOwner) {
        router.push(`/themes/${id}`);
        return;
      }

      setThemeName(theme.name);
      setThemeDescription(theme.description);
      setLongDescription(theme.longDescription || "");
      setThemeCss(theme.css);
      setThemePreview(theme.preview);
      setSelectedTags(theme.tags || []);
      setIsApproved(theme.approved);
      setIsOwner(theme.isOwner);
    } catch (error) {
      console.error("Failed to fetch theme:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update preview
  const updatePreview = useCallback(() => {
    if (!iframeRef.current) return;

    const htmlContent = marked.parse(PREVIEW_CONTENT);
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
${PDF_BASE_CSS}
${themeCss}
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
    `;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(fullHtml);
      doc.close();
    }
  }, [themeCss]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  // Validate CSS
  useEffect(() => {
    if (themeCss) {
      const result = validateTheme(themeCss);
      setValidation(result);
    }
  }, [themeCss]);

  // Track changes
  useEffect(() => {
    setHasChanges(true);
  }, [themeName, themeDescription, longDescription, themeCss, themePreview, selectedTags]);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!themeName || !themeDescription || !validation?.valid) {
      setSaveError("Please fill in all required fields and fix validation errors");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem("mpdf_auth_token");
      const response = await fetch(`/api/themes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: themeName,
          description: themeDescription,
          longDescription,
          css: themeCss,
          preview: themePreview,
          tags: selectedTags,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setHasChanges(false);
        // Check if approval status changed (CSS was modified)
        const data = await response.json();
        setIsApproved(data.theme.approved);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const data = await response.json();
        setSaveError(data.error || "Failed to save theme");
      }
    } catch (error) {
      setSaveError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      const token = localStorage.getItem("mpdf_auth_token");
      const response = await fetch(`/api/themes/${id}/publish`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setIsApproved(true);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const data = await response.json();
        setSaveError(data.error || "Failed to publish theme");
      }
    } catch (error) {
      setSaveError("Network error. Please try again.");
    }
  };

  const handleUseInEditor = () => {
    router.push(`/editor?theme=${id}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navigation />
        <div className="pt-32 text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 mt-4">Loading theme...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-6 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/dashboard/themes" className="hover:text-white transition-colors">
              My Themes
            </Link>
            <span>/</span>
            <span className="text-zinc-300">Edit</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg"
                style={{ background: themePreview }}
              />
              <div>
                <h1 className="text-2xl font-bold">{themeName || "Edit Theme"}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded",
                      isApproved
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    )}
                  >
                    {isApproved ? "Published" : "Private"}
                  </span>
                  {hasChanges && (
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded">
                      Unsaved changes
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleUseInEditor}
                className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Use in Editor
              </Button>
              {!isApproved && (
                <Button
                  variant="outline"
                  onClick={handlePublish}
                  disabled={!validation?.valid}
                  className="border-violet-700 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Publish
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={!themeName || !themeDescription || !validation?.valid || isSaving}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Editor */}
          <div className="space-y-6">
            {/* Theme Info */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Theme Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">
                    Theme Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-zinc-400 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    id="description"
                    value={themeDescription}
                    onChange={(e) => setThemeDescription(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>
                <div>
                  <label htmlFor="longDescription" className="block text-sm font-medium text-zinc-400 mb-2">
                    Long Description
                  </label>
                  <textarea
                    id="longDescription"
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-violet-500 resize-none"
                    placeholder="Detailed description of your theme..."
                  />
                </div>
                <div>
                  <label htmlFor="preview" className="block text-sm font-medium text-zinc-400 mb-2">
                    Preview Gradient
                  </label>
                  <input
                    id="preview"
                    type="text"
                    value={themePreview}
                    onChange={(e) => setThemePreview(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-violet-500 font-mono text-sm"
                    placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  />
                  <div
                    className="mt-2 h-8 rounded-lg"
                    style={{ background: themePreview }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={cn(
                          "px-3 py-1 text-sm rounded-full capitalize transition-colors",
                          selectedTags.includes(tag)
                            ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CSS Editor */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <h2 className="font-semibold">Theme CSS</h2>
                {isApproved && (
                  <span className="text-xs text-amber-400">
                    Note: Modifying CSS will require re-approval
                  </span>
                )}
              </div>
              <div className="h-[400px]">
                <MonacoEditor
                  height="100%"
                  theme="vs-dark"
                  language="css"
                  value={themeCss}
                  onChange={(v) => v !== undefined && setThemeCss(v)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    padding: { top: 12 },
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>

            {/* Validation */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <svg
                    className={cn(
                      "w-5 h-5",
                      validation?.valid ? "text-emerald-400" : "text-amber-400"
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {validation?.valid ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    )}
                  </svg>
                  Validation
                </h2>
                <button
                  type="button"
                  onClick={() => setShowValidation(!showValidation)}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  {showValidation ? "Hide" : "Show"} Details
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-zinc-400">Schema Coverage</span>
                  <span className={cn("font-medium", validation?.valid ? "text-emerald-400" : "text-amber-400")}>
                    {validation?.coverage.percentage || 0}%
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className={cn("h-2 rounded-full transition-all", validation?.valid ? "bg-emerald-500" : "bg-amber-500")}
                    style={{ width: `${validation?.coverage.percentage || 0}%` }}
                  />
                </div>
              </div>

              {showValidation && validation && (
                <div className="space-y-3 text-sm">
                  {validation.errors.length > 0 && (
                    <div>
                      <h4 className="text-red-400 font-medium mb-2">Errors ({validation.errors.length})</h4>
                      <ul className="space-y-1 text-red-300">
                        {validation.errors.slice(0, 5).map((err, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-red-500">•</span>
                            {err.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {validation.warnings.length > 0 && (
                    <div>
                      <h4 className="text-amber-400 font-medium mb-2">Warnings ({validation.warnings.length})</h4>
                      <ul className="space-y-1 text-amber-300">
                        {validation.warnings.slice(0, 5).map((warn, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-500">•</span>
                            {warn.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {validation.valid && validation.warnings.length === 0 && (
                    <p className="text-emerald-400">✓ Theme passes all validation checks</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden sticky top-24">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <h2 className="font-semibold">Live Preview</h2>
                <span className="text-xs text-zinc-500">A4 • Print-ready</span>
              </div>
              <div className="bg-zinc-200 p-4 h-[700px] overflow-auto">
                <iframe
                  ref={iframeRef}
                  title="Theme Preview"
                  className="w-full h-full bg-white shadow-lg rounded"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Toast */}
      {saveError && (
        <div className="fixed bottom-6 right-6 bg-red-900/90 border border-red-700 text-white px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {saveError}
            <button type="button" onClick={() => setSaveError(null)} className="ml-2 text-red-300 hover:text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
