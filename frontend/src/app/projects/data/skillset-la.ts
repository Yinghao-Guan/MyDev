import type { Project } from "./types";

const SKILLSET_LA_README = `# Skillset LA: AI Career Roadmap Builder

> **Break into tech — with a plan built for where you actually live.**

## What It Does

A lot of people want to break into tech but don't know where to start. Skillset LA takes your current job and skills, your target role, and uses AI to build a personalized step-by-step learning roadmap — with free local resources and real Los Angeles job postings you could qualify for right now.

## How It Works

1. Enter your current job, existing skills, and the role you want
2. Gemini analyzes the gap between where you are and where you want to be
3. Get a clear roadmap with timelines, free resources, and matching job listings

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, Tailwind CSS, Framer Motion, GSAP |
| Backend | Hono |
| AI | Google Gemini API |
`;

const skillsetLa: Project = {
  id: "skillset-la",
  name: "SkillsetLA_CareerAI",
  github: "https://github.com/Yinghao-Guan/VisionHack",
  live: "https://vision-hack-rouge.vercel.app/",
  devpost: "https://devpost.com/software/skillset-la",
  files: [
    { name: "README.md", type: "readme", content: SKILLSET_LA_README },
    { name: "Live_Demo", type: "demo" },
  ],
};

export default skillsetLa;
