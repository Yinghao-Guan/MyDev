"use client";

import React, { useState, useEffect } from "react";
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
  BookOpen,
  MousePointerClick,
  Github,
  ExternalLink,
  Link as LinkIcon
} from "lucide-react";
import MemoizedMarkdown from "@/components/ui/MemoizedMarkdown";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  github: string;
  live?: string;
  files: ProjectFile[];
};

// --- [Veru Content (保持不变)] ---
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
* **Real Paper**: "Attention Is All You Need" by Ashish Vaswani et al. (2017).
* **Fake Claim**: "The paper introduces a fully convolutional sequence-to-sequence model with attention, enabling parallel training and achieving competitive or state-of-the-art results on WMT machine translation benchmarks." (actually from “Convolutional Sequence to Sequence Learning” by Gehring et al. (2017)）

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

// Grade Calc project
const GRADECALC_README = `# GradeCalc: Statistical Grade Planner

> **A privacy-focused grade calculator built to cure exam anxiety.**
> [Visit Live App](https://grade.peterguan.com)

## 💡 The "Why"
Traditional calculators only tell you *what* you need (e.g., "You need 92%"), but they don't tell you *how hard* that is based on your history. I built GradeCalc to act as a financial risk analyst for your GPA.

## ✨ Key Features
* **Bento Grid UI**: A responsive, editorial-style layout inspired by modern Swiss design.
* **Risk Analysis**: Uses **Standard Deviation** to generate "Safe" vs "Hard" ratings.
* **Visual Feedback**: Stacked bar charts to visualize "Secured" vs "Potential" grades.
* **Privacy First**: 100% Client-side. No data leaves the browser.

## 🧠 How the "AI" Works
Instead of simple subtraction, GradeCalc uses a rule-based statistical algorithm:

1.  **Volatility Check**: Calculates the standard deviation (σ) of your assignment history.
2.  **Z-Score Determination**:
    Calculates how many standard deviations away your goal is from your average.
    \`Z = (Required Final - Average) / σ\`
3.  **Decision Matrix**:
    * If Z > 1.5 (or Gap > 10%): Rated as **Hard** (Requires outperforming your usual self).
    * If Z < 0.5: Rated as **Safe/Normal**.

## 🛠 Tech Stack
* **Core**: Vanilla JS (ES6+), HTML5
* **Styling**: CSS Variables, Glassmorphism
* **Development Time**: 4 Hours (MVP)
`;

const GRADECALC_LOGIC = `// The "Brain" behind the advice
// It uses statistical gap analysis to determine difficulty

function getAdvice(required, currentAvg, sd, t) {
    const gap = required - currentAvg;
    // Safety buffer for standard deviation
    const safeSD = (sd && sd > 1) ? sd : 2;
    
    // Z-Score: How many standard deviations away is the goal?
    const zScore = gap / safeSD;

    if (required > 100) {
        return { text: "Mathematically impossible without extra credit.", style: 'impossible' };
    }
    if (required <= 0) {
        return { text: "Grade secured! You can technically skip the final.", style: 'safe' };
    }

    // Decision Matrix
    // If the goal requires performing > 1.5 SD above average, it's "Hard"
    if (gap > 10 || zScore > 1.5) {
        return { text: \`Requires massive improvement from average (\${currentAvg}). Do or die.\`, style: 'hard' };
    }
    if (gap > 2 || zScore > 0.8) {
        return { text: "Tough but possible if you focus on weak spots.", style: 'warn' };
    }
    
    return { text: "Safe zone based on your strong history.", style: 'safe' };
}`;

const GRADECALC_CASE_STUDY = `# Case Study: Complexity in Simplicity

> **Role**: Product Engineer & Designer
> **Stack**: Vanilla JS, CSS3 Variables, Statistics
> **Timeline**: 4 Hours (Idea to GitHub Pages)

## 1. The Spark: Escaping "Spreadsheet Hell"

### The Friction of Finals Week
It started on a stressful morning before finals. I needed to know exactly what score I needed to secure an 'A' (90%+).
* **The Calculator Trap**: Simple calculators required me to memorize intermediate scores. I got lost in the numbers.
* **The Excel Fatigue**: I tried Excel, then VBA. While I got it working, the context switching was mentally draining. I'd forget what specific cells represented the moment I looked away.
* **The Ad-Filled Web**: Existing online tools were functional but riddled with distracting ads and lacked any form of meaningful analysis.

**The Decision**:
The weighted calculation logic is simple; the friction was entirely in the User Interface. I decided to build a tool that solved the *anxiety*, not just the math.

---

## 2. HCI Insight: From Calculation to "Risk Assessment"

### The Anxiety Gap
My initial goal was just "What do I need to score?". But I realized a deeper psychological issue: **Miscalibrated Anxiety**.
* **Scenario**: I had a 95% average, and the final was only 20% of the grade. I technically only needed a 70% to keep my 'A', yet I was stressing as if I needed a 85%.
* **The Solution**: I moved beyond raw numbers. Instead of just saying "You need 98%", the app provides a **Qualitative Analysis**.

### The "Goal Simulator"
I added a "What-If" slider because everyone's threshold is different. Some struggle to Pass (50%), others fight for an A (90%).
The slider allows for **Marginal Analysis**: "How much harder do I need to study to gain just 1% more in my final grade?" It turns abstract stress into concrete data.

---

## 3. Engineering Decisions: The Art of Restraint

### Why Vanilla JS? (No React?)
As a developer proficient in Next.js, using Vanilla JS was a deliberate choice for **Constraint**:
1.  **Zero-Friction Dev**: No \`npm install\`, no build steps. I could write code in a lightweight editor and test by double-clicking the \`.html\` file.
2.  **Performance**: The site loads instantly. For a single-page utility, downloading a framework bundle is inefficient.
3.  **Portability**: The entire app is just 3 files. It's the ultimate "Serverless" architecture.

### The "Sledgehammer" Trap: LLM vs. Statistics
**Initial Thought**: Connect to an LLM API (like GPT/Gemini) to give study advice based on grades.

**The Pivot**: I realized this was "using a sledgehammer to crack a nut."
* **Latency**: LLMs are slow.
* **Cost**: APIs cost money/tokens.
* **Solution**: I implemented a **Z-Score Algorithm** (Standard Deviation). It statistically predicts the "difficulty" of a goal based on historical grade volatility. It provides the same "advice" value as an LLM, but with **0ms latency** and **zero cost**.

---

## 4. Design & Impact

### Swiss Style & Bento Grids
I chose the Bento Grid layout not just for aesthetics, but for **Mobile Responsiveness**. The modular "box" structure stacks perfectly on phones, which is where I check my grades most often. The "Swiss Style" (high contrast, bold type) keeps the focus on the data, reducing visual clutter.

### The Result
* **Time to Ship**: 4 Hours. This includes the UI iteration (refined with design feedback from Gemini).
* **User Feedback**: Friends who used it found the "Advice" feature surprisingly grounding. It transformed a tool they thought they didn't need into something they now rely on.
`;

const PROJECTS: Project[] = [
  {
    id: "veru",
    name: "Veru_FactCheck",
    github: "https://github.com/Yinghao-Guan/Veru",
    live: "https://veru.app",
    files: [
      { name: "README.md", type: "readme", content: VERU_README },
      { name: "Live_Scanner_v1", type: "demo" },
      { name: "CASE_STUDY.md", type: "markdown", content: VERU_CASE_STUDY },
      { name: "hallucination_detector.py", type: "code", language: "python", content: VERU_CORE_LOGIC },
    ]
  },
  {
    id: "gradecalc",
    name: "GradeCalc_Tool",
    github: "https://github.com/Guaguaaaa/GradeCalc",
    live: "https://grade.peterguan.com",
    files: [
      { name: "README.md", type: "readme", content: GRADECALC_README },
      { name: "App_Preview_v1", type: "demo" },
      { name: "CASE_STUDY.md", type: "markdown", content: GRADECALC_CASE_STUDY }, // <--- 新增这行
      { name: "advice_algorithm.js", type: "code", language: "javascript", content: GRADECALC_LOGIC },
    ]
  },
  {
    id: "mymd",
    name: "MyMD_Compiler",
    github: "https://github.com/Yinghao-Guan/MyMD",
    files: [
      { name: "Playground", type: "demo" },
      { name: "Grammar.g4", type: "code", language: "java", content: "// Grammar definition coming soon..." },
    ]
  },
];

// --- [Component] Veru Demo Interface (保持不变) ---
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

// 定义 Tab 类型
type OpenedTab = {
  projectId: string;
  file: ProjectFile;
};

// --- [Main Page Component] ---
export default function ProjectsPage() {
  // [新状态]:
  // 1. activeTab: 当前聚焦的 Tab (或 null)
  // 2. openTabs: 所有已打开的 Tabs 数组
  const [activeTab, setActiveTab] = useState<OpenedTab | null>(null);
  const [openTabs, setOpenTabs] = useState<OpenedTab[]>([]);

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ "veru": true, "mymd": false });

  const toggleFolder = (projectId: string) => setExpandedFolders(prev => ({ ...prev, [projectId]: !prev[projectId] }));

  // [新逻辑]: 打开文件
  const openFile = (projectId: string, file: ProjectFile) => {
    // 检查是否已存在
    const existingTab = openTabs.find(t => t.projectId === projectId && t.file.name === file.name);

    if (existingTab) {
      // 存在 -> 切换过去
      setActiveTab(existingTab);
    } else {
      // 不存在 -> 添加新 Tab 并切换
      const newTab = { projectId, file };
      setOpenTabs(prev => [...prev, newTab]);
      setActiveTab(newTab);
    }
  };

  // [新逻辑]: 关闭文件
  const closeTab = (e: React.MouseEvent, tabToClose: OpenedTab) => {
    e.stopPropagation();

    // 1. 从列表中移除
    const updatedTabs = openTabs.filter(t => t !== tabToClose);
    setOpenTabs(updatedTabs);

    // 2. 如果关闭的是当前 Tab，则需要计算新的 activeTab
    if (activeTab === tabToClose) {
      if (updatedTabs.length > 0) {
        // 默认切换到最后一个 (VS Code 风格)
        setActiveTab(updatedTabs[updatedTabs.length - 1]);
      } else {
        // 全关了 -> 回到空状态
        setActiveTab(null);
      }
    }
  };

  // 获取文件图标的辅助函数
  const getFileIcon = (type: string, name: string) => {
    if (type === "readme") return <BookOpen size={14} className="text-blue-400" />;
    if (type === "markdown") return <FileText size={14} className="text-purple-400" />;
    if (type === "demo") return <Play size={14} className="text-green-500" />;
    if (name.endsWith(".py")) return <FileCode size={14} className="text-yellow-400" />;
    return <FileCode size={14} className="text-gray-400" />;
  };

  // 计算当前 Project，用于右上角显示链接
  const currentProject = activeTab ? PROJECTS.find(p => p.id === activeTab.projectId) : null;

  return (
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
                {/* Sidebar Project Title */}
                <div className="group flex items-center justify-between pr-2 rounded hover:bg-gray-800/50 cursor-pointer select-none">
                    <div onClick={() => toggleFolder(project.id)} className={`flex-1 flex items-center px-2 py-1.5 ${expandedFolders[project.id] ? 'text-gray-200' : 'text-gray-500'}`}>
                      {expandedFolders[project.id] ? <ChevronDown size={14} className="mr-1.5" /> : <ChevronRight size={14} className="mr-1.5" />}
                      <Folder size={14} className={`mr-2 ${expandedFolders[project.id] ? "text-yellow-500" : "text-yellow-500/60"}`} />
                      <span className="truncate">{project.name}</span>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {project.live && (
                            <a href={project.live} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-500 hover:text-green-400" title="Live Demo">
                                <ExternalLink size={13} />
                            </a>
                        )}
                        <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-500 hover:text-white" title="GitHub Repo">
                            <Github size={13} />
                        </a>
                    </div>
                </div>

                <AnimatePresence>
                  {expandedFolders[project.id] && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="ml-4 border-l border-gray-800 pl-1 overflow-hidden">
                      {project.files.map((file) => {
                        // 检查该文件是否在 activeTab，用于高亮显示
                        const isActive = activeTab?.projectId === project.id && activeTab?.file.name === file.name;
                        return (
                          <div
                            key={file.name}
                            onClick={() => openFile(project.id, file)}
                            className={`flex items-center px-2 py-1.5 cursor-pointer rounded mb-0.5 transition-colors select-none ${isActive ? "bg-green-900/20 text-green-400" : "hover:bg-gray-800 text-gray-400 hover:text-gray-200"}`}
                          >
                            <span className="mr-2 opacity-80">{getFileIcon(file.type, file.name)}</span>
                            <span>{file.name}</span>
                          </div>
                        );
                      })}
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

        {/* [Multi-Tab Bar] */}
        <div className="h-9 bg-[#050505] border-b border-gray-800 flex items-center px-0 gap-0 overflow-x-auto no-scrollbar select-none">

          {/* Loop Render Open Tabs */}
          {openTabs.map((tab, idx) => {
            const isActive = activeTab === tab;
            return (
              <div
                key={`${tab.projectId}-${tab.file.name}`}
                onClick={() => setActiveTab(tab)}
                className={`
                  group relative flex items-center min-w-fit px-3 py-2 text-xs border-r border-gray-800 cursor-pointer transition-colors h-full mt-1
                  ${isActive ? "bg-[#1e1e1e] text-gray-200 border-t border-t-green-500" : "bg-[#050505] text-gray-500 hover:bg-[#111] hover:text-gray-300"}
                `}
              >
                <span className="mr-2">{getFileIcon(tab.file.type, tab.file.name)}</span>
                <span>{tab.file.name}</span>
                {/* Close Button: Always show on hover or if active */}
                <span
                  onClick={(e) => closeTab(e, tab)}
                  className={`ml-2 p-0.5 rounded-sm hover:bg-gray-700 hover:text-white ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                  <X size={12} />
                </span>
              </div>
            );
          })}

          {/* Context Links (Right Aligned) */}
          <div className="flex-1 border-b border-gray-800 h-full" /> {/* Spacer */}

          {currentProject && (
              <div className="flex items-center gap-3 px-3 h-full border-l border-gray-800/50 bg-[#050505]">
                 <span className="hidden md:inline text-xs text-gray-600 mr-1">
                    {currentProject.name}
                 </span>
                 {currentProject.live && (
                     <a href={currentProject.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-green-500 hover:text-green-300 transition-colors bg-green-900/20 px-2 py-1 rounded border border-green-900/50">
                        <ExternalLink size={12} />
                        <span className="font-bold">Live</span>
                     </a>
                 )}
                 <a href={currentProject.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors hover:bg-gray-800 px-2 py-1 rounded">
                    <Github size={12} />
                    <span>Repo</span>
                 </a>
              </div>
          )}
        </div>

        {/* Content Viewer (Controlled by activeTab) */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab?.file.type === "demo" && activeTab.projectId === "veru" ? (
             <VeruDemo />
          )
          /* [Case 2] GradeCalc Demo (Iframe) */
          : activeTab?.file.type === "demo" && activeTab.projectId === "gradecalc" ? (
             <div className="w-full h-full bg-[#F5F5F7]">
                <iframe
                  src="https://grade.peterguan.com"
                  className="w-full h-full border-none"
                  title="GradeCalc Live Preview"
                />
             </div>
          )
          : activeTab?.file.content ? (
             <div className="h-full overflow-y-auto p-0">
                {activeTab.file.type === "code" && (
                   <div className="p-6">
                      <div className="text-xs text-gray-500 mb-2 font-mono flex justify-between">
                         <span>{activeTab.file.name}</span>
                         <span>ReadOnly</span>
                      </div>
                      <SyntaxHighlighter
                          style={vscDarkPlus} // 应用 VSC Dark Plus 主题
                          language={activeTab.file.language || 'text'} // 使用文件定义的语言，如 'python'
                          PreTag="div" // 使用 div 作为容器
                          customStyle={{
                              margin: 0,
                              borderRadius: '8px',
                              background: '#1e1e1e', // 匹配原有的背景色
                              border: '1px solid #333',
                              fontSize: '0.9em',
                              padding: '1rem',
                              lineHeight: '1.4'
                          }}
                      >
                          {activeTab.file.content ? String(activeTab.file.content).replace(/\n$/, '') : ''}
                      </SyntaxHighlighter>
                   </div>
                )}

                {(activeTab.file.type === "readme" || activeTab.file.type === "markdown") && (
                   <div className="max-w-3xl mx-auto p-8 prose prose-invert prose-sm">
                      <MemoizedMarkdown content={activeTab.file.content} />
                   </div>
                )}
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-gray-600 select-none">
               <div className="relative mb-6">
                 <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                 <Cpu size={64} className="relative z-10 text-gray-500" />
               </div>
               <h3 className="text-lg font-bold text-gray-400 mb-2">No File Selected</h3>
               <div className="flex items-center text-sm text-gray-500 bg-gray-900/50 px-4 py-2 rounded border border-gray-800">
                  <MousePointerClick size={16} className="mr-2 animate-bounce" />
                  <span>Select a file from the <strong className="text-gray-300">EXPLORER</strong> to view details.</span>
               </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}