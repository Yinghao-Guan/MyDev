// --- Types ---
export type ProjectFile = {
  name: string;
  type: "readme" | "demo" | "code" | "markdown";
  language?: string;
  content?: string;
};

export type Project = {
  id: string;
  name: string;
  github?: string;
  live?: string;
  devpost?: string;
  files: ProjectFile[];
};

// --- Content Constants ---
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

// RealiBuddy
const REALIBUDDY_README = `# RealiBuddy: The Real-Time AI Lie Detector

> **🏆 "Best AI/ML Award" Winner @ HackCC Hackathon**
> *Refactored v2.0: Portfolio Edition (Pure Software & Simulation)*

## 🏆 The Original Team
This project originates from a 4-person team effort at HackCC.
While this v2.0 is a solo refactor for demonstration, the core concept and original UI design belong to the team:

* **[Sean Esla](https://github.com/seanesla)** - Original Frontend & UI Lead
* **[Justin Alexander](https://github.com/juhsztn)** - Product Documentation & Pitch
* **[Jonathan Aung](https://github.com/Aung-Khant)** - Concept Ideation & Strategy
* **Peter Guan** - Full Stack Refactor (v2.0) & Original Backend Logic

> *Note: The UI in this portfolio version is a React reimplementation faithfully recreating the original design by Sean Esla.*

## 💡 The Concept
RealiBuddy began as a wild Hackathon experiment: an AI that literally **shocked** you (via a Pavlok wearable) when you lied.
**Version 2.0** is a complete architectural rewrite designed for the web. It preserves the "cyberpunk interrogation" soul of the original but decouples it from proprietary hardware and expensive enterprise APIs, transforming it into a seamless, browser-based demonstration of prompt engineering and modern web architecture.

## 🛠 Tech Stack (v2.0)
* **Brain**: Google Gemini 2.0 Flash (Context-Aware Reasoning)
* **Frontend**: React + TypeScript + Next.js
* **Backend**: Python (FastAPI)
* **Voice Input**: Web Speech API (Browser Native, Zero Latency)
* **Visuals**: Custom Canvas Hooks (Particle Animation)

## 🔄 Architecture Evolution: Why v2.0?
This version demonstrates the transition from a hardware prototype to a production-ready Web Agent.

| Feature | Hackathon Origin (v1.0) | Portfolio Demo (v2.0) |
| :--- | :--- | :--- |
| **Verification** | Perplexity API (External Search) | **Gemini + Google Search Tool** |
| **Logic** | Static Knowledge base | **Live Grounding (RAG)** |
| **I/O** | WebSocket Binary Stream | **Optimized REST + Web Speech API** |
| **Feedback** | Physical Shock (Pavlok IoT) | **Visual & Audio Alert System** |

## 🚀 How it Works (The Audit Pipeline)
1.  **Listen**: The browser's native \`SpeechRecognition\` captures audio locally.
2.  **Verify (The Core)**: The statement is sent to the FastAPI backend. Unlike traditional LLMs, the system triggers **Gemini 2.0's Google Search Tool**.
3.  **Cross-Reference**: The AI performs a multi-step search query to verify the claim against the most recent web data (News, Academic, or Official sources).
4.  **Adjudicate**: Gemini interprets the search results and generates a JSON verdict:
    * **TRUE**: Statement aligns with grounded search data.
    * **FALSE**: Mismatch detected between claim and reality.
    * **UNVERIFIABLE**: Insufficient data found on the live web.
5.  **Feedback**: The UI triggers high-frequency canvas animations and synthesized speech feedback based on the verdict.

## ⚖️ The "Nuance" Engine
By integrating **Google Search Grounding**, v2.0 solves the "Recency Problem" that plagues standard LLMs. Whether it's yesterday's news or a specific historical date, the system provides forensic-level verification with cited evidence.
`;

