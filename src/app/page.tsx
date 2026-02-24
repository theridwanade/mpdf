import Link from "next/link";
import Navigation from "@/components/Navigation";
import { getFeaturedThemes } from "@/lib/theme-store";

const features = [
  {
    icon: "📝",
    title: "Write in Markdown",
    description:
      "Use familiar Markdown syntax to write your content. No complex formatting tools needed.",
  },
  {
    icon: "🎨",
    title: "Style with CSS",
    description:
      "Full CSS control over every element. Create unique designs that match your brand.",
  },
  {
    icon: "📄",
    title: "Export to PDF",
    description:
      "Generate print-ready PDFs with perfect typography, page breaks, and color accuracy.",
  },
  {
    icon: "🎭",
    title: "Theme Store",
    description:
      "Browse community themes or create your own. Share and discover beautiful designs.",
  },
  {
    icon: "✅",
    title: "Schema Validation",
    description:
      "Built-in validation ensures your themes work correctly across all documents.",
  },
  {
    icon: "🚀",
    title: "Instant Preview",
    description:
      "See your changes in real-time. What you see is exactly what you'll get in PDF.",
  },
];

const useCases = [
  {
    title: "Business Reports",
    description: "Create professional quarterly reports, proposals, and executive summaries.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Resumes & CVs",
    description: "Design standout resumes with custom layouts and typography.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    title: "Documentation",
    description: "Generate beautiful technical docs, user guides, and API references.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Academic Papers",
    description: "Format research papers, theses, and scholarly articles.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    title: "Marketing Materials",
    description: "Design one-pagers, brochures, and promotional PDFs.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "Invoices & Contracts",
    description: "Create professional business documents with consistent branding.",
    gradient: "from-slate-500 to-zinc-500",
  },
];

export default function Home() {
  const featuredThemes = getFeaturedThemes();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-transparent to-transparent" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm mb-8">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
              The future of PDF creation
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Create{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                stunning PDFs
              </span>
              <br />
              with Markdown & CSS
            </h1>
            
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Write content in Markdown, style with CSS, and export beautiful, print-ready PDFs. 
              Choose from community themes or create your own.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/editor"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
              >
                Start Creating
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/themes"
                className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-all border border-zinc-700"
              >
                Browse Themes
              </Link>
            </div>
          </div>

          {/* Preview Image Placeholder */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-zinc-500 ml-2">MPDF Editor</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 h-80">
                <div className="bg-zinc-800/50 rounded-lg p-4 font-mono text-sm text-zinc-400">
                  <div className="text-violet-400"># My Document</div>
                  <div className="mt-2 text-zinc-500">Write your content here...</div>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded w-48 mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-zinc-200 rounded w-full" />
                    <div className="h-3 bg-zinc-200 rounded w-5/6" />
                    <div className="h-3 bg-zinc-200 rounded w-4/6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to create perfect PDFs
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              A complete toolkit for designers, developers, and content creators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 border-t border-zinc-800 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for every use case
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              From business documents to creative projects, MPDF handles it all.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="group relative p-6 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all"
              >
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br ${useCase.gradient}`}
                />
                <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                <p className="text-zinc-400 text-sm">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Themes Section */}
      <section className="py-24 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Featured Themes
              </h2>
              <p className="text-zinc-400">
                Start with a professionally designed theme
              </p>
            </div>
            <Link
              href="/themes"
              className="text-violet-400 hover:text-violet-300 font-medium flex items-center gap-2"
            >
              View all themes
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredThemes.slice(0, 3).map((theme) => (
              <Link
                key={theme.id}
                href={`/themes/${theme.id}`}
                className="group block bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all"
              >
                <div
                  className="h-32 transition-transform group-hover:scale-105"
                  style={{ background: theme.preview }}
                />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{theme.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {theme.rating.average}
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm mb-3">{theme.description}</p>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{theme.downloads.toLocaleString()} downloads</span>
                    <span>by {theme.author.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to create beautiful PDFs?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Start for free. No sign-up required.
          </p>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/25"
          >
            Open Editor
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="font-semibold">MPDF</span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-zinc-400">
              <Link href="/editor" className="hover:text-white transition-colors">Editor</Link>
              <Link href="/themes" className="hover:text-white transition-colors">Themes</Link>
              <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
            </nav>
            <p className="text-sm text-zinc-500">
              © 2026 MPDF. Open source.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
