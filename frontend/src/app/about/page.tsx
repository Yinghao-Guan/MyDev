import React from "react";
import { MapPin, Mail, Github, Linkedin, ExternalLink, Globe } from "lucide-react";

const shortHash = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).padStart(7, "0").slice(0, 7);
};

type LogEntry = {
  date: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  isActive?: boolean;
  href?: string;
};

function GitLogSection({ title, entries }: { title: string; entries: LogEntry[] }) {
  return (
    <div className="mb-8">
      <div className="text-xs text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="text-green-700">──</span>
        <span>{title}</span>
        <span className="flex-1 border-t border-gray-800" />
      </div>
      <div className="relative ml-1">
        <div className="absolute left-[6px] top-2 bottom-2 w-px bg-gray-800" />
        <div className="space-y-5">
          {entries.map((entry) => (
            <div key={entry.title} className="flex gap-4">
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 mt-0.5 shrink-0 z-10 ${
                  entry.isActive
                    ? "border-green-500 bg-green-900/30"
                    : "border-gray-700 bg-[#050505]"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-0.5">
                  <span className="text-gray-600 text-xs">{shortHash(entry.title)}</span>
                  <span className="text-gray-600 text-xs">·</span>
                  <span className="text-gray-500 text-xs">{entry.date}</span>
                  {entry.isActive && (
                    <span className="text-[10px] text-green-500 border border-green-900/60 bg-green-900/10 px-1.5 py-0.5 rounded leading-none">
                      HEAD
                    </span>
                  )}
                </div>
                {entry.href ? (
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-green-400 transition-colors text-sm font-semibold flex items-center gap-1 w-fit"
                  >
                    {entry.title}
                    <ExternalLink size={11} className="opacity-40" />
                  </a>
                ) : (
                  <p className="text-gray-200 text-sm font-semibold">{entry.title}</p>
                )}
                {entry.subtitle && (
                  <p className="text-gray-500 text-xs mt-0.5">{entry.subtitle}</p>
                )}
                {entry.tags && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-gray-500 bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const education: LogEntry[] = [
  {
    date: "Sep 2025 – Present",
    title: "Santa Monica College",
    subtitle: "Computer Science",
    tags: ["Dean's Honor List", "Alpha Gamma Sigma", "CS Club", "HackSMC"],
    isActive: true,
  },
  {
    date: "Sep 2022 – Jul 2024",
    title: "University of Edinburgh",
    subtitle: "Computer Science · 2 Years Completed",
    tags: ["Software Engineering", "Reasoning & Agents", "Data Structures", "Logic"],
  },
  {
    date: "Feb 2022 – Jun 2022",
    title: "University of Auckland",
    subtitle: "Finance & Engineering · Completed Coursework",
    tags: ["Business", "Economics", "Markets & Law"],
  },
];

const experience: LogEntry[] = [
  {
    date: "Jul 2025 – Present",
    title: "HCI Research Collaboration · UCLA",
    subtitle: "Lead Student Researcher · XAI & Emotional Support LLMs",
    isActive: true,
  },
  {
    date: "Dec 2025 – Present",
    title: "Veru — AI Academic Audit Platform",
    subtitle: "Founder · 200–300 Monthly Active Users",
    href: "https://veru.app",
    isActive: true,
  },
  {
    date: "Feb 2026 – Present",
    title: "Alpha Gamma Sigma Honor Society",
    subtitle: "Website Coordinator · Santa Monica College",
    isActive: true,
  },
];

const awards: LogEntry[] = [
  {
    date: "Apr 2026",
    title: "BroncoHacks 2026",
    subtitle: "Best Sport & Fitness Track Winner · Cal Poly Pomona",
  },
  {
    date: "Mar 2026",
    title: "Build with Gemini · UCLA × Google DeepMind",
    subtitle: "Runner-Up Prize Winner",
  },
  {
    date: "Mar 2026",
    title: "Vision Hack",
    subtitle: "Top 3 Overall · Los Angeles",
  },
  {
    date: "Mar 2026",
    title: "Hackonomics Hackathon",
    subtitle: "Honorable Mention",
  },
  {
    date: "Mar 2026",
    title: "Hack for Humanity 2026",
    subtitle: "Solaura · Santa Clara University",
  },
  {
    date: "Nov 2025",
    title: "HackCC Fall 2025",
    subtitle: "Best AI/ML Prize Winner · MiraCosta College",
  },
];

const skills = [
  { label: "Frontend",   value: "React · Next.js · TypeScript · Tailwind · Tauri" },
  { label: "Backend",    value: "FastAPI · Flask · PostgreSQL · Firebase · Vercel" },
  { label: "Languages",  value: "Python · Rust · C++ · Java · TypeScript · R · SQL" },
  { label: "Data",       value: "pandas · NumPy · scikit-learn · Stata" },
  { label: "Tools",      value: "Git · Docker · GitHub Actions · Linux" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-14 bg-[#0d0d0d] text-gray-300 font-mono p-4 md:p-8 flex justify-center">
      <div className="max-w-2xl w-full">
        <div className="border border-gray-800 bg-[#050505] rounded-lg shadow-2xl overflow-hidden">

          {/* Window Chrome */}
          <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-3 flex justify-between items-center sticky top-14 z-10 backdrop-blur-sm">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              user_profile.json
            </div>
            <div className="w-14" />
          </div>

          <div className="p-6 md:p-8">

            {/* Identity */}
            <div className="mb-8">
              <h1 className="text-xl font-bold text-white">Peter Guan</h1>
              <p className="text-green-400 text-sm mt-1">@FullStack_Quant</p>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                Developer bridging the gap between high-performance tech and quantitative finance.
                Building hardcore tools with modern aesthetics.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin size={11} /> Santa Monica, CA
                </span>
                <a href="mailto:peter@peterguan.com" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                  <Mail size={11} /> peter@peterguan.com
                </a>
                <a href="https://github.com/Yinghao-Guan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                  <Github size={11} /> Yinghao-Guan
                </a>
                <a href="https://www.linkedin.com/in/yinghao-guan/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                  <Linkedin size={11} /> yinghao-guan
                </a>
                <a href="https://peterguan.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-green-400 transition-colors">
                  <Globe size={11} /> peterguan.com
                </a>
              </div>
            </div>

            <GitLogSection title="Education" entries={education} />
            <GitLogSection title="Experience" entries={experience} />
            <GitLogSection title="Awards & Competitions" entries={awards} />

            {/* Skills */}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="text-green-700">──</span>
                <span>Skills</span>
                <span className="flex-1 border-t border-gray-800" />
              </div>
              <div className="space-y-2">
                {skills.map(({ label, value }) => (
                  <div key={label} className="flex gap-3 text-sm">
                    <span className="text-gray-500 w-20 shrink-0">{label}</span>
                    <span className="text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
