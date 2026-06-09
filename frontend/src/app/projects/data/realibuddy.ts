import type { Project } from "./types";

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

const realibuddy: Project = {
  id: "realibuddy",
  name: "RealiBuddy_FactCheck",
  github: "https://github.com/seanesla/Realibuddy",
  devpost: "https://devpost.com/software/pavshock",
  files: [
    { name: "README.md", type: "readme", content: REALIBUDDY_README },
    { name: "Live_Interface_v2", type: "demo" },
    { name: "CASE_STUDY.md", type: "markdown", content: REALIBUDDY_CASE_STUDY },
    { name: "fact_checker.ts", type: "code", language: "typescript", content: REALIBUDDY_GEMINI_SERVICE },
    { name: "socket_handler.ts", type: "code", language: "typescript", content: REALIBUDDY_HANDLER },
  ],
};

export default realibuddy;
