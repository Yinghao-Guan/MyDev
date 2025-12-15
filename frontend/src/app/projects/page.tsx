"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  FileCode,
  FileText,
  ChevronRight,
  ChevronDown,
  Play,
  Terminal,
  X,
  Search,
  Activity,
  Cpu,
  BookOpen
} from "lucide-react";
import MemoizedMarkdown from "@/components/ui/MemoizedMarkdown";

// --- [Data Structures] ---

type ProjectFile = {
  name: string;
  type: "readme" | "demo" | "code" | "markdown";
  language?: string;
  content?: string;
};

type Project = {
  id: string;
  name: string;
  files: ProjectFile[];
};

// --- [Veru Content] ---

const VERU_CORE_LOGIC = `import asyncio
from services.openalex import search_openalex
from services.semantic_scholar import search_s2
from services.llm import verify_consistency

async def audit_citation(citation: Citation) -> AuditResult:
    """
    Veru Core Logic: Race Condition Strategy for Multi-Source Verification.
    We query multiple knowledge graphs in parallel to maximize coverage.
    """
    print(f"--- Auditing: {citation.title} ---")

    # 1. Parallel Search on Knowledge Graphs (Async/Await)
    # Launching concurrent tasks to reduce latency
    oa_task = search_openalex(citation.title, citation.author)
    s2_task = search_s2(citation.title, citation.author)
    
    # 2. Race & Fallback Logic
    # Wait for all DBs to respond
    oa_result, s2_result = await asyncio.gather(oa_task, s2_task)

    # Select best candidate based on metadata completeness & year match
    best_paper = select_best_candidate(oa_result, s2_result)

    if not best_paper:
         # Fallback to Google Search Agent if academic DBs fail
         # This uses a headless browser + LLM to parse SERP results
         return await google_search_agent.verify(citation)

    # 3. Semantic Verification (RAG - Retrieval Augmented Generation)
    # The Core Innovation: We don't just check if the paper exists.
    # We compare the User's Claim vs. the Real Abstract to detect hallucinations.
    
    verdict = await verify_consistency(
        user_claim=citation.claim_summary,  # What the user SAID the paper is about
        real_abstract=best_paper.abstract,  # What the paper is ACTUALLY about
        strict_mode=True
    )
    
    return verdict
`;

const VERU_README = `# Veru: AI Citation Auditor

> **Verify ChatGPT/Claude citations against real academic databases instantly.**
> [Visit Live Demo](https://veru.app)

## 📖 About The Project

LLMs like ChatGPT often hallucinate academic citations—inventing papers that sound real but don't exist. **Veru** acts as a forensic auditor for your research.

It extracts citations from your text and cross-references them against massive academic databases to verify their existence and content accuracy.

### Key Features

* **🕵️‍♂️ Anti-Hallucination Extraction**: Uses Gemini 2.0 to strictly extract citations without "autocorrecting" user errors.
* **📚 Multi-Database Verification**:
    * **Tier 1**: Checks **OpenAlex** (250M+ works) with smart title matching.
    * **Tier 2**: Fallback to **Semantic Scholar** if OpenAlex misses.
    * **Tier 3**: Final forensic sweep using **Google Search Grounding**.
* **🧠 Content Consistency Check**: Compares the user's claim against the *actual* abstract to detect mismatched summaries ("stitched" hallucinations).
* **💾 Local History**: Automatically saves your audit sessions locally.

### 🧠 The Audit Pipeline

> **Processing Logic:**
> 1. **User Input** → LLM Extraction
> 2. **Verification Layer**:
>    * Check **OpenAlex** 🟢 (Primary)
>    * *If miss* → Check **Semantic Scholar** 🟡 (Fallback)
>    * *If miss* → Check **Google Search** 🔵 (Grounding)
> 3. **Consistency Check**: Real Abstract vs. User Claim
> 4. **Output**: ✅ Real / 🛑 Fake / ⚠️ Mismatch

## 🛠 Tech Stack

* **Frontend**: Next.js 14, Tailwind CSS, Lucide React
* **Backend**: Python FastAPI, SlowAPI
* **AI & Data**: Google Gemini 2.0 Flash, OpenAlex, Semantic Scholar
* **Infra**: Vercel + Render

## 🚀 Getting Started

1. **Clone the repo**
   \`git clone https://github.com/Yinghao-Guan/Veru.git\`

2. **Setup Backend** (Port 8000)
   \`python -m venv venv && source venv/bin/activate\`
   \`pip install -r requirements.txt\`
   \`python main.py\`

3. **Setup Frontend** (Port 3000)
   \`npm install && npm run dev\`

## 🛡️ Security

* **Rate Limiting**: Protected by \`slowapi\`.
* **Privacy**: No user query retention; history is local-only.

## 📄 License

Distributed under the MIT License.
`;

