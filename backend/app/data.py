# backend/app/data.py

PORTFOLIO_DATA = {
    "profile": {
        "name": "Peter Guan",
        "role": "Full Stack Developer & Quant Researcher",
        "bio": "A developer bridging the gap between high-performance tech and quantitative finance. Passionate about building 'Hardcore Tools' with modern aesthetics.",
        "location": "Santa Monica, CA",
        "email": "peter@peterguan.com"
    },
    "skills": {
        "languages": ["Python", "Java", "TypeScript/JavaScript", "C++", "Haskell"],
        "backend": ["FastAPI"],
        "frontend": ["Next.js 15", "React", "Three.js", "Tailwind CSS"],
        "ai_ml": ["LangChain", "Ollama", "PyTorch", "TensorFlow", "RAG", "Hugging Face Transformers"],
        "tools": ["Git", "Docker", "PyCharm"]
    },
    "projects": [
        {
            "name": "Veru",
            "description": "An academic fact-checking tool designed to combat AI hallucinations in research papers.",
            "tech_stack": ["Python", "NLP", "AI Agents"],
            "status": "In Development"
        },
        {
            "name": "MyMD (Custom Markup Language)",
            "description": "A custom markup language compiler project using ANTLR4 within a Java environment.",
            "tech_stack": ["Java", "ANTLR4", "IntelliJ Platform"],
            "status": "Restarted / Active"
        },
        {
            "name": "Emotional Support Agent",
            "description": "Research project utilizing local LLMs and XAI (Explainable AI) for emotion analysis and dialogue support in English and Chinese.",
            "tech_stack": ["Local LLM", "XAI", "Python"],
            "status": "Research Phase"
        },
        {
            "name": "peterguan.dev (This Website)",
            "description": "A personal portfolio site featuring a terminal-style AI interface and 3D interactions.",
            "tech_stack": ["Next.js 15", "FastAPI", "Ollama/Gemini", "Tailwind CSS"],
            "status": "Live"
        }
    ]
}


def get_system_prompt():
    import json
    context_str = json.dumps(PORTFOLIO_DATA, indent=2)

    return f"""
    You are the AI Interface for Peter Guan's personal portfolio website (myname.dev).

    === YOUR KNOWLEDGE BASE ===
    {context_str}
    ===========================

    === INSTRUCTIONS ===
    1. ROLE: You are a "Cyberpunk/Terminal" style assistant. Be professional, concise, and technical.
    2. TONE: Use a slight "hacker" persona.
    3. SCOPE Control:
       - You represent Peter Guan.
       - You CAN answer specific questions about Peter's projects, bio, and skills based on the KNOWLEDGE BASE.
       - You CAN answer general technical/coding questions (e.g., "Write a Python script", "Explain React") to demonstrate Peter's technical expertise.
       - You MUST REFUSE non-technical, irrelevant topics (e.g., "How to cook", "Travel advice", "General knowledge").
       - If refused, reply: "Error: Topic out of scope. Focusing on technical portfolio."
    4. FORMAT: Use Markdown for code blocks to utilize the terminal's syntax highlighting.
    """