const REALIBUDDY_CASE_STUDY = `# Case Study: RealiBuddy (Evolution)

> **Role**: Lead Developer & Architect
> **Stack**: Python (FastAPI), React, Google Gemini 2.0, Web Speech API
> **Origin**: "Best AI/ML Award" Winner @ HackCC
> **Status**: Refactored for Web (v2.0)

## 1. The Pivot: Why Refactor?

### Escaping "Dependency Hell"
The original v1.0 was a hardware-integrated prototype relying on a teammate's **Pavlok** shock bracelet and enterprise API keys (Deepgram, Perplexity) that were no longer active. To preserve the project as a live portfolio piece, I had to make a hard pivot.

### The Migration Strategy
I established three core goals for v2.0:
1.  **Sustainability**: Replace pay-per-use APIs with **Gemini 2.0 Flash** (Cost-efficient & Smart).
2.  **Simulation**: Replace physical hardware shocks with **Visual/Audio feedback loops** to mimic the original experience in a browser.
3.  **Modernization**: Migrate from a messy jQuery script to a type-safe **Next.js/React** architecture.

---

## 2. The "De-Engineering" Philosophy

### Breaking the "Complexity Addiction"
Hackathons often reward complexity—WebSockets, binary streams, and microservices are seen as "cool." However, when porting RealiBuddy for my portfolio, I realized that complexity is a liability for longevity.
In v1.0, we used a heavy WebSocket architecture to stream audio. For v2.0, I made a deliberate choice to **downgrade** the stack:
* **WebSocket → REST**: Removed the need for stateful connections.
* **Server-Side STT → Client-Side STT**: Offloaded processing to the browser.

**Key Insight**:
*"Choosing the right tool is more important than choosing the complex tool."*
By simplifying the architecture, I reduced the "Time to First Byte" (TTFB) and eliminated 90% of potential connection errors, proving that optimization often means doing *less*, not more.

---

## 3. The Logic Challenge: "The People Pleaser" Problem

### Fighting LLM Politeness
During the transition from Perplexity (Search) to Gemini (Reasoning), I encountered an unexpected behavioral issue: **The AI was too polite.**
When a user made a blatantly false but harmless claim (e.g., *"I can run at the speed of light"*), the default model would often respond with nuance: *"That is physically impossible, but perhaps you mean it metaphorically?"*

**The "Bad Cop" Solution**:
A lie detector cannot be diplomatic. I had to engineer a **"Ruthless Persona"** using System Instructions:
1.  **Bypass Filters**: Explicitly instructed the model to ignore social niceties for the sake of "gameplay."
2.  **Binary Verdicts**: Forced the output into a strict JSON schema that only allows \`TRUE\` or \`FALSE\`, banning ambiguous terms like \`UNLIKELY\`.
3.  **Result**: The AI shifted from a "Helpful Assistant" to a "Strict Adjudicator," instantly flagging exaggerations as lies.

---

## 4. The Frontend Challenge: The "Ship of Theseus"

### Porting Chaos to Order
The original v1.0 UI was "Spaghetti Code"—a single JavaScript file manipulating the DOM directly to create cyberpunk particle effects and glitches.
The challenge in v2.0 was **porting this visual chaos into React's strict component lifecycle** without losing the soul of the original design.

**The Implementation**:
* **State vs. Animation**: I separated the React state (logic/verdicts) from the animation loop (visuals).
* **React Refs**: Used \`useRef\` to bypass React's virtual DOM for the high-frequency canvas updates required by the "Lie Detected" strobe effects.
* **Outcome**: The v2.0 UI looks *exactly* identical to v1.0 pixel-for-pixel, but the underlying codebase is now modular, type-safe, and maintainable.

---

## 5. Final Reflections

### From "Shock Value" to "Software Value"
RealiBuddy started as a hardware prank—shocking people for fun. By stripping away the hardware (Pavlok) and the expensive APIs (Deepgram), I was forced to rely on pure software engineering to deliver the same impact.
The result is a project that is no longer defined by the gadgets attached to it, but by the seamless integration of Browser APIs, LLM Reasoning, and Reactive UI.
`;

const REALIBUDDY_GEMINI_SERVICE = `import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '../utils/config.js';

export class GeminiService {
    private client: GoogleGenAI;

    constructor() {
        this.client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    }

    async checkFact(claim: string): Promise<FactCheckResult> {
        // 1. Context Awareness
        const now = new Date();
        const currentDateTime = now.toLocaleString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });

        // 2. The "Strict" System Prompt (Migrated from Perplexity)
        const systemPrompt = "You are a forensic fact-checker.
            CRITICAL CONTEXT:
            - Current Date: \${currentDateTime}
            
            RULES:
            1. **Subjectivity**: Opinions ("I think...", "It's ugly") are UNVERIFIABLE.
            2. **Recency**: Use Google Search for ANY event in the last 12 months.
            3. **Strictness**: If a user gets a specific date/number wrong, it is FALSE.
               - Claim: "Titanic sank in 1915" -> FALSE (It was 1912).
            4. **Hallucination Prevention**: If you cannot find a source, return "unverifiable".
            
            RESPONSE FORMAT (JSON):
            {
              "verdict": "true" | "false" | "unverifiable",
              "confidence": 0.0-1.0,
              "evidence": "Brief correction with [Source Name] citation."
            }";

        // 3. Call Gemini with Search Tool
        const response = await this.client.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [
                { role: 'user', parts: [{ text: systemPrompt }, { text: \`Verify: "\${claim}"\` }] }
            ],
            config: {
                tools: [{ google_search: {} }], // Native Search Grounding
                responseMimeType: 'application/json'
            }
        });

        return JSON.parse(response.text());
    }
}
`;

