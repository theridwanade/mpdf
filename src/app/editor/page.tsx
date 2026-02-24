"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import DocumentEditor from "@/components/DocumentEditor";
import Navigation from "@/components/Navigation";

function EditorContent() {
  const searchParams = useSearchParams();
  const themeId = searchParams.get("theme") || undefined;

  return <DocumentEditor initialThemeId={themeId} />;
}

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16">
        <div className="h-[calc(100vh-4rem)]">
          <Suspense fallback={<div className="flex items-center justify-center h-full text-zinc-500">Loading editor...</div>}>
            <EditorContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
