import type { Project } from "./types";

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

const resume: Project = {
  id: "resume",
  name: "PETER_GUAN_RESUME",
  files: [
    { name: "résumé.json", type: "code", language: "json", content: RESUME_JSON },
  ],
};

export default resume;