const REALIBUDDY_HANDLER = `import { WebSocket } from 'ws';
import { GeminiService } from '../services/gemini.js';

// Cleaned up Handler: No Pavlok, No Deepgram, Just Logic.
export function handleConnection(ws: WebSocket) {
    const gemini = new GeminiService();

    console.log('Client connected for Truth Audit...');

    ws.on('message', async (data) => {
        try {
            // Expecting simplified JSON: { type: "claim", text: "..." }
            const msg = JSON.parse(data.toString());

            if (msg.type === 'claim') {
                // 1. Notify client: Thinking...
                ws.send(JSON.stringify({ type: 'status', status: 'analyzing' }));

                // 2. Perform Audit
                const result = await gemini.checkFact(msg.text);

                // 3. Send Verdict
                ws.send(JSON.stringify({
                    type: 'result',
                    verdict: result.verdict,
                    confidence: result.confidence,
                    evidence: result.evidence
                }));
            }
        } catch (error) {
            ws.send(JSON.stringify({ type: 'error', message: error.message }));
        }
    });
}
`;

// --- MyMD Content Constants ---

const MYMD_README = `# MyMD: Custom Markup Language Compiler

> **A desktop-grade markup editor built from scratch using Compiler Construction principles.**
> *Featuring Live AST Visualization & LaTeX Export.*

## 💡 The Core Concept
MyMD is not just a text editor; it is a full-fledged **Compiler** frontend.
While most markdown editors rely on regex replacement (which is fragile), MyMD defines a formal **Context-Free Grammar (CFG)** using ANTLR4. It parses your text into a Concrete Syntax Tree (CST), transforms it into an Abstract Syntax Tree (AST), and compiles it into multiple targets (HTML, LaTeX).

## 🚀 Tech Stack

### Core Compiler
* **Lexer & Parser**: ANTLR 4.13 (Adaptive LL(*) parsing)
* **Language**: Java 21 (OpenJDK)
* **Intermediate Representation**: Pandoc JSON AST
* **Unit Testing**: JUnit 5

### Application Layer
* **GUI Framework**: JavaFX (OpenJFX) with WebView
* **Build System**: Maven
* **Integration**: Pandoc CLI (Backend Renderer)

## 🛠️ Architecture Pipeline

The system follows a classic compiler pipeline architecture:

\`\`\`text
[ Source Code (.mymd) ]
        │
        ▼
╭──────────────────────╮
│       LEXER          │ ──▶  Generate Tokens
╰──────────────────────╯
        │
        ▼
╭──────────────────────╮
│    PARSER (ANTLR)    │ ──▶  Concrete Syntax Tree (CST)
╰──────────────────────╯      (Raw Grammar Nodes)
        │
        ▼
╭──────────────────────╮
│     AST VISITOR      │ ──▶  Pandoc JSON AST
╰──────────────────────╯      (Abstract Structure)
        │
        ▼
╭──────────────────────╮
│    PANDOC BACKEND    │ ──▶  Final Compilation
╰──────────────────────╯
        │
        ├───────────────────────┐
        ▼                       ▼
 [ Target: HTML ]        [ Target: LaTeX ]
   (Live Preview)          (Academic PDF)
\`\`\`

## ✨ Key Features
* **Formal Grammar Definition**: A robust \`.g4\` grammar file defining recursive rules for nested styles (e.g., **Bold inside *Italic***).
* **Split-Pane Live Preview**: Real-time rendering via an embedded browser engine.
* **Academic Ready**: First-class support for Block Math (\`$$\`) and Inline Math (\`$\`) using MathJax.
* **Universal Export**: Compiles to standard \`.tex\` files for professional academic typesetting.
`;

const MYMD_CASE_STUDY = `# Case Study: Engineering a Language

> **Role**: Language Engineer
> **Stack**: Java, ANTLR4, JavaFX
> **Focus**: Compiler Design & AST Transformations

## 1. The Challenge: Regex vs. Recursion

### The "Parsing" Trap
When I started building a markup editor, my first instinct was to use Regular Expressions.
* **Problem**: Regex parses text linearly. It fails miserably with **Nested Structures**.
* **Example**: How do you parse \`**Bold and *Italic* mixed**\`? Regex struggles to match the correct closing tags.

### The Solution: Context-Free Grammar (CFG)
I decided to treat this as a Compiler Engineering problem. I defined a formal grammar using **ANTLR4** (Another Tool for Language Recognition).
* **Recursive Rules**: In \`MyMD.g4\`, I defined an \`inline\` rule that can recursively contain other \`inline\` elements. This allows for infinite nesting depth, handled naturally by the parser's stack.

---

## 2. The "Bridge": AST Transformation

### Concrete vs. Abstract
ANTLR produces a **Parse Tree** (Concrete Syntax Tree) that exactly matches the grammar rules (including useless tokens like whitespace or brackets).
To make the data useful, I had to build a **Visitor** pattern (\`PandocAstVisitor.java\`) to transform this raw tree into a clean **Abstract Syntax Tree (AST)**.

### Why Pandoc AST?
Instead of inventing my own AST format, I targeted the **Pandoc JSON** standard.
* **Interoperability**: By outputting a standard AST, MyMD essentially became a "Frontend" for the massive Pandoc ecosystem.
* **Result**: I wrote the parser, but I instantly gained support for exporting to PDF, Docx, and LaTeX for free.

---

## 3. The Future: "Web Assembly" Migration

### The JavaFX Limitation
While JavaFX provided a quick way to build a desktop GUI, it locked the application to the user's local machine and required a heavy JDK installation.

### Roadmap: Refactoring to TypeScript
I am currently porting the core logic to the Web:
1.  **Grammar Portability**: ANTLR4 supports generating **TypeScript** parsers from the exact same \`.g4\` grammar file.
2.  **Client-Side Compilation**: Moving the parsing logic from the Java Backend to the Browser.
3.  **Virtual DOM Mapping**: Instead of mapping AST to Pandoc JSON, I will map AST nodes directly to React Components for a sub-millisecond Live Preview.
`;

