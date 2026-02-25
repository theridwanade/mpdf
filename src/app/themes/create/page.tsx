"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
  generateThemeSkeleton,
  SCHEMA_CATEGORIES,
  getSelectorsByCategory,
  type ValidationResult,
} from "@/lib/theme-schema";
import { validateThemeSubmission } from "@/lib/theme-store";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const PREVIEW_CONTENT = `# My Awesome Theme

<p class="subtitle">A beautiful theme for stunning documents</p>

---

## Introduction

This preview shows how your theme renders different elements. Customize the CSS on the left to see changes in real-time.

### Typography Showcase

Regular paragraph with **bold text**, *italic text*, and \`inline code\`. You can create [links](#) that stand out.

> "The details are not the details. They make the design."
> — Charles Eames

### Code Example

\`\`\`javascript
function createTheme(options) {
  return {
    name: options.name,
    colors: options.colors,
    fonts: options.fonts
  };
}
\`\`\`

### Data Table

| Property | Value | Description |
|----------|-------|-------------|
| Primary | #667eea | Main brand color |
| Accent | #764ba2 | Secondary color |
| Text | #2d3748 | Body text color |

### Callouts

<div class="callout callout-info">
<strong>Info:</strong> This is an informational callout.
</div>

<div class="callout callout-success">
<strong>Success:</strong> This is a success callout.
</div>

<div class="callout callout-warning">
<strong>Warning:</strong> This is a warning callout.
</div>

### Badges

<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>

### Card Component

<div class="card">
<h3 style="margin-top:0">Card Title</h3>
<p style="margin-bottom:0">Cards help organize and highlight important content sections.</p>
</div>

### Lists

**Unordered:**
- First item with some text
- Second item with more content  
- Third item to complete the list

**Ordered:**
1. Primary step
2. Secondary step
3. Final step

<div class="page-break"></div>

# Page Two

This is the second page. Use \`.page-break\` to control pagination.

<p class="lead">Lead paragraphs are great for introductions and important summaries.</p>

---

*Theme created with MPDF*
`;

const STARTER_TEMPLATE = `/* MY CUSTOM THEME */
/* Edit this CSS to create your unique theme */

:root {
  /* Required color variables */
  --color-primary: #667eea;
  --color-accent: #764ba2;
  --color-text: #2d3748;
  --color-text-light: #718096;
  --color-text-muted: #a0aec0;
  --color-background: #ffffff;
  --color-surface: #f7fafc;
  --color-border: #e2e8f0;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.75;
  color: var(--color-text);
  background: var(--color-background);
}

/* Headings */
h1 {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 1rem 0;
  color: var(--color-primary);
}

h2 {
  font-size: 1.625rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 2.5rem 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-border);
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
  margin: 2rem 0 0.75rem 0;
}

/* Links */
a { color: var(--color-primary); text-decoration: none; }
a:hover { text-decoration: underline; }

/* Code */
code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
  background: var(--color-surface);
  color: var(--color-accent);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.7;
  background: #1a1a2e;
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  overflow-x: auto;
}

pre code { background: transparent; border: none; padding: 0; color: inherit; }

/* Blockquotes */
blockquote {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background: var(--color-surface);
  border-left: 4px solid var(--color-primary);
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: var(--color-text-light);
}

/* Tables */
table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
th { 
  background: var(--color-primary); 
  color: white; 
  font-weight: 600; 
  padding: 0.75rem 1rem; 
  text-align: left; 
}
td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border); }

/* Horizontal Rule */
hr { 
  border: none; 
  height: 1px; 
  background: var(--color-border); 
  margin: 2.5rem 0; 
}

/* Lists */
ul, ol { margin: 1rem 0; padding-left: 1.5rem; }
li { margin: 0.5rem 0; }

/* Callouts */
.callout { 
  padding: 1rem 1.5rem; 
  border-radius: 12px; 
  margin: 1.5rem 0; 
  border: 1px solid; 
}
.callout-info { background: #ebf8ff; border-color: #90cdf4; color: #2c5282; }
.callout-success { background: #f0fff4; border-color: #9ae6b4; color: #276749; }
.callout-warning { background: #fffaf0; border-color: #fbd38d; color: #975a16; }

/* Badges */
.badge { 
  display: inline-block; 
  padding: 0.2em 0.6em; 
  font-size: 0.75rem; 
  font-weight: 600; 
  border-radius: 9999px; 
}
.badge-primary { background: var(--color-primary); color: white; }
.badge-success { background: #48bb78; color: white; }
.badge-warning { background: #ed8936; color: white; }

/* Cards */
.card { 
  background: var(--color-surface); 
  border: 1px solid var(--color-border); 
  border-radius: 12px; 
  padding: 1.5rem; 
  margin: 1rem 0;
}

/* Utility Classes */
.subtitle { 
  font-size: 1.125rem; 
  color: var(--color-text-light); 
  margin-top: -0.5rem; 
  margin-bottom: 2rem; 
}

.lead { 
  font-size: 1.2rem; 
  line-height: 1.8; 
  color: var(--color-text-light); 
}
`;

