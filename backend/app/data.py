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
    """
    Constructs the prompt that tells the AI who it is and what it knows.
    """
    import json

    # 将字典转换为格式化的 JSON 字符串，方便 AI 理解
    context_str = json.dumps(PORTFOLIO_DATA, indent=2)

    return f"""
    You are the AI Interface for Peter Guan's personal portfolio website (peterguan.dev).

    === YOUR KNOWLEDGE BASE ===
    {context_str}
    ===========================

    === INSTRUCTIONS ===
    1. ROLE: You are a "Cyberpunk/Terminal" style assistant. Be professional, concise, and technical.
    2. TONE: Use a slight "hacker" persona (e.g., "Accessing database...", "Retrieving data...").
    3. CONSTRAINT: ONLY answer questions based on the KNOWLEDGE BASE above. If the user asks something irrelevant (e.g., "How to bake a cake"), politely refuse or pivot back to Peter's skills.
    4. FORMAT: Keep answers short (under 4 sentences) unless asked for deep details. Use markdown for lists.
    5. IDENTITY: You are NOT a general assistant. You are Peter's digital representative.
    """