const MYMD_PARSER = `grammar MyMD;

// ======================= Parser Rules =======================

document
    : block+ EOF
    ;

block
    : horizontalRule          # HorizontalRuleBlock
    | blockquote              # BlockQuoteBlock
    | bulletListBlock         # BulletListRule
    | codeBlock               # CodeBlockRule
    | header                  # HeaderRule
    | blockMath               # BlockMathRule
    | paragraph               # ParagraphBlock
    ;

horizontalRule
    : (DASH DASH DASH+ | STAR STAR STAR+) (SOFT_BREAK | PARAGRAPH_END | EOF)
    ;

blockquote
    : GT SPACE? inline+ (PARAGRAPH_END | EOF)
    ;

header
    : (H1 | H2 | H3 | H4 | H5 | H6) inline+ (PARAGRAPH_END | EOF)
    ;

paragraph
    : inline+ (PARAGRAPH_END | EOF)
    ;

blockMath
    : BLOCK_MATH (PARAGRAPH_END | EOF)?
    ;

bulletListBlock
    : bulletList (PARAGRAPH_END | EOF)?
    ;

codeBlock
    : CODE_BLOCK (PARAGRAPH_END | EOF)?
    ;

bulletList
    : listItem+
    ;

listItem
    : DASH SPACE inline+ (SOFT_BREAK | PARAGRAPH_END)
    ;

// Inline elements.
inline
    : image                   # ImageInline
    | link                    # LinkInline
    | bold                    # BoldInline
    | italic                  # ItalicInline
    | INLINE_MATH             # InlineMathInline
    | INLINE_CODE             # InlineCodeInline
    | citation                # CitationInline
    | lbracket                # LBracketInline
    | rbracket                # RBracketInline
    | bang                    # BangInline
    | gt                      # GtInline
    | lparen                  # LParenInline
    | rparen                  # RParenInline
    | urlText                 # UrlTextInline
    | dash                    # DashInline
    | star                    # StarInline
    | HARD_BREAK              # HardBreakInline
    | SOFT_BREAK              # SoftBreakInline
    | ESCAPED                 # EscapedInline
    | TEXT                    # TextInline
    | SPACE                   # SpaceInline
    ;

citation : CITATION ;
lbracket : LBRACKET ;
rbracket : RBRACKET ;
bold     : '**' inline+ '**' ;
italic   : '*' inline+ '*' ;

bang     : BANG ;
gt       : GT ;
lparen   : LPAREN ;
rparen   : RPAREN ;
urlText  : URL_TEXT ;
dash     : DASH ;
star     : STAR ;

image : BANG LBRACKET inline* RBRACKET LPAREN url RPAREN ;
link  : LBRACKET inline+ RBRACKET LPAREN url RPAREN ;

url : (URL_TEXT | DASH | STAR | TEXT)+ ;

// ======================= Lexer Rules =======================

HARD_BREAK
    : '  ' ('\\r'? '\\n')
    | '\\\\'
    ;
PARAGRAPH_END : ('\\r'? '\\n') ('\\r'? '\\n')+ ;
SOFT_BREAK : '\\r'? '\\n' ;

INLINE_MATH : '$' ~[$]+ '$' ;
BLOCK_MATH: '$$' ( . | '\\r' | '\\n' )*? '$$' ;
INLINE_CODE : '\`' ~[\`\\r\\n]+ '\`' ;
CODE_BLOCK : '\`\`\`' ( . | '\\r' | '\\n' )*? '\`\`\`' ;
CITATION : '[' '@' [a-zA-Z0-9_:-]+ ']' ;

H1 : '#' [ \\t]+ ;
H2 : '##' [ \\t]+ ;
H3 : '###' [ \\t]+ ;
H4 : '####' [ \\t]+ ;
H5 : '#####' [ \\t]+ ;
H6 : '######' [ \\t]+ ;

DASH : '-' ;
STAR : '*' ;
BANG : '!' ;
GT   : '>' ;
LBRACKET : '[' ;
RBRACKET : ']' ;
LPAREN   : '(' ;
RPAREN   : ')' ;

ESCAPED : '\\\\' ~[\\r\\n] ;

// URL
URL_TEXT : [a-zA-Z0-9:/.?#&=_%+]+ ;

TEXT : ~[*\\\\$\`#[\\]!>() \\t\\r\\n-]+ ;

SPACE : [ \\t]+ ;`

