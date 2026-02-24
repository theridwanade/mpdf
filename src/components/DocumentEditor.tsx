"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { marked } from "marked";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PDF_BASE_CSS } from "@/lib/pdf-base";
import { themes, getDefaultTheme, DEFAULT_CONTENT, type Theme } from "@/lib/themes";
import { getCommunityThemeById } from "@/lib/theme-store";
import { useAuth } from "@/contexts/AuthContext";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

type EditorTab = "content" | "styles";

interface DocumentEditorProps {
  initialThemeId?: string;
  documentId?: string;
}

export default function DocumentEditor({ initialThemeId, documentId }: DocumentEditorProps) {
  const { user, isAuthenticated } = useAuth();
  
  // Document state
  const [documentName, setDocumentName] = useState("Untitled Document");
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(documentId || null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Editor state
  const [activeTab, setActiveTab] = useState<EditorTab>("content");
  const [mdxContent, setMdxContent] = useState(DEFAULT_CONTENT);
  const [themeCss, setThemeCss] = useState(getDefaultTheme().css);
  const [currentThemeName, setCurrentThemeName] = useState(getDefaultTheme().name);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Load document from database if documentId is provided
  useEffect(() => {
    if (documentId && isAuthenticated) {
      loadDocument(documentId);
    }
  }, [documentId, isAuthenticated]);

  const loadDocument = async (id: string) => {
    try {
      const token = localStorage.getItem("mpdf_auth_token");
      const response = await fetch(`/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setDocumentName(data.document.name);
        setMdxContent(data.document.content);
        setThemeCss(data.document.css);
        setCurrentDocumentId(data.document.id);
        setLastSaved(new Date(data.document.updatedAt));
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Failed to load document:", error);
    }
  };

  // Auto-save on content change (debounced)
  useEffect(() => {
    if (!isAuthenticated || !currentDocumentId) return;
    
    const timeoutId = setTimeout(() => {
      if (hasUnsavedChanges) {
        saveDocument();
      }
    }, 3000); // Auto-save after 3 seconds of no changes
    
    return () => clearTimeout(timeoutId);
  }, [mdxContent, themeCss, documentName, hasUnsavedChanges, currentDocumentId, isAuthenticated]);

  const saveDocument = async () => {
    if (!isAuthenticated) return;
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem("mpdf_auth_token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      
      const body = {
        name: documentName,
        content: mdxContent,
        css: themeCss,
        themeId: initialThemeId || null,
      };
      
      let response;
      if (currentDocumentId) {
        // Update existing document
        response = await fetch(`/api/documents/${currentDocumentId}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify(body),
        });
      } else {
        // Create new document
        response = await fetch("/api/documents", {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });
      }
      
      if (response.ok) {
        const data = await response.json();
        if (!currentDocumentId) {
          setCurrentDocumentId(data.document.id);
        }
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Failed to save document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Load initial theme if provided
  useEffect(() => {
    if (initialThemeId) {
      const communityTheme = getCommunityThemeById(initialThemeId);
      if (communityTheme) {
        setThemeCss(communityTheme.css);
        setCurrentThemeName(communityTheme.name);
      } else {
        const builtInTheme = themes.find((t) => t.id === initialThemeId);
        if (builtInTheme) {
          setThemeCss(builtInTheme.css);
          setCurrentThemeName(builtInTheme.name);
        }
      }
    }
  }, [initialThemeId]);

  // Build final HTML with: System CSS (hidden/enforced) + User-editable Theme CSS
  const getFullHtml = useCallback(() => {
    const htmlContent = marked.parse(mdxContent);
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
/* === SYSTEM CSS (Enforced - Page/Print Settings) === */
${PDF_BASE_CSS}

/* === THEME CSS (Editable) === */
${themeCss}
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
    `;
  }, [mdxContent, themeCss]);

  const updatePreview = useCallback(() => {
    if (!iframeRef.current) return;
    const fullHtml = getFullHtml();
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(fullHtml);
      doc.close();
    }
  }, [getFullHtml]);

  const generatePdf = async () => {
    setIsGenerating(true);
    try {
      const html = getFullHtml();
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Use document name for PDF filename
      const safeName = documentName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      a.download = `${safeName || "document"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Load a theme from the store (copies CSS for editing)
  const loadTheme = (theme: Theme) => {
    setThemeCss(theme.css);
    setCurrentThemeName(theme.name);
    setShowThemeSelector(false);
  };

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  // Focus name input when editing
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleEditorMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setMdxContent(value);
      setHasUnsavedChanges(true);
    }
  };

  const handleCssChange = (value: string | undefined) => {
    if (value !== undefined) {
      setThemeCss(value);
      setHasUnsavedChanges(true);
    }
  };

  const handleNameSubmit = () => {
    setIsEditingName(false);
    if (!documentName.trim()) {
      setDocumentName("Untitled Document");
    }
    setHasUnsavedChanges(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Document Header */}
      <div className="flex items-center justify-between bg-zinc-900 border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Document Name */}
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-violet-400"
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
            {isEditingName ? (
              <input
                ref={nameInputRef}
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                className="bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-white text-sm font-medium focus:outline-none focus:border-violet-500"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                className="text-white font-medium hover:text-violet-400 transition-colors flex items-center gap-2"
              >
                {documentName}
                <svg
                  className="w-3.5 h-3.5 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Current Theme Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-md text-sm">
            <span className="text-zinc-500">Theme:</span>
            <span className="text-zinc-300">{currentThemeName}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500 text-xs">(editable)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Store Link */}
          <button
            type="button"
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Load Theme
          </button>

          {/* Documentation Link */}
          <Link
            href="/docs"
            className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Docs
          </Link>

          {/* Save Button - Only show when authenticated */}
          {isAuthenticated && (
            <Button
              onClick={saveDocument}
              disabled={isSaving || (!hasUnsavedChanges && currentDocumentId !== null)}
              variant="outline"
              className={cn(
                "border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white",
                !hasUnsavedChanges && currentDocumentId && "text-zinc-500"
              )}
            >
              {isSaving ? (
                <>
                  <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </>
              )}
            </Button>
          )}

          {/* Export Button */}
          <Button
            onClick={generatePdf}
            disabled={isGenerating}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
          >
            {isGenerating ? (
              <>
                <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Theme Selector Dropdown */}
      {showThemeSelector && (
        <div className="bg-zinc-900 border-b border-zinc-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">Load a Theme</h3>
            <Link
              href="/themes"
              className="text-xs text-violet-400 hover:text-violet-300"
            >
              Browse Theme Store →
            </Link>
          </div>
          <div className="grid grid-cols-4 lg:grid-cols-6 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => loadTheme(theme)}
                className={cn(
                  "flex flex-col items-start p-3 rounded-lg border transition-all text-left",
                  currentThemeName === theme.name
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50"
                )}
              >
                <div
                  className="w-full h-12 rounded-md mb-2"
                  style={{ background: theme.preview }}
                />
                <span className="text-xs font-medium text-white truncate w-full">
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            Loading a theme copies its CSS into your editor. You can then customize it freely.
          </p>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex flex-1 min-h-0">
        {/* Editor Panel */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e] border-r border-zinc-800">
          {/* Tabs */}
          <div className="flex items-center bg-[#252526] border-b border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === "content"
                  ? "text-white border-violet-500 bg-[#1e1e1e]"
                  : "text-zinc-400 border-transparent hover:text-zinc-200"
              )}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707V19a2 2 0 01-2 2z" />
                </svg>
                Content
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("styles")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === "styles"
                  ? "text-white border-violet-500 bg-[#1e1e1e]"
                  : "text-zinc-400 border-transparent hover:text-zinc-200"
              )}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Styles (CSS)
              </span>
            </button>
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-0">
            {activeTab === "content" ? (
              <MonacoEditor
                height="100%"
                theme="vs-dark"
                language="markdown"
                value={mdxContent}
                onChange={handleContentChange}
                onMount={handleEditorMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                  lineNumbers: "on",
                }}
              />
            ) : (
              <MonacoEditor
                height="100%"
                theme="vs-dark"
                language="css"
                value={themeCss}
                onChange={handleCssChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                  lineNumbers: "on",
                }}
              />
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 flex flex-col bg-zinc-100">
          <div className="flex items-center justify-between bg-white border-b border-zinc-200 px-4 py-2.5">
            <span className="text-sm font-medium text-zinc-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Live Preview
            </span>
            <span className="text-xs text-zinc-400">A4 • Print-ready</span>
          </div>
          <div className="flex-1 bg-zinc-200 p-4 overflow-auto">
            <iframe
              ref={iframeRef}
              title="PDF Preview"
              className="w-full h-full bg-white shadow-lg rounded"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
