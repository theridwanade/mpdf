"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { marked } from "marked";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

type Tab = {
  id: string;
  label: string;
  language: string;
  defaultValue: string;
};

const tabs: Tab[] = [
  {
    id: "mdx",
    label: "document.mdx",
    language: "markdown",
    defaultValue: `# Professional Report

<div class="subtitle">Generated with MPDF</div>

---

## Executive Summary

This document demonstrates the capabilities of the **MPDF** document generation system. It supports professional typography, precise page control, and beautiful styling.

### Key Features

1. **Full-bleed backgrounds** - Colors extend to page edges
2. **Professional typography** - Optimized for readability
3. **Page break control** - Precise multi-page layouts
4. **CSS variables** - Easy customization

---

<div class="callout callout-info">
  <strong>Pro Tip:</strong> Use CSS variables in the styles.css tab to customize page dimensions, margins, and colors.
</div>

## Code Example

\`\`\`javascript
const generatePDF = async (content) => {
  const response = await fetch('/api/pdf', {
    method: 'POST',
    body: JSON.stringify({ html: content })
  });
  return response.blob();
};
\`\`\`

<div class="page-break"></div>

# Page 2: Tables & Data

## Sample Data Table

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Status</th>
      <th>Priority</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Page Breaks</td>
      <td class="badge badge-success">Complete</td>
      <td>High</td>
    </tr>
    <tr>
      <td>Full-bleed Backgrounds</td>
      <td class="badge badge-success">Complete</td>
      <td>High</td>
    </tr>
    <tr>
      <td>Custom Fonts</td>
      <td class="badge badge-warning">In Progress</td>
      <td>Medium</td>
    </tr>
  </tbody>
</table>

## Layout Classes

Use these utility classes in your HTML:

- \`.page-break\` - Force a new page
- \`.no-break\` - Keep content together
- \`.full-bleed\` - Extend to page edges
- \`.callout\` - Highlighted information box
- \`.text-center\`, \`.text-right\` - Text alignment

<div class="footer">
  <span>Confidential Document</span>
  <span>Page 2 of 2</span>
</div>
`,
  },
  {
    id: "css",
    label: "styles.css",
    language: "css",
    defaultValue: `/* ==============================================
   MPDF - Professional PDF Stylesheet
   ============================================== */

/* ==============================================
   1. PAGE CONFIGURATION
   Modify these CSS variables to control layout
   ============================================== */

:root {
  /* Page Dimensions */
  --page-width: 210mm;
  --page-height: 297mm;
  
  /* Page Margins */
  --page-margin-top: 25mm;
  --page-margin-right: 20mm;
  --page-margin-bottom: 25mm;
  --page-margin-left: 20mm;
  
  /* Color Palette */
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;
  --color-info: #0891b2;
  
  /* Background & Text */
  --page-background: #ffffff;
  --text-color: #1f2937;
  --text-muted: #6b7280;
  --heading-color: #111827;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-serif: 'Georgia', 'Times New Roman', serif;
  --font-mono: 'SF Mono', 'Fira Code', Consolas, monospace;
  
  /* Spacing Scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

/* ==============================================
   2. @PAGE RULES - PDF Output Control
   ============================================== */

@page {
  size: var(--page-width) var(--page-height);
  margin: 0; /* Zero margins for full-bleed support */
}

@page :first {
  margin-top: 0;
}

@page :left {
  margin-left: 0;
}

@page :right {
  margin-right: 0;
}

/* ==============================================
   3. BASE RESET & DEFAULTS
   ============================================== */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 12pt;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

body {
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-color);
  background: var(--page-background);
  padding: var(--page-margin-top) var(--page-margin-right) var(--page-margin-bottom) var(--page-margin-left);
  min-height: 100vh;
  font-feature-settings: 'kern' 1, 'liga' 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

/* ==============================================
   4. PAGE BREAK UTILITIES
   ============================================== */

.page-break,
.page-break-before {
  page-break-before: always !important;
  break-before: page !important;
  margin-top: 0;
  padding-top: var(--page-margin-top);
}

.page-break-after {
  page-break-after: always !important;
  break-after: page !important;
}

.no-break,
.keep-together {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

.avoid-break-after {
  page-break-after: avoid !important;
  break-after: avoid !important;
}

/* ==============================================
   5. FULL-BLEED SUPPORT
   ============================================== */

.full-bleed {
  margin-left: calc(-1 * var(--page-margin-left));
  margin-right: calc(-1 * var(--page-margin-right));
  padding-left: var(--page-margin-left);
  padding-right: var(--page-margin-right);
}

.full-bleed-all {
  margin: calc(-1 * var(--page-margin-top)) calc(-1 * var(--page-margin-right)) calc(-1 * var(--page-margin-bottom)) calc(-1 * var(--page-margin-left));
  padding: var(--page-margin-top) var(--page-margin-right) var(--page-margin-bottom) var(--page-margin-left);
}

/* ==============================================
   6. TYPOGRAPHY
   ============================================== */

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-sans);
  color: var(--heading-color);
  font-weight: 700;
  line-height: 1.3;
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-md);
  page-break-after: avoid;
  break-after: avoid;
}

h1 {
  font-size: 2.25rem;
  letter-spacing: -0.025em;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
  margin-top: 0;
}

h2 {
  font-size: 1.75rem;
  letter-spacing: -0.02em;
  color: var(--color-primary);
}

h3 {
  font-size: 1.375rem;
  letter-spacing: -0.01em;
}

h4 {
  font-size: 1.125rem;
}

h5 {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

h6 {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

p {
  margin-bottom: var(--spacing-md);
  orphans: 3;
  widows: 3;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-top: calc(-1 * var(--spacing-md));
  margin-bottom: var(--spacing-lg);
}

.lead {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-muted);
}

/* ==============================================
   7. LINKS
   ============================================== */

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Print-friendly links */
@media print {
  a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: var(--text-muted);
  }
}

/* ==============================================
   8. LISTS
   ============================================== */

ul, ol {
  margin-bottom: var(--spacing-md);
  padding-left: var(--spacing-lg);
}

li {
  margin-bottom: var(--spacing-xs);
}

li > ul, li > ol {
  margin-top: var(--spacing-xs);
  margin-bottom: 0;
}

/* Custom bullet styling */
ul {
  list-style: none;
}

ul > li::before {
  content: "•";
  color: var(--color-primary);
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

ol {
  list-style: decimal;
}

/* ==============================================
   9. CODE & PREFORMATTED
   ============================================== */

code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: #f3f4f6;
  color: #be185d;
  padding: 0.15em 0.4em;
  border-radius: var(--radius-sm);
}

pre {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.6;
  background: #1e293b;
  color: #e2e8f0;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin-bottom: var(--spacing-md);
  page-break-inside: avoid;
  break-inside: avoid;
}

pre code {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: inherit;
}

/* ==============================================
   10. BLOCKQUOTES
   ============================================== */

blockquote {
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-md) var(--spacing-lg);
  border-left: 4px solid var(--color-primary);
  background: #f8fafc;
  font-style: italic;
  color: var(--text-muted);
}

blockquote p:last-child {
  margin-bottom: 0;
}

/* ==============================================
   11. TABLES
   ============================================== */

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--spacing-lg);
  font-size: 0.9rem;
  page-break-inside: avoid;
}

thead {
  background: var(--color-primary);
  color: white;
}

th, td {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  border: 1px solid #e5e7eb;
}

th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}

tbody tr:nth-child(even) {
  background: #f9fafb;
}

tbody tr:hover {
  background: #f3f4f6;
}

/* ==============================================
   12. HORIZONTAL RULES
   ============================================== */

hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, #d1d5db, transparent);
  margin: var(--spacing-xl) 0;
}

/* ==============================================
   13. IMAGES & FIGURES
   ============================================== */

img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: var(--spacing-md) auto;
}

figure {
  margin: var(--spacing-lg) 0;
  page-break-inside: avoid;
}

figcaption {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-align: center;
  margin-top: var(--spacing-sm);
  font-style: italic;
}

/* ==============================================
   14. CALLOUTS & ALERTS
   ============================================== */

.callout {
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  margin: var(--spacing-lg) 0;
  border-left: 4px solid;
  page-break-inside: avoid;
}

.callout-info {
  background: #ecfeff;
  border-color: var(--color-info);
  color: #164e63;
}

.callout-success {
  background: #f0fdf4;
  border-color: var(--color-success);
  color: #166534;
}

.callout-warning {
  background: #fffbeb;
  border-color: var(--color-warning);
  color: #92400e;
}

.callout-danger {
  background: #fef2f2;
  border-color: var(--color-danger);
  color: #991b1b;
}

/* ==============================================
   15. BADGES
   ============================================== */

.badge {
  display: inline-block;
  padding: 0.2em 0.6em;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge-success {
  background: #dcfce7;
  color: #166534;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}

.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}

.badge-info {
  background: #e0f2fe;
  color: #075985;
}

/* ==============================================
   16. FOOTER
   ============================================== */

.footer {
  position: fixed;
  bottom: var(--page-margin-bottom);
  left: var(--page-margin-left);
  right: var(--page-margin-right);
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
  border-top: 1px solid #e5e7eb;
  padding-top: var(--spacing-sm);
}

/* ==============================================
   17. UTILITY CLASSES
   ============================================== */

.text-center { text-align: center; }
.text-right { text-align: right; }
.text-left { text-align: left; }
.text-justify { text-align: justify; }

.text-muted { color: var(--text-muted); }
.text-primary { color: var(--color-primary); }
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-danger { color: var(--color-danger); }

.font-serif { font-family: var(--font-serif); }
.font-mono { font-family: var(--font-mono); }

.mt-0 { margin-top: 0; }
.mb-0 { margin-bottom: 0; }
.mt-lg { margin-top: var(--spacing-lg); }
.mb-lg { margin-bottom: var(--spacing-lg); }

.hidden-print { display: none !important; }

/* ==============================================
   18. CUSTOM PAGE SIZES (uncomment to use)
   ============================================== */

/* Letter (US):
:root {
  --page-width: 8.5in;
  --page-height: 11in;
}
*/

/* Legal:
:root {
  --page-width: 8.5in;
  --page-height: 14in;
}
*/

/* A4 Landscape:
:root {
  --page-width: 297mm;
  --page-height: 210mm;
}
*/

/* A5:
:root {
  --page-width: 148mm;
  --page-height: 210mm;
}
*/
`,
  },
];