const VERU_CASE_STUDY = `# Case Study: Engineering Veru

> **Role**: Full Stack Developer
> **Stack**: Python (FastAPI), AsyncIO, Gemini 2.0, Next.js
> **Status**: Production (Live at veru.app)

## 1. The "Why": Beyond Metadata Verification

### The "Stitched Hallucination" Problem
During my research, I noticed a subtle but dangerous behavior in LLMs (ChatGPT/Claude). They often don't just invent papers; they **stitch** real citations with fake findings.
* **Real Paper**: "Cellular Energy Dynamics" by Dr. Guan (2024).
* **Fake Claim**: "This paper proves mitochondria are squares."

**The Gap in Existing Tools**:
Most citation checkers only verify **Existence** (Does this title/author exist?). They fail to verify **Content Consistency** (Does the paper actually support the claim?).

**Veru's Mission**: To act not just as a librarian, but as a **Forensic Auditor**, verifying both existence and semantic accuracy.

---

## 2. Technical Architecture

### The "Race Condition" Strategy (Data Sources)
I needed a balance between **Volume** and **Precision**.
1.  **OpenAlex (Primary)**: Chosen for its massive index (250M+ works) and free API. It handles the "Recall" problem.
2.  **Semantic Scholar (Fallback)**: Used to "fill in the gaps". During testing, I found its abstract and year data to be more precise than OpenAlex.
3.  **Google Search (Grounding)**: The final safety net.

**Logic**:
We launch requests to OpenAlex and Semantic Scholar in parallel. The system prioritizes OpenAlex for coverage but falls back to Semantic Scholar if metadata is incomplete, using a custom scoring algorithm to pick the "Best Candidate".

### AsyncIO & Performance
**Challenge**: Batch processing citations sequentially was prohibitively slow.
**Solution**: Implemented Python \`asyncio\`.
* **Before**: Linear blocking. 5 citations ≈ 15s+.
* **After**: Concurrent execution. 5 citations ≈ 2-3s.
* **Impact**: Massive UX improvement for users checking long literature reviews.

---

## 3. Engineering Challenges

### The "Over-Helpful" AI Paradox
**The Bug**:
Early versions of Veru had a 0% False Positive rate, which was suspicious. When I fed it a fake description of a real paper, Veru marked it as "REAL".

**Root Cause**:
Gemini 2.0 Flash is *too smart*. When extracting citations from user text, it recognized the real paper and **auto-corrected** the user's fake description to match reality before the verification step even began.

**The Fix**:
I had to engineer "Strict Extraction Prompts".
* *Old Prompt*: "Extract the citations."
* *New Prompt*: "Extract citations EXACTLY as written. Do NOT correct user errors. If the user claims 'Sky is Green', extract 'Sky is Green'."

### Why Gemini 2.0 Flash?
* **Cost vs. Intelligence**: It strikes the perfect balance for a free tool.
* **Context Window**: Crucial for processing full abstracts without truncation.

---

## 4. Reflections & Roadmap

### The "Full Stack" Reality
Building Veru taught me that "shipping" is only 50% of the work. The other 50% is the "Brand" — SEO, social media presence, and user trust. Technical excellence needs visibility.

### What's Next?
* **PDF Analysis**: Upload a full paper to check all references at once.
* **Writing Assistant**: Suggesting real literature based on draft content.
* **Plagiarism Detection**: Integration with traditional similarity checks.
`;

const PROJECTS: Project[] = [
  {
    id: "veru",
    name: "Veru_FactCheck",
    files: [
      { name: "Live_Scanner_v1", type: "demo" },
      { name: "hallucination_detector.py", type: "code", language: "python", content: VERU_CORE_LOGIC },
      { name: "README.md", type: "readme", content: VERU_README },
      { name: "CASE_STUDY.md", type: "markdown", content: VERU_CASE_STUDY },
    ]
  },
  {
    id: "mymd",
    name: "MyMD_Compiler",
    files: [
      { name: "Playground", type: "demo" },
      { name: "Grammar.g4", type: "code", language: "java", content: "// Grammar definition coming soon..." },
    ]
  },
];

// --- [Component] Veru Demo Interface ---
type AuditItem = {
    citation_text: string;
    status: "REAL" | "FAKE" | "MISMATCH" | "SUSPICIOUS" | "UNVERIFIED";
    confidence: number;
    message: string;
    source: string;
    metadata?: any;
};

