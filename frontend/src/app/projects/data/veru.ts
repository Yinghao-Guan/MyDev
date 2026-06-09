import type { Project } from "./types";

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
* **Fake Claim**: "The paper introduces a fully convolutional sequence-to-sequence model with attention, enabling parallel training and achieving competitive or state-of-the-art results on WMT machine translation benchmarks." (actually from "Convolutional Sequence to Sequence Learning" by Gehring et al. (2017)）

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

const veru: Project = {
  id: "veru",
  name: "Veru_CitationAuditor",
  github: "https://github.com/Yinghao-Guan/Veru",
  live: "https://veru.app",
  files: [
    { name: "README.md", type: "readme", content: VERU_README },
    { name: "Live_Scanner_v1", type: "demo" },
    { name: "CASE_STUDY.md", type: "markdown", content: VERU_CASE_STUDY },
    { name: "hallucination_detector.py", type: "code", language: "python", content: VERU_CORE_LOGIC },
  ],
};

export default veru;
