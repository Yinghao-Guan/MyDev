import type { Project } from "./types";

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

const gradecalc: Project = {
  id: "gradecalc",
  name: "GradeCalc_Tool",
  github: "https://github.com/Guaguaaaa/GradeCalc",
  live: "https://grade.peterguan.com",
  files: [
    { name: "README.md", type: "readme", content: GRADECALC_README },
    { name: "App_Preview_v1", type: "demo" },
    { name: "CASE_STUDY.md", type: "markdown", content: GRADECALC_CASE_STUDY },
    { name: "advice_algorithm.js", type: "code", language: "javascript", content: GRADECALC_LOGIC },
  ],
};

export default gradecalc;