const RESUME_JSON = `{
  "personal_info": {
    "name": "Yinghao (Peter) Guan",
    "title": "HCI Researcher & Full Stack Developer",
    "location": "Los Angeles, CA",
    "email": "peter@peterguan.com",
    "phone": "(213) 312-5303",
    "github": "github.com/Yinghao-Guan",
    "linkedin": "linkedin.com/in/yinghao-guan",
    "website": "peterguan.com"
  },
  "summary": "Full-stack engineer and HCI researcher passionate about building AI-driven tools and exploring Explainable AI (XAI). Experienced in compiler design, behavioral modeling, and high-performance web systems.",
  "skills": {
    "languages": ["Python", "Java", "C++", "C", "Rust", "JavaScript", "R", "Solidity"],
    "frontend": ["React", "Next.js 15", "Tailwind CSS", "TypeScript", "JavaFX"],
    "backend_cloud": ["FastAPI", "Flask", "Node.js", "PostgreSQL", "Firebase", "WebSockets"],
    "ai_research": ["LLM APIs (Gemini, Perplexity)", "XAI", "HCI", "ASR Pipelines", "PLS-SEM"],
    "tools_devops": ["Docker", "Git/GitHub", "CI/CD", "Linux/WSL", "ANTLR4", "LaTeX"]
  },
  "experience": [
    {
      "title": "Veru (AI Startup)",
      "role": "Lead Developer / Founder",
      "period": "Oct 2025 - Present",
      "achievements": [
        "Engineered an AI citation auditor to detect hallucinations by cross-referencing outputs against 250M+ academic papers.",
        "Implemented a high-performance FastAPI/Next.js pipeline with sub-200ms response times for complex research queries.",
        "Acquired 100+ unique users within the first week of MVP launch through organic growth."
      ]
    },
    {
      "title": "UCLA HCI Research Collaboration",
      "role": "Lead Student Researcher",
      "period": "Jul 2025 - Present",
      "achievements": [
        "Investigating the impact of Explainable AI (XAI) on user trust and empathy in emotional support LLMs.",
        "Designed and executed an A/B testing framework evaluating transparency levels and user agency in AI interactions.",
        "Automated qualitative data analysis using Python, preparing for a peer-reviewed publication (Expected Feb 2026)."
      ]
    }
  ],
  "hackathon_highlights": [
    {
      "event": "HackCC Fall 2025",
      "award": "Best AI/ML Prize Winner (1st out of 29 teams)",
      "project": "Realibuddy",
      "details": "Developed a real-time conversational fact-checking assistant using WebSockets, Deepgram ASR, and Perplexity API."
    }
  ],
  "technical_projects": [
    {
      "name": "Academic DSL & IDE Ecosystem",
      "description": "A custom markup language IDE (MyMD) blending Markdown simplicity with LaTeX precision.",
      "tech": ["Java", "Rust", "Tauri", "ANTLR4"],
      "highlights": ["Built a full compiler pipeline with formal grammar-based parsing for extensibility."]
    },
    {
      "name": "Behavioral Modeling of Trading",
      "description": "Quantitative analysis of psychological biases (FoMO, Herding) in financial markets.",
      "tech": ["Python", "R", "PLS-SEM"],
      "highlights": ["Validated FoMO as a primary predictor of irrational trading behavior through statistical modeling."]
    }
  ],
  "education": [
    {
      "institution": "Santa Monica College",
      "major": "Computer Science (A.S.)",
      "period": "2025 - Present",
      "status": "GPA: 4.0/4.0 | Transferring Fall 2027"
    },
    {
      "institution": "University of Edinburgh",
      "major": "Computer Science (Coursework)",
      "period": "2022 - 2024",
      "status": "Completed 2 years of rigorous BEng CS curriculum"
    }
  ]
}`;

