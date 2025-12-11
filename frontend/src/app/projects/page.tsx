// src/app/projects/page.tsx
export default function ProjectsPage() {
  return (
    <main className="max-w-5xl mx-auto p-8 font-mono">
      <h1 className="text-3xl font-bold mb-2 text-green-500">
        ~/projects
      </h1>
      <p className="text-gray-500 mb-8 border-b border-gray-800 pb-4">
        Listing all repositories...
      </p>

      {/* 简单的网格布局展示项目 (以后这里可以做得更漂亮) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Card 1 */}
        <div className="border border-gray-800 bg-gray-900/50 p-6 rounded-lg hover:border-green-500/50 transition-colors">
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <span className="text-blue-400 mr-2">def</span>
            Veru( )
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            An academic fact-checking tool designed to combat AI hallucinations.
          </p>
          <div className="flex space-x-2 text-xs text-gray-500">
            <span className="bg-gray-800 px-2 py-1 rounded">Python</span>
            <span className="bg-gray-800 px-2 py-1 rounded">NLP</span>
          </div>
        </div>

        {/* Project Card 2 */}
        <div className="border border-gray-800 bg-gray-900/50 p-6 rounded-lg hover:border-green-500/50 transition-colors">
          <h2 className="text-xl font-bold mb-2 flex items-center">
             <span className="text-yellow-500 mr-2">class</span>
             MyMD
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Custom markup language compiler using ANTLR4.
          </p>
          <div className="flex space-x-2 text-xs text-gray-500">
            <span className="bg-gray-800 px-2 py-1 rounded">Java</span>
            <span className="bg-gray-800 px-2 py-1 rounded">Compiler</span>
          </div>
        </div>
      </div>
    </main>
  );
}