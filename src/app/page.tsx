import CodeEditor from "@/components/CodeEditor";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">MPDF</h1>
            <p className="text-sm text-zinc-400">
              Create sophisticated PDFs with Markdown & CSS
            </p>
          </div>
        </div>
        <CodeEditor />
      </div>
    </main>
  );
}
