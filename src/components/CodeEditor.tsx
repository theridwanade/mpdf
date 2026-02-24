"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { marked } from "marked";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PDF_BASE_CSS } from "@/lib/pdf-base";
import { themes, getDefaultTheme, type Theme } from "@/lib/themes";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

type Tab = {
  id: string;
  label: string;
  language: string;
};

const tabs: Tab[] = [
  { id: "mdx", label: "document.mdx", language: "markdown" },
  { id: "css", label: "styles.css", language: "css" },
];

export default function CodeEditor() {
  const [activeTab, setActiveTab] = useState<string>("mdx");
  const [currentTheme, setCurrentTheme] = useState<Theme>(getDefaultTheme());
  const [mdxContent, setMdxContent] = useState(currentTheme.defaultContent);
  const [cssContent, setCssContent] = useState(currentTheme.css);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const modelsRef = useRef<Map<string, editor.ITextModel>>(new Map());
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Combine base CSS (enforced) + theme CSS (user customizable)
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
/* ========================================
   MPDF SYSTEM STYLES (Enforced - Do Not Modify)
   ======================================== */
${PDF_BASE_CSS}

/* ========================================
   THEME STYLES (User Customizable)
   ======================================== */
${cssContent}
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
    `;
  }, [mdxContent, cssContent]);

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

  const applyTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    setMdxContent(theme.defaultContent);
    setCssContent(theme.css);
    setShowThemeSelector(false);

    // Update Monaco models
    const mdxModel = modelsRef.current.get("mdx");
    const cssModel = modelsRef.current.get("css");
    if (mdxModel) mdxModel.setValue(theme.defaultContent);
    if (cssModel) cssModel.setValue(theme.css);
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

    // Create models with initial theme content
    const initialValues: Record<string, string> = {
      mdx: mdxContent,
      css: cssContent,
    };

    for (const tab of tabs) {
      const uri = monaco.Uri.parse(`file:///${tab.id}.${tab.language}`);
      let model = monaco.editor.getModel(uri);
      if (!model) {
        model = monaco.editor.createModel(
          initialValues[tab.id],
          tab.language,
          uri
        );
      }
      modelsRef.current.set(tab.id, model);

      // Listen for changes
      model.onDidChangeContent(() => {
        const content = model.getValue();
        if (tab.id === "mdx") setMdxContent(content);
        else if (tab.id === "css") setCssContent(content);
      });
    }

    // Set initial model
    const initialModel = modelsRef.current.get(activeTab);
    if (initialModel) editor.setModel(initialModel);
  };

  const switchTab = (tabId: string) => {
    if (!editorRef.current || !modelsRef.current.has(tabId)) return;
    const model = modelsRef.current.get(tabId);
    if (model) {
      editorRef.current.setModel(model);
      setActiveTab(tabId);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[800px]">
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
        <div className="text-xs text-zinc-500">
          System styles enforced for print consistency
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
                className="w-full h-20 rounded-md mb-3"
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
        {/* Editor Panel */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden border border-zinc-700">
          {/* Tab Bar */}
          <div className="flex bg-[#252526] border-b border-zinc-700">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors border-r border-zinc-700",
                  activeTab === tab.id
                    ? "bg-[#1e1e1e] text-white border-t-2 border-t-blue-500"
                    : "text-zinc-400 hover:text-white hover:bg-[#2d2d2d]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-0">
            <MonacoEditor
              height="100%"
              theme="vs-dark"
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
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