// Solaura
const SOLAURA_README = `# Solaura: Spatial Audio AR for the Visually Impaired

> **Built in 24 hours at Hack for Humanity 2026 (Santa Clara University).**

## 👥 The Team
This project was developed during a 24-hour hackathon. 
* **Peter Guan** - Lead AR & Systems Engineer (Core iOS, Python Backend, UDP Architecture)
* **[Daniel Park](https://github.com/NokYongKim)** - Frontend Developer (Live Dashboard Visualization)
* **[Jonathan Aung](https://github.com/Aung-Khant)** - Product Pitch & Documentation
* **[Andrew Pan](https://github.com/1965428761pan-commits)** - Concept Ideation & Strategy

## 💡 The Concept: Giving Objects a Voice
Current accessibility tools for the visually impaired—such as guide dogs, smart canes, or video-call assistance apps—rely on natural language or physical pulls to guide the user. They tell the user *what* to do, rather than allowing the user to perceive the space themselves.

**Solaura** flips this paradigm by letting physical objects "speak." It creates a real-time, 3D spatial audio environment, allowing users to mentally map their surroundings and build independent spatial awareness. Instead of a robotic voice saying "move your hand left," the user hears a radar-like audio beacon emanating directly from the target object, acting as a sonar that guides their hand to the exact location.

## 🎯 The MVP: The "Grab" Scenario
For the 24-hour prototype, we focused on a vital micro-interaction: independently finding and grabbing a water bottle on a table.

## 🛠 Tech Stack
* **AI Brain**: Google Gemini 3 Flash (Multimodal Function Calling)
* **Mobile (AR)**: iOS, Swift, ARKit (LiDAR Scene Depth), CoreML (YOLOv8)
* **Backend (Audio)**: Python, UDP Sockets, \`sounddevice\`, NumPy
* **Web (Dashboard)**: Next.js, React, Tailwind CSS

## 🧠 How It Works (The Spatial Pipeline)

**1. The "Smart Switch" (Intent Recognition)**
Running high-frequency Object Detection (YOLO) and LiDAR continuously drains a phone's battery in minutes. Solaura solves this by running in a low-power "chat" mode by default. When the user says, "Where is my water bottle?", Gemini processes the camera feed and voice, executing an \`activate_radar\` function call to wake up the heavy AR tracking.

**2. Dual-Track Spatial Detection (iOS)**
Once the radar is active, the app runs two parallel asynchronous tracks:
* **Object Tracking (2.5Hz)**: A CoreML YOLOv8 model detects the water bottle.
* **Hand Tracking (15Hz)**: Apple's native Vision framework tracks the user's hand joints.
* *LiDAR Mapping*: 2D screen coordinates are projected against the raw LiDAR depth map to extract highly accurate 3D world coordinates.

**3. Zero-Latency Telemetry (UDP)**
The iOS device streams the 6-DOF camera pose, hand 3D coordinates, and object 3D coordinates via a lightweight UDP stream to the Python backend to avoid TCP overhead.

**4. Dual-Mode Spatial Audio (Python)**
The Python engine calculates relative vectors and dynamically generates audio:
* **Camera Mode (Macro Navigation)**: If no hand is visible, the audio pans based on the camera's azimuth relative to the bottle, guiding the user to face the object.
* **Hand Cursor Mode (Micro Precision)**: Once the user's hand enters the frame, the reference frame immediately shifts. The audio now maps the *hand-to-bottle* distance. A highly sensitive algorithm increases the pitch (up to 1500Hz) and frequency as the hand closes in, with a 5mm "dead zone" confirming a successful grab.

**5. The "God's Eye" Dashboard (Web)**
A Next.js frontend polls the backend state to render a real-time, web-based 3D visualization dashboard. It displays the active sound source, camera position, hand position, and bottle position, serving as a live telemetry monitor during presentations.
`;

