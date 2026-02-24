"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { marked } from "marked";
import { cn } from "@/lib/utils";

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
    defaultValue: `# Hello World

This is a **MDX** document.

\`\`\`jsx
export const Component = () => <div>Hello</div>;
\`\`\`

## Features

- Write markdown
- Use JSX components
- Style with CSS
`,
  },
  {
    id: "css",
    label: "styles.css",
    language: "css",
    defaultValue: `/* Document Styles */

body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #333;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #111;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

p {
  margin-bottom: 1rem;
}

code {
  background: #f4f4f4;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
}

pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

pre code {
  background: transparent;
  padding: 0;
}

ul, ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.25rem;
}

strong {
  font-weight: 600;
}
`,
  },
];

export default function CodeEditor() {
  const [activeTab, setActiveTab] = useState<string>("mdx");
  const [mdxContent, setMdxContent] = useState(tabs[0].defaultValue);
  const [cssContent, setCssContent] = useState(tabs[1].defaultValue);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const modelsRef = useRef<Map<string, editor.ITextModel>>(new Map());
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updatePreview = useCallback(() => {
    if (!iframeRef.current) return;

    const htmlContent = marked.parse(mdxContent);
    const fullHtml = `
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

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(fullHtml);
      doc.close();
    }
  }, [mdxContent, cssContent]);

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
        <div className="flex bg-zinc-100 border-b border-zinc-300 px-4 py-2">
          <span className="text-sm font-medium text-zinc-600">Preview</span>
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