import Link from "next/link";
import CodeEditor from "@/components/CodeEditor";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">MPDF</h1>
              <p className="text-sm text-zinc-400">
                Create sophisticated PDFs with Markdown & CSS
              </p>
            </div>
          </div>
          <Link
            href="/docs"
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Theme Documentation
          </Link>
        </div>
        <CodeEditor />
      </div>
    </main>
  );
}