const SOLAURA_CASE_STUDY = `# Case Study: Engineering Solaura

> **Role**: Lead AR & Systems Engineer
> **Stack**: Swift (ARKit/CoreML), Python (UDP/Math), Next.js
> **Timeline**: 24 Hours (Hack for Humanity 2026)

## 1. The HCI Challenge: "Object Permanence" and Panic

### The Chest-Mount Blind Spot
During early testing, I discovered a critical flaw in our interaction design. Because the phone is typically held or mounted near the chest, reaching for a water bottle on a table meant the user's arm would almost 100% occlude (block) the bottle from the camera's view. 

**The Problem**: In version 1.0, the moment the bottle was occluded, the audio beacon stopped. From a Human-Computer Interaction (HCI) perspective for the visually impaired, **sudden silence equals panic**. If the guide audio disappears right as they are about to grab the object, the entire system loses user trust.

**The Solution: Anti-Penetration & Memory**
1. **LiDAR Anti-Penetration Grid**: I implemented a massive sampling window (11x11 for hands, 5x5 for bottles) on the raw LiDAR depth map, finding the minimum valid depth to prevent ARKit's raycast from piercing through the table and grabbing coordinates from the floor.
2. **State Freezing (Object Permanence)**: I engineered a state machine in the Python backend. When the camera detects a hand but loses the bottle, it instantly "freezes" the bottle's last known 3D coordinate. The audio engine seamlessly transitions from tracking the bottle visually to calculating the vector between the *hand's live position* and the *bottle's memorized position*, ensuring uninterrupted audio feedback until the grab is completed.

---

## 2. The Math Behind the Magic: 2D to 3D Spatial Audio

Transforming a flat camera feed into a hyper-accurate 3D audio landscape required rigorous mathematical modeling. I had to bridge the gap between CoreML's 2D bounding boxes, LiDAR's depth map, and Apple's ARKit world tracking.

### The Spatial Pipeline
1. **Coordinate Transformation**: I extracted the camera's 6-DOF pose as a Quaternion $(x, y, z, w)$ and converted it into a $3 \\times 3$ Rotation Matrix. This allowed me to transform global world vectors $(v_w)$ into the camera's local coordinate space $(v_c = R^T \\cdot v_w)$, which is essential for determining if the object is to the left or right of the user's head.
2. **Constant-Power Panning**: To prevent the volume from dropping when the sound crosses the center of the stereo field, I implemented a Constant-Power Panning law using trigonometric functions ($Gain_{Left} = \\cos(\\theta)$, $Gain_{Right} = \\sin(\\theta)$).
3. **Exponential Smoothing (EMA)**: Raw LiDAR and CV tracking data can be jittery. I applied an Exponential Moving Average (EMA) with an alpha of 0.15 to the coordinates. This completely eliminated audio stutter, resulting in a buttery-smooth sonar experience.

---

## 3. Architecture & Execution in 24 Hours

### Decoupling for Speed
Hackathons are a battle against the clock. Due to severe resource constraints within the team, I had to single-handedly architect and implement the entire core system: the iOS AR frontend, the AI reasoning layer, and the Python UDP audio backend. 

To ensure we could still deliver a polished presentation, I designed a strictly decoupled architecture. I established a robust UDP telemetry stream from the phone to the Python backend, which then exposed a clean HTTP JSON endpoint. This allowed my teammate, Daniel, to build the Next.js Live Dashboard completely independently. We didn't have to waste time merging complex states; the frontend simply polled the backend's "God's Eye" state, resulting in a flawless integration.

---

## 4. Reflections & Takeaways

Delivering a multi-platform application (iOS, Python, Web) with complex HCI considerations within 24 hours was the ultimate stress test. 

1. **Mastering Apple Native APIs**: This project forced me to dive deep into the lower levels of ARKit. Moving beyond simple high-level wrappers and directly manipulating raw LiDAR depth maps (\`sceneDepth\`) and Raycasts gave me a profound appreciation for spatial computing hardware.
2. **Full-Stack Resilience**: When team resources bottlenecked, I learned how to rapidly shift contexts—writing Swift UI code one minute, deriving linear algebra formulas for audio panning the next, and debugging UDP socket timeouts right after. It reinforced my belief that a strong engineer must be adaptable across the entire stack.
3. **HCI is Everything**: The most advanced AI and math mean nothing if the user interface induces anxiety. Solving the occlusion problem taught me that true engineering isn't just about making the code work; it's about deeply empathizing with the end user's physiological and emotional response to the system."
`;

const SOLAURA_AUDIO_LOGIC = `import math
import numpy as np

# --- 1. Spatial Math Core ---
def quat_to_rotmat_xyzw(q):
    """Converts 4D spatial quaternion to 3x3 rotation matrix."""
    x, y, z, w = q
    xx, yy, zz = x * x, y * y, z * z
    xy, xz, yz = x * y, x * z, y * z
    wx, wy, wz = w * x, w * y, w * z
    return np.array([
        [1 - 2 * (yy + zz), 2 * (xy - wz), 2 * (xz + wy)],
        [2 * (xy + wz), 1 - 2 * (xx + zz), 2 * (yz - wx)],
        [2 * (xz - wy), 2 * (yz + wx), 1 - 2 * (xx + yy)],
    ], dtype=np.float32)

def world_to_camera(v_w, cam_quat_xyzw):
    """Transforms a world vector into the camera's local coordinate space."""
    R = quat_to_rotmat_xyzw(cam_quat_xyzw)
    return R.T @ v_w

# --- 2. Hyper-Sensitive Hand Cursor Mode ---
def pan_from_hand_offset(v_c):
    """
    Translates the lateral physical offset into a stereo pan value.
    Extremely sensitive: 2cm offset triggers max panning. 5mm deadzone for precise grabs.
    """
    x_offset = float(v_c[0])
    max_offset = 0.02 # 2 centimeters
    
    pan = x_offset / max_offset

    # Deadzone: 5 millimeters
    if abs(x_offset) < 0.005:
        pan = 0.0

    return max(-1.0, min(1.0, pan))

def stereo_gains(pan):
    """Constant-Power Panning law using trigonometry to prevent center volume drop."""
    pan = max(-1.0, min(1.0, pan))
    angle = (pan + 1.0) * math.pi / 4.0
    return math.cos(angle), math.sin(angle)
`;

