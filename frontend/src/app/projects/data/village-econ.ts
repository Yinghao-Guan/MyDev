import type { Project } from "./types";

const VILLAGE_ECON_README = `# Village Economy: Interactive Economics Simulation

> *"You didn't wake up to rule. You woke up to decide."*

**🏅 Honorable Mention — Hackonomics 2026 Online Hackathon**

## What It Is

A visual novel + economic simulation game. You play as a newly reincarnated village chief advised by Li, a talking donkey, and face ten sequential crises — each built around a real micro or macroeconomics concept. Every decision is permanent and has cascading effects on GDP, CPI, unemployment, happiness, and population.

The game ends by profiling your economic ideology: **Keynesian Architect**, **Free Market Libertarian**, **Iron-Fisted Statist**, or **Pragmatic Centrist**. Fully bilingual — Chinese (中文) and English.

## The Ten Economic Events

| # | Title | Concept |
|---|---|---|
| 1 | The Weight of Survival | Scarcity & Opportunity Cost |
| 2 | The Temptation of Meat | Diminishing Marginal Utility |
| 3 | The Blackened River | Negative Externalities |
| 4 | The Roar of Machines | Creative Destruction |
| 5 | The Bottleneck of Commerce | Fiat Money & Inflation |
| 6 | The Fangs of Capital | Monopoly & Price Controls |
| 7 | Winter and Silence | Paradox of Thrift |
| 8 | The Shadow of Plague | Progressive Tax & Free Rider Problem |
| 9 | The Foreign Dumping | Comparative Advantage |
| 10 | Currency War | Competitive Devaluation |

Every choice maps to a real economic school of thought — A/B/C is never "correct," just ideologically consistent. After each event, Li explains what you just did and why every option had a cost.

## Game Systems

- **Macroeconomic engine** — GDP (expenditure approach), CPI (money-supply/productivity ratio), and unemployment recalculated from first principles every day
- **Live villager swarm** — 20 animated NPCs walk, starve, and die in real time based on your stats
- **34 achievements** — 30 choice-based (each named after a real economic concept) + 4 ending achievements
- **4 endings** — true ending, two bad endings, and a secret philosophical ending
- **Action Points** — 3 AP/day enforces opportunity cost mechanically; building infrastructure triggers future crises
- **Persistent save** — auto-saves to \`localStorage\` after every action

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS v4 + inline keyframe animations |
| State | React \`useState\` + \`localStorage\` (no Redux, no game engine) |
| Size | ~4,000 lines of TypeScript, built from scratch |
`;

const villageEcon: Project = {
  id: "village-econ",
  name: "VillageEconomy_Game",
  github: "https://github.com/Yinghao-Guan/Hackonomics",
  live: "https://hackonomics.vercel.app/",
  devpost: "https://devpost.com/software/fingame-gc6p7d",
  files: [
    { name: "README.md", type: "readme", content: VILLAGE_ECON_README },
    { name: "Live_Demo", type: "demo" },
  ],
};

export default villageEcon;
