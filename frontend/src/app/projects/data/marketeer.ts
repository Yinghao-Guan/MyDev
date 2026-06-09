import type { Project } from "./types";

const MARKETEER_README = `# Marketeer: AI Marketing Campaign Generator

> **Full campaign package — logo, banners, jingle, video ad, voiceover — in minutes.**

**🥈 Runner-Up — UCLA Glitch Build with Gemini API Hackathon**

## What It Does

Give Marketeer your brand name, description, industry, and some competitor references. It produces a complete, cohesive campaign bundle powered by Google's latest GenAI media models.

| Asset | Details |
|---|---|
| Logo | AI-generated or rated from your upload |
| Banners | 3 formats — 1:1, 16:9, 9:16 |
| Jingle | 30-second brand audio via Lyria |
| Video Ad | 8-second Veo-generated clip |
| Voiceover | TTS narration matched to voice tone |
| Final Video | Video + voiceover merged client-side (FFmpeg WASM) |
| Campaign Bundle | Full ZIP download |

## Product Flow

\`\`\`
Landing → Onboarding → Logo Rating → Proposal → Asset Generation → Dashboard
\`\`\`

1. **Onboard** — upload or skip a logo; add competitors, brand context, location, and industry.
2. **Rate** — Gemini Vision analyzes the logo with per-format scores and suggestions.
3. **Style Lock** — dominant colors and visual style extracted and injected into every downstream prompt for visual consistency.
4. **Propose** — review and revise a creative brief before any expensive generation starts.
5. **Generate** — banners, jingle, video, and voiceover produced in parallel.
6. **Dashboard** — preview, regenerate individual assets, and download the full bundle.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Framer Motion |
| AI / Media | Gemini 2.5 Flash, Veo 3.1, Lyria (via \`@google/genai\`) |
| Video Merge | FFmpeg WASM (client-side, no server media processing) |
| Persistence | IndexedDB via \`idb\` — everything lives in the browser |
| Downloads | JSZip |
`;

const marketeer: Project = {
  id: "marketeer",
  name: "Marketeer_CampaignAI",
  github: "https://github.com/Yinghao-Guan/Marketeer",
  live: "https://marketeer-eight.vercel.app/",
  devpost: "https://devpost.com/software/marketeer-dai8u9",
  files: [
    { name: "README.md", type: "readme", content: MARKETEER_README },
    { name: "Live_Demo", type: "demo" },
  ],
};

export default marketeer;