const SOLAURA_MATH_MODEL = `# Solaura: Mathematical Audio Mapping

> **Translating 3D Physical Space into Cognitive Audio Landscapes.**
> The following models define how Solaura converts visual bounding boxes and LiDAR depth into an intuitive sonar experience.

## 1. 3D Spatial Transformation
To calculate whether an object is to the left or right of the user's head, we must transform the global world coordinates into the camera's local coordinate system.

**Quaternion to Rotation Matrix:**
Converts the 4D spatial quaternion (x, y, z, w) from ARKit into a $3 \\times 3$ rotation matrix ($R$).
$$ R = \\begin{bmatrix} 1-2(y^2+z^2) & 2(xy-wz) & 2(xz+wy) \\\\ 2(xy+wz) & 1-2(x^2+z^2) & 2(yz-wx) \\\\ 2(xz-wy) & 2(yz+wx) & 1-2(x^2+y^2) \\end{bmatrix} $$

**World to Camera Vector:**
Transforms the physical vector from the global world space ($v_w$) into the camera's local space ($v_c$).
$$ v_c = R^T \\cdot v_w $$

## 2. Psychoacoustic Panning (Constant Power)
Simple linear panning causes a perceived drop in volume when the sound crosses the center of the stereo field. Solaura uses a **Constant-Power Panning Law** to distribute volume smoothly.

$$ Angle = (Pan + 1.0) \\cdot \\frac{\\pi}{4} $$
$$ Gain_{Left} = \\cos(Angle) $$
$$ Gain_{Right} = \\sin(Angle) $$

## 3. Dynamic Pitch Mapping
The system acts as a high-precision metal detector. As the physical distance ($d$) between the hand and the bottle decreases, the frequency (pitch) of the audio beep dynamically scales from 400Hz up to 1500Hz.

$$ Ratio_{inv} = \\frac{d_{max} - d_{clamped}}{d_{max} - d_{min}} $$
$$ Frequency (Hz) = 400.0 + (Ratio_{inv} \\cdot 1100.0) $$
`;

// --- Projects Configuration ---
export const PROJECTS: Project[] = [
  {
    id: "veru",
    name: "Veru_CitationAuditor",
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
    id: "realibuddy",
    name: "RealiBuddy_FactCheck",
    github: "https://github.com/seanesla/Realibuddy",
    devpost: "https://devpost.com/software/pavshock",
    files: [
      { name: "README.md", type: "readme", content: REALIBUDDY_README },
      { name: "Live_Interface_v2", type: "demo" },
      { name: "CASE_STUDY.md", type: "markdown", content: REALIBUDDY_CASE_STUDY},
      { name: "fact_checker.ts", type: "code", language: "typescript", content: REALIBUDDY_GEMINI_SERVICE },
      { name: "socket_handler.ts", type: "code", language: "typescript", content: REALIBUDDY_HANDLER },
    ]
  },
  {
    id: "solaura",
    name: "Solaura_BlindAssist",
    github: "https://github.com/Yinghao-Guan/solaura",
    devpost: "https://devpost.com/software/solaura-bouewf",
    files: [
      { name: "README.md", type: "readme", content: SOLAURA_README },
      { name: "Demo_video", type: "demo" },
      { name: "CASE_STUDY.md", type: "markdown", content: SOLAURA_CASE_STUDY },
      { name: "MATH_MODEL.md", type: "markdown", content: SOLAURA_MATH_MODEL },
      { name: "spatial_audio.py", type: "code", language: "python", content: SOLAURA_AUDIO_LOGIC },
    ]
  },
  {
    id: "mymd",
    name: "MyMD_Compiler",
    github: "https://github.com/Yinghao-Guan/MyMD",
    files: [
      { name: "README.md", type: "readme", content: MYMD_README },
      { name: "CASE_STUDY.md", type: "markdown", content: MYMD_CASE_STUDY },
      { name: "Grammar.g4", type: "code", language: "java", content: MYMD_PARSER },
      /*{ name: "AstVisitor.java", type: "code", language: "java", content: "// Transforming Parse Tree to JSON AST..." },*/
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
      { name: "CASE_STUDY.md", type: "markdown", content: GRADECALC_CASE_STUDY },
      { name: "advice_algorithm.js", type: "code", language: "javascript", content: GRADECALC_LOGIC },
    ]
  },
];

export const RESUME_PROJECT: Project = {
  id: "resume",
  name: "PETER_GUAN_RESUME",
  files: [
    { name: "résumé.json", type: "code", language: "json", content: RESUME_JSON },
  ]
};
