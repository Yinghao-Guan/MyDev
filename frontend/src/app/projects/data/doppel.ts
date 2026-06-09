import type { Project } from "./types";

const DOPPEL_README = `# Doppel: Your Athletic Digital Twin

> **Train smarter by testing your future first.**

**🏆 BroncoHacks 2026 — Sports & Fitness Track Winner**

## What It Does

Point your camera at 5–10 reps. Doppel captures your movement fingerprint via MediaPipe, runs it through a Random Forest ML model, and predicts your performance two weeks from now. Then A/B test three training plans before committing to any.

## How It Works

1. **Capture** — MediaPipe Pose tracks 33 body landmarks in real time and extracts your training fingerprint: reps, form score, range of motion, tempo, asymmetry, and fatigue trend.
2. **Predict** — A \`RandomForestRegressor\` (200 trees) outputs four 0–100 percentile scores: Readiness, Strength Potential, Endurance Potential, and Injury Risk.
3. **Simulate** — Compare Plan A/B/C with 14-day growth curves; adjust frequency, intensity, and cardio ratio with sliders.
4. **Prove & Earn** — Connect Phantom wallet, submit an on-chain SHA-256 training proof, and claim NFT badges minted live on Solana devnet.

## Tech Stack

| Layer | Key Technologies |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Three.js, Zustand |
| Pose / Vision | MediaPipe Tasks Vision — pose_landmarker_lite |
| AI / LLM | Gemma 4 (live coaching), ElevenLabs TTS (voice coach) |
| Backend | FastAPI, scikit-learn RandomForest, SQLite, PyNaCl (Ed25519) |
| Blockchain | Solana Devnet, Anchor 0.32.1 (Rust), SPL Token NFTs |
`;

const doppel: Project = {
  id: "doppel",
  name: "Doppel_AthleticTwin",
  github: "https://github.com/Yinghao-Guan/Doppel",
  live: "https://bronco-hacks-delta.vercel.app/",
  devpost: "https://devpost.com/software/doppel-13khzp?ref_content=my-projects-tab&ref_feature=my_projects",
  files: [
    { name: "README.md", type: "readme", content: DOPPEL_README },
    { name: "Live_Demo", type: "demo" },
    { name: "math_doppel.pdf", type: "pdf", url: "/math_doppel.pdf" },
  ],
};

export default doppel;