export default function CreateThemePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Form state
  const [themeName, setThemeName] = useState("");
  const [themeDescription, setThemeDescription] = useState("");
  const [themeCss, setThemeCss] = useState(STARTER_TEMPLATE);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // UI state
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [validationLenient, setValidationLenient] = useState<ValidationResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wasPublished, setWasPublished] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  // Update preview
  const updatePreview = useCallback(() => {
    if (!iframeRef.current) return;

    const htmlContent = marked.parse(PREVIEW_CONTENT);
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
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

  // Validate CSS (both strict and lenient modes)
  useEffect(() => {
    const strictResult = validateTheme(themeCss, true);
    const lenientResult = validateTheme(themeCss, false);
    setValidation(strictResult);
    setValidationLenient(lenientResult);
  }, [themeCss]);

  const handleLoadSkeleton = () => {
    setThemeCss(generateThemeSkeleton());
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (publish = false) => {
    // Check if authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // For publishing, require full validation
    if (publish) {
      const fullValidation = validateThemeSubmission({
        name: themeName,
        description: themeDescription,
        css: themeCss,
        tags: selectedTags,
      });

      if (!fullValidation.valid) {
        setShowValidation(true);
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem("mpdf_auth_token");
      const response = await fetch("/api/themes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: themeName,
          description: themeDescription,
          css: themeCss,
          tags: selectedTags,
          publish,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setWasPublished(publish);
      } else {
        const data = await response.json();
        setSubmitError(data.error || "Failed to save theme");
      }
    } catch (error) {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navigation />
        <div className="pt-32 text-center max-w-xl mx-auto px-6">
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
            wasPublished ? "bg-emerald-500/10" : "bg-violet-500/10"
          )}>
            <svg
              className={cn("w-10 h-10", wasPublished ? "text-emerald-400" : "text-violet-400")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">
            {wasPublished ? "Theme Published!" : "Theme Saved!"}
          </h1>
          <p className="text-zinc-400 mb-8">
            {wasPublished 
              ? `Your theme "${themeName}" is now live in the Theme Store and available for everyone to use.`
              : `Your theme "${themeName}" has been saved privately. You can find it in your dashboard and share it to the Theme Store later.`
            }
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard/themes"
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              My Themes
            </Link>
            <Button
              onClick={() => {
                setSubmitted(false);
                setWasPublished(false);
                setThemeName("");
                setThemeDescription("");
                setThemeCss(STARTER_TEMPLATE);
                setSelectedTags([]);
              }}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
            >
              Create Another
            </Button>
          </div>
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
            <Link href="/themes" className="hover:text-white transition-colors">
              Theme Store
            </Link>
            <span>/</span>
            <span className="text-zinc-300">Create Theme</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Create a Theme</h1>
              <p className="text-zinc-400">
                Design your own theme and share it with the community
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/docs"
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Schema Docs
              </Link>
              {/* Save Privately Button */}
              <Button
                variant="outline"
                onClick={() => handleSubmit(false)}
                disabled={!themeName || !themeDescription || !validationLenient?.valid || isSubmitting}
                className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : !isAuthenticated ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign in
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Privately
                  </>
                )}
              </Button>
              {/* Publish to Theme Store Button */}
              <Button
                onClick={() => handleSubmit(true)}
                disabled={!themeName || !themeDescription || !validation?.valid || isSubmitting}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50"
                title={!validation?.valid ? `${validation?.coverage.percentage || 0}% complete - fix validation errors to publish` : "Share to Theme Store"}
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Share to Store
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
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-zinc-400 mb-2"
                  >
                    Theme Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                    placeholder="e.g., Modern Professional"
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-zinc-400 mb-2"
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={themeDescription}
                    onChange={(e) => setThemeDescription(e.target.value)}
                    placeholder="A brief description of your theme..."
                    rows={2}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Tags
                  </label>
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSkeleton}
                    className="text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Load Skeleton
                  </button>
                  <span className="text-zinc-700">|</span>
                  <button
                    type="button"
                    onClick={() => setThemeCss(STARTER_TEMPLATE)}
                    className="text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Reset
                  </button>
                </div>
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

            {/* Validation Panel */}
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
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

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-zinc-400">Schema Coverage</span>
                  <span
                    className={cn(
                      "font-medium",
                      validation?.valid ? "text-emerald-400" : "text-amber-400"
                    )}
                  >
                    {validation?.coverage.percentage || 0}%
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all",
                      validation?.valid ? "bg-emerald-500" : "bg-amber-500"
                    )}
                    style={{ width: `${validation?.coverage.percentage || 0}%` }}
                  />
                </div>
              </div>

              {showValidation && validation && (
                <div className="space-y-3 text-sm">
                  {validation.errors.length > 0 && (
                    <div>
                      <h4 className="text-red-400 font-medium mb-2">
                        Errors ({validation.errors.length})
                      </h4>
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
                      <h4 className="text-amber-400 font-medium mb-2">
                        Warnings ({validation.warnings.length})
                      </h4>
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
                    <p className="text-emerald-400">
                      ✓ Theme passes all validation checks
                    </p>
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
      {submitError && (
        <div className="fixed bottom-6 right-6 bg-red-900/90 border border-red-700 text-white px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {submitError}
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              className="ml-2 text-red-300 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="register"
      />
    </div>
  );
}