export default function CodeEditor() {
  const [activeTab, setActiveTab] = useState<string>("mdx");
  const [mdxContent, setMdxContent] = useState(tabs[0].defaultValue);
  const [cssContent, setCssContent] = useState(tabs[1].defaultValue);
  const [isGenerating, setIsGenerating] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const modelsRef = useRef<Map<string, editor.ITextModel>>(new Map());
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getFullHtml = useCallback(() => {
    const htmlContent = marked.parse(mdxContent);
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${cssContent}</style>
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

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

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const handleEditorMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Create models for each tab
    for (const tab of tabs) {
      const uri = monaco.Uri.parse(`file:///${tab.id}.${tab.language}`);
      let model = monaco.editor.getModel(uri);
      if (!model) {
        model = monaco.editor.createModel(tab.defaultValue, tab.language, uri);
      }
      modelsRef.current.set(tab.id, model);

      // Listen for changes on each model
      model.onDidChangeContent(() => {
        const content = model.getValue();
        if (tab.id === "mdx") {
          setMdxContent(content);
        } else if (tab.id === "css") {
          setCssContent(content);
        }
      });
    }

    // Set the initial model
    const initialModel = modelsRef.current.get(activeTab);
    if (initialModel) {
      editor.setModel(initialModel);
    }
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
    <div className="flex gap-4 h-[700px]">
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
        <div className="flex-1">
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
      <div className="flex-1 flex flex-col bg-white rounded-lg overflow-hidden border border-zinc-300">
        <div className="flex items-center justify-between bg-zinc-100 border-b border-zinc-300 px-4 py-2">
          <span className="text-sm font-medium text-zinc-600">Preview</span>
          <Button
            size="sm"
            onClick={generatePdf}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Print to PDF"}
          </Button>
        </div>
        <iframe
          ref={iframeRef}
          title="PDF Preview"
          className="flex-1 w-full bg-white"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}