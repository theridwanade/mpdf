"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { marked } from "marked";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PDF_BASE_CSS } from "@/lib/pdf-base";
import { themes, getDefaultTheme, DEFAULT_CONTENT, type Theme } from "@/lib/themes";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function CodeEditor() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getDefaultTheme());
  const [mdxContent, setMdxContent] = useState(DEFAULT_CONTENT);
  const [userCss, setUserCss] = useState(""); // User's custom CSS additions
  const [isGenerating, setIsGenerating] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build final HTML with: System CSS (hidden) + Theme CSS + User CSS (optional)
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
${PDF_BASE_CSS}
${currentTheme.css}
${userCss}
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
    `;
  }, [mdxContent, currentTheme.css, userCss]);

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
      a.download = "document.pdf";
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

  // Switching theme only changes CSS, NOT content
  const applyTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    setShowThemeSelector(false);
    // Content stays the same - only styling changes
  };

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const handleEditorMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setMdxContent(value);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[850px]">
      {/* Theme Selector Bar */}
      <div className="flex items-center justify-between bg-zinc-800 rounded-lg px-4 py-3 border border-zinc-700">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-zinc-400">Theme:</span>
          <button
            type="button"
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: currentTheme.preview }}
            />
            <span className="text-sm font-medium text-white">
              {currentTheme.name}
            </span>
            <svg
              className={cn(
                "w-4 h-4 text-zinc-400 transition-transform",
                showThemeSelector && "rotate-180"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">
            Page format: A4 • Print-ready
          </span>
        </div>
      </div>

      {/* Theme Dropdown */}
      {showThemeSelector && (
        <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-4 grid grid-cols-3 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => applyTheme(theme)}
              className={cn(
                "flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left",
                currentTheme.id === theme.id
                  ? "border-blue-500 bg-zinc-700"
                  : "border-zinc-600 hover:border-zinc-500 hover:bg-zinc-700/50"
              )}
            >
              <div
                className="w-full h-16 rounded-md mb-3"
                style={{ background: theme.preview }}
              />
              <span className="text-sm font-semibold text-white">
                {theme.name}
              </span>
              <span className="text-xs text-zinc-400 mt-1">
                {theme.description}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Editor + Preview */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Editor Panel - Only Markdown */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden border border-zinc-700">
          <div className="flex items-center bg-[#252526] border-b border-zinc-700 px-4 py-2">
            <span className="text-sm font-medium text-white">document.mdx</span>
          </div>
          <div className="flex-1 min-h-0">
            <MonacoEditor
              height="100%"
              theme="vs-dark"
              language="markdown"
              value={mdxContent}
              onChange={handleEditorChange}
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
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col bg-zinc-100 rounded-lg overflow-hidden border border-zinc-300">
          <div className="flex items-center justify-between bg-white border-b border-zinc-200 px-4 py-2">
            <span className="text-sm font-medium text-zinc-600">Preview</span>
            <Button
              size="sm"
              onClick={generatePdf}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Print to PDF"}
            </Button>
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
