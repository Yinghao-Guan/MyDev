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
  github: string;
  live?: string;
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
* **[Aung Min Khant](https://www.linkedin.com/in/real-aungminkhant/)** - Concept Ideation & Strategy
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
This project demonstrates the ability to "port and refactor" a complex hardware prototype into a scalable web application.

| Feature | Hackathon Origin (v1.0) | Portfolio Demo (v2.0) | Engineering Decision |
| :--- | :--- | :--- | :--- |
| **Logic** | Real-time Web Search (Perplexity) | **Prompt Engineering (Gemini)** | Switched to "Roleplay Mode" to simulate verification styles (Academic/News) without API latency. |
| **I/O** | Binary Stream (WebSocket) | **REST API (HTTP)** | Simplified communication protocol for better stability in a static demo environment. |
| **Feedback** | Physical Shock (Pavlok IoT) | **Visual & Audio Cues** | Replaced physical punishment with UI feedback loops (Red Alert/Green Pass) for accessibility. |
| **Cost** | Enterprise APIs | **Gemini API Paid Tier 1** | Optimized for sustainability using browser-native capabilities and efficient LLM inference. |

## 🚀 How it Works
1.  **Listen**: The browser's native \`SpeechRecognition\` captures audio locally (no server upload required).
2.  **Analyze**: Text is sent to the Python backend via a lightweight REST endpoint.
3.  **Simulate**:
    * Gemini 2.0 receives the claim with a specific **System Persona** (e.g., "Skeptical Fact-Checker").
    * Instead of browsing the live web, it leverages its massive internal knowledge base to hallucinate a "Verdict" based on general consensus.
4.  **Feedback**: The React frontend interprets the JSON verdict to trigger specific CSS animations and synthesized speech responses.

## ⚖️ The "Nuance" Engine
Since we removed live web search, v2.0 relies on sophisticated **Prompt Engineering** to categorize intent:
* **Subjective**: "I think this is cool." -> *Ignored*
* **Factual Lie**: "Humans have three legs." -> *False (High Confidence)*
* **Historical Fact**: "The Titanic sank in 1912." -> *True*
* **Roleplay**: The AI validates sources by "pretending" to cite authoritative domains (e.g., .edu or .gov) based on the context of the claim.
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

// --- Projects Configuration ---
export const PROJECTS: Project[] = [
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
    id: "realibuddy",
    name: "RealiBuddy",
    github: "https://github.com/seanesla/Realibuddy",
    files: [
      { name: "README.md", type: "readme", content: REALIBUDDY_README },
      { name: "Live_Interface_v2", type: "demo" },
      { name: "CASE_STUDY.md", type: "markdown", content: REALIBUDDY_CASE_STUDY},
      { name: "fact_checker.ts", type: "code", language: "typescript", content: REALIBUDDY_GEMINI_SERVICE },
      { name: "socket_handler.ts", type: "code", language: "typescript", content: REALIBUDDY_HANDLER },
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
];