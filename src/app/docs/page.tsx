"use client";

import { useState } from "react";
import Link from "next/link";
import {
  THEME_SCHEMA,
  SCHEMA_CATEGORIES,
  getSelectorsByCategory,
  generateThemeSkeleton,
  type SchemaCategory,
  type SelectorRequirement,
} from "@/lib/theme-schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

export default function DocsPage() {
  const [activeCategory, setActiveCategory] = useState<SchemaCategory>("css-variables");
  const [showSkeleton, setShowSkeleton] = useState(false);
  const grouped = getSelectorsByCategory();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm mb-6">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
              Theme Development Guide
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Theme Schema Documentation
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Create beautiful, print-ready PDF themes. This guide covers all required 
              CSS selectors, properties, and best practices for MPDF theme development.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="border-y border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{THEME_SCHEMA.length}</div>
              <div className="text-sm text-zinc-500">Total Selectors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-400">{THEME_SCHEMA.filter(s => s.required).length}</div>
              <div className="text-sm text-zinc-500">Required</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">{SCHEMA_CATEGORIES.length}</div>
              <div className="text-sm text-zinc-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">
                {THEME_SCHEMA.reduce((acc, s) => acc + s.properties.length, 0)}
              </div>
              <div className="text-sm text-zinc-500">Properties</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  Categories
                </h3>
                <nav className="space-y-1">
                  {SCHEMA_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategory(category.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-all",
                        activeCategory === category.id
                          ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                      )}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span>{category.name}</span>
                      <span className="ml-auto text-xs text-zinc-600">
                        {grouped[category.id].length}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="border-t border-zinc-800 pt-6">
                <Button
                  onClick={() => setShowSkeleton(!showSkeleton)}
                  variant="outline"
                  className="w-full bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 text-white"
                >
                  {showSkeleton ? "Hide" : "View"} Theme Skeleton
                </Button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {/* Skeleton Modal */}
            {showSkeleton && (
              <div className="mb-8 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-800/50 border-b border-zinc-800">
                  <span className="font-medium">Theme Skeleton (Copy & Start)</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(generateThemeSkeleton())}
                    className="text-zinc-400 hover:text-white"
                  >
                    Copy Code
                  </Button>
                </div>
                <pre className="p-4 overflow-x-auto text-sm text-zinc-300 max-h-96 overflow-y-auto">
                  <code>{generateThemeSkeleton()}</code>
                </pre>
              </div>
            )}

            {/* Category Header */}
            {(() => {
              const cat = SCHEMA_CATEGORIES.find((c) => c.id === activeCategory);
              return cat ? (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{cat.icon}</span>
                    <h2 className="text-3xl font-bold">{cat.name}</h2>
                  </div>
                  <p className="text-zinc-400">{cat.description}</p>
                </div>
              ) : null;
            })()}

            {/* Selectors */}
            <div className="space-y-6">
              {grouped[activeCategory].map((selector) => (
                <SelectorCard
                  key={selector.selector}
                  selector={selector}
                  onCopy={copyToClipboard}
                />
              ))}
            </div>

            {grouped[activeCategory].length === 0 && (
              <div className="text-center py-12 text-zinc-500">
                No selectors in this category.
              </div>
            )}
          </main>
        </div>
      </div>

      {/* System CSS Info */}
      <section className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">System CSS Reference</h2>
            <p className="text-zinc-400">
              These utility classes are automatically available in every theme. 
              They're part of the MPDF system CSS and handle pagination and print quality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SystemClassCard
              className=".page-break"
              description="Forces a page break before the element. Use for multi-page documents."
              usage='<div class="page-break"></div>'
            />
            <SystemClassCard
              className=".page-break-after"
              description="Forces a page break after the element."
              usage='<div class="page-break-after">Content</div>'
            />
            <SystemClassCard
              className=".no-break"
              description="Prevents page breaks inside the element. Keeps content together."
              usage='<div class="no-break">Keep together</div>'
            />
            <SystemClassCard
              className=".keep-together"
              description="Alias for .no-break. Prevents content from splitting across pages."
              usage='<div class="keep-together">...</div>'
            />
            <SystemClassCard
              className=".no-print"
              description="Hides element when printing/generating PDF. Screen only."
              usage='<div class="no-print">Screen only</div>'
            />
            <SystemClassCard
              className=".print-only"
              description="Shows element only when printing. Hidden on screen."
              usage='<div class="print-only">Print only</div>'
            />
          </div>
        </div>
      </section>

      {/* CSS Variables Reference */}
      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">CSS Variables Contract</h2>
            <p className="text-zinc-400">
              Every theme must define these CSS custom properties in <code className="text-violet-400">:root</code>. 
              This ensures consistent theming across all components.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="text-left px-6 py-4 font-medium">Variable</th>
                  <th className="text-left px-6 py-4 font-medium">Description</th>
                  <th className="text-left px-6 py-4 font-medium">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {THEME_SCHEMA.find(s => s.selector === ':root')?.properties.map((prop) => (
                  <tr key={prop.property} className="hover:bg-zinc-800/30">
                    <td className="px-6 py-4">
                      <code className="text-violet-400 text-sm">{prop.property}</code>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">{prop.description}</td>
                    <td className="px-6 py-4">
                      {prop.required ? (
                        <span className="text-emerald-400 text-sm">Required</span>
                      ) : (
                        <span className="text-zinc-500 text-sm">Optional</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-zinc-500">
          <span>MPDF Theme Documentation</span>
          <Link href="/" className="text-violet-400 hover:text-violet-300">
            Back to Editor →
          </Link>
        </div>
      </footer>
    </div>
  );
}

// =============================================================================
// Components
// =============================================================================

function SelectorCard({
  selector,
  onCopy,
}: {
  selector: SelectorRequirement;
  onCopy: (text: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => e.key === "Enter" && setExpanded(!expanded)}
        className="flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <code className="text-lg font-mono text-violet-400">
              {selector.selector}
            </code>
            {selector.required && (
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                Required
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400">{selector.description}</p>
        </div>
        <svg
          className={cn(
            "w-5 h-5 text-zinc-500 transition-transform mt-1",
            expanded && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {expanded && (
        <div className="border-t border-zinc-800">
          {/* Properties */}
          <div className="px-6 py-4 bg-zinc-800/20">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Properties
            </h4>
            <div className="space-y-2">
              {selector.properties.map((prop) => (
                <div
                  key={prop.property}
                  className="flex items-center gap-4 text-sm"
                >
                  <code className="text-amber-400 font-mono w-40 shrink-0">
                    {prop.property}
                  </code>
                  <span className="text-zinc-400 flex-1">{prop.description}</span>
                  {prop.required ? (
                    <span className="text-emerald-400 text-xs">Required</span>
                  ) : (
                    <span className="text-zinc-600 text-xs">Optional</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Example */}
          {selector.example && (
            <div className="border-t border-zinc-800">
              <div className="flex items-center justify-between px-6 py-2 bg-zinc-800/30">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Example
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(selector.example || "");
                  }}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Copy
                </button>
              </div>
              <pre className="px-6 py-4 text-sm text-zinc-300 overflow-x-auto bg-zinc-950/50">
                <code>{selector.example}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SystemClassCard({
  className,
  description,
  usage,
}: {
  className: string;
  description: string;
  usage: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <code className="text-violet-400 font-mono text-lg">{className}</code>
      <p className="text-sm text-zinc-400 mt-2 mb-4">{description}</p>
      <pre className="text-xs text-zinc-500 bg-zinc-800/50 px-3 py-2 rounded-lg overflow-x-auto">
        <code>{usage}</code>
      </pre>
    </div>
  );
}