const VeruDemo = () => {
  const [inputText, setInputText] = useState("Devlin et al., 2018 – “BERT: Pre-training of Deep Bidirectional Transformers”\n" +
      "Popularized transformer-based language models.\n" +
      "\n" +
      "'Deep Residual Learning for Image Recognition' by Kaiming He. This paper proposes a new method for cooking spaghetti using neural networks.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResults, setAuditResults] = useState<AuditItem[]>([]);
  const [progress, setProgress] = useState("");

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setAuditResults([]);
    setProgress("Initializing Neural Audit Engine...");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) throw new Error("Backend connection failed");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      setProgress("Scanning knowledge graphs...");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.info) { /* ignore info */ }
            else if (data.error) { console.error(data.error); }
            else { setAuditResults(prev => [...prev, data as AuditItem]); }
          } catch (e) { console.error(e); }
        }
      }
    } catch (error) {
      console.error(error);
      alert("Backend offline or unreachable.");
    } finally {
      setIsAnalyzing(false);
      setProgress("");
    }
  };

  const renderHighlightedText = () => {
    if (auditResults.length === 0) return <p className="text-gray-300 leading-relaxed">{inputText}</p>;
    let content = inputText;
    [...auditResults].sort((a, b) => b.citation_text.length - a.citation_text.length).forEach(item => {
        const colorClass = item.status === "REAL" ? "border-green-500/50 text-green-300" :
                           item.status === "FAKE" ? "bg-red-500/20 border-red-500 text-red-300" :
                           "bg-yellow-500/20 border-yellow-500 text-yellow-300";
        content = content.replace(item.citation_text, `<span class="border-b-2 ${colorClass} pb-0.5 cursor-help" title="${item.status}">${item.citation_text}</span>`);
    });
    return <p className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />;
  };

  const averageScore = auditResults.length > 0 ? Math.round(auditResults.reduce((acc, curr) => acc + (curr.status === "REAL" ? 100 : 0), 0) / auditResults.length) : 0;

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-6 overflow-y-auto">
      {/* Input */}
      <div className="flex-1 flex flex-col min-h-[300px]">
        <div className="flex justify-between items-center mb-2">
           <h3 className="text-green-400 font-bold flex items-center"><Search size={16} className="mr-2"/> Input Text / Abstract</h3>
        </div>
        <div className="flex-1 relative group">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-full bg-[#1e1e1e] border border-gray-700 rounded-lg p-4 text-gray-300 font-mono text-sm focus:outline-none focus:border-green-500 transition-colors resize-none"
            placeholder="Paste academic text here..."
          />
          <div className="absolute bottom-4 right-4">
             <button onClick={handleAnalyze} disabled={isAnalyzing} className={`flex items-center space-x-2 px-4 py-2 rounded font-bold transition-all ${isAnalyzing ? 'bg-gray-700 text-gray-400' : 'bg-green-600 hover:bg-green-500 text-black'}`}>
                {isAnalyzing ? <><Activity size={16} className="animate-spin"/><span>{progress || "Scanning..."}</span></> : <><Cpu size={16}/><span>Run Scan</span></>}
             </button>
          </div>
        </div>
      </div>
      {/* Output */}
      <div className="flex-1 flex flex-col min-h-[300px] border border-gray-800 bg-[#0a0a0a] rounded-lg overflow-hidden relative">
        <div className="bg-[#111] border-b border-gray-800 p-3 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 flex items-center"><Activity size={14} className="mr-2 text-blue-500"/> REPORT</span>
          {auditResults.length > 0 && <span className={`text-xs px-2 py-0.5 rounded ${averageScore > 80 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>Score: {averageScore}%</span>}
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
           {(auditResults.length > 0 || isAnalyzing) && (
             <div>
               <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-2">Verification</h4>
               <div className="text-sm font-mono border-l-2 border-gray-700 pl-4 py-2 bg-gray-900/30 rounded">{renderHighlightedText()}</div>
             </div>
           )}
           <div className="space-y-3 pb-4">
             {auditResults.map((item, idx) => (
                <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} key={idx} className={`p-3 rounded border text-sm ${item.status === "REAL" ? "border-green-900/50 bg-green-900/10" : item.status === "FAKE" ? "border-red-900/50 bg-red-900/10" : "border-yellow-900/50 bg-yellow-900/10"}`}>
                   <div className="flex justify-between items-start mb-1">
                      <span className={`font-bold text-xs px-1.5 py-0.5 rounded ${item.status === "REAL" ? "bg-green-900 text-green-400" : item.status === "FAKE" ? "bg-red-900 text-red-100" : "bg-yellow-900 text-yellow-100"}`}>{item.status}</span>
                      <span className="text-xs text-gray-500">via {item.source}</span>
                   </div>
                   <div className="font-bold text-gray-300 mb-1 line-clamp-1">"{item.citation_text}"</div>
                   <div className="text-xs text-gray-400 opacity-80">{item.message}</div>
                </motion.div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};


// --- [Main Page Component] ---
export default function ProjectsPage() {
  const [activeFile, setActiveFile] = useState<{ projectId: string; file: ProjectFile } | null>({
    projectId: "veru",
    file: PROJECTS[0].files[0]
  });

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ "veru": true, "mymd": false });

  const toggleFolder = (projectId: string) => setExpandedFolders(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  const openFile = (projectId: string, file: ProjectFile) => setActiveFile({ projectId, file });

  const getFileIcon = (type: string, name: string) => {
    if (type === "readme") return <BookOpen size={14} className="text-blue-400" />;
    if (type === "markdown") return <FileText size={14} className="text-purple-400" />;
    if (type === "demo") return <Play size={14} className="text-green-500" />;
    if (name.endsWith(".py")) return <FileCode size={14} className="text-yellow-400" />;
    return <FileCode size={14} className="text-gray-400" />;
  };

  return (
    // [修复 Logic]: h-screen + pt-14 确保占满屏幕且不被 Fixed Navbar 遮挡
    <div className="flex h-screen pt-14 text-sm font-mono overflow-hidden bg-[#0d0d0d] text-gray-300">

      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-[#050505] flex flex-col shrink-0">
        <div className="p-3 text-xs font-bold text-gray-500 tracking-wider flex items-center justify-between select-none">
          <span>EXPLORER</span>
          <Terminal size={12} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-2 py-1">
            <div className="flex items-center text-blue-400 font-bold mb-1 px-1 text-xs select-none">
              <ChevronDown size={14} className="mr-1" />
              PETER_GUAN_PORTFOLIO
            </div>
            {PROJECTS.map((project) => (
              <div key={project.id} className="mb-1">
                <div onClick={() => toggleFolder(project.id)} className={`flex items-center px-2 py-1.5 cursor-pointer hover:bg-gray-800/50 rounded select-none ${expandedFolders[project.id] ? 'text-gray-200' : 'text-gray-500'}`}>
                  {expandedFolders[project.id] ? <ChevronDown size={14} className="mr-1.5" /> : <ChevronRight size={14} className="mr-1.5" />}
                  <Folder size={14} className={`mr-2 ${expandedFolders[project.id] ? "text-yellow-500" : "text-yellow-500/60"}`} />
                  <span className="truncate">{project.name}</span>
                </div>
                <AnimatePresence>
                  {expandedFolders[project.id] && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="ml-4 border-l border-gray-800 pl-1 overflow-hidden">
                      {project.files.map((file) => (
                        <div key={file.name} onClick={() => openFile(project.id, file)} className={`flex items-center px-2 py-1.5 cursor-pointer rounded mb-0.5 transition-colors select-none ${activeFile?.file.name === file.name && activeFile?.projectId === project.id ? "bg-green-900/20 text-green-400" : "hover:bg-gray-800 text-gray-400 hover:text-gray-200"}`}>
                          <span className="mr-2 opacity-80">{getFileIcon(file.type, file.name)}</span>
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Stage */}
      <main className="flex-1 flex flex-col bg-[#0d0d0d] min-w-0">
        {/* Tabs */}
        <div className="h-9 bg-[#050505] border-b border-gray-800 flex items-end px-2 gap-1 overflow-x-auto no-scrollbar">
          {activeFile ? (
            <div className="bg-[#1e1e1e] border-t border-x border-gray-700 text-gray-200 px-3 py-1.5 text-xs flex items-center min-w-fit rounded-t-sm border-t-green-500 select-none">
              {getFileIcon(activeFile.file.type, activeFile.file.name)}
              <span className="mx-2">{activeFile.file.name}</span>
              <X size={12} className="ml-2 cursor-pointer hover:text-red-400" onClick={(e) => { e.stopPropagation(); setActiveFile(null); }} />
            </div>
          ) : <div className="text-gray-600 px-3 py-2 text-xs italic">No file open</div>}
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-hidden relative">
          {activeFile?.file.type === "demo" && activeFile.projectId === "veru" ? (
             <VeruDemo />
          ) : activeFile?.file.content ? (
             <div className="h-full overflow-y-auto p-0">
                {activeFile.file.type === "code" && (
                   <div className="p-6">
                      <div className="text-xs text-gray-500 mb-2 font-mono flex justify-between">
                         <span>{activeFile.file.name}</span>
                         <span>ReadOnly</span>
                      </div>
                      <div className="bg-[#1e1e1e] p-4 rounded-lg border border-gray-800 overflow-x-auto shadow-2xl">
                         <pre className="text-sm font-mono leading-relaxed">
                           <code className="text-gray-300 language-python">
                             {activeFile.file.content}
                           </code>
                         </pre>
                      </div>
                   </div>
                )}

                {(activeFile.file.type === "readme" || activeFile.file.type === "markdown") && (
                   <div className="max-w-3xl mx-auto p-8 prose prose-invert prose-sm">
                      <MemoizedMarkdown content={activeFile.file.content} />
                   </div>
                )}
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-gray-600 opacity-50 select-none">
               <Cpu size={64} className="mb-4" />
               <p>Select a module to engage.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}