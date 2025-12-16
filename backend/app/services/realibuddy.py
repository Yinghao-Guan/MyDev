import os
import json
import re
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("DEV_API_KEY")


class RealibuddyService:
    def __init__(self):
        if not API_KEY:
            print("Warning: DEV_API_KEY not found.")
        else:
            genai.configure(api_key=API_KEY)

        # 使用 Gemini 2.0 Flash
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')

    def _clean_json_text(self, text: str) -> str:
        """清理 LLM 返回的 Markdown 格式"""
        if not text: return "{}"
        text = text.strip()
        match = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
        if match:
            text = match.group(1)
        return text.strip()

    def _get_source_prompt(self, filter_type: str) -> str:
        """根据来源类型生成特定的搜索指令"""
        base = "You are Realibuddy, a forensic fact-checking AI."

        if filter_type == "academic":
            return f"{base} You are acting as a PhD Researcher. STRICTLY LIMIT your verification to academic journals, peer-reviewed papers (Nature, Science, arXiv), and .edu domains. Ignore tabloids or social media."
        elif filter_type == "news":
            return f"{base} You are acting as a News Editor. Verify claims against reputable news organizations (Reuters, AP, BBC, NYT, CNN). Focus on recent breaking news and journalistic integrity."
        elif filter_type == "social":
            return f"{base} You are acting as a Social Media Analyst. Verify claims based on viral trends, public sentiment, and discussions on platforms like X (Twitter), Reddit, and TikTok. Acknowledge internet culture and memes."
        elif filter_type == "authoritative":
            return f"{base} You are acting as a Government Auditor. Verify claims against official government data (.gov), WHO, UN, and legal statutes."
        else:  # "all"
            return f"{base} Use your general knowledge base to verify claims across all trusted sources."

    async def verify_claim(self, text: str, source_filter: str = "all"):
        now = datetime.now()
        current_date_str = now.strftime("%Y-%m-%d")

        # 1. 动态生成 Prompt
        role_prompt = self._get_source_prompt(source_filter)

        system_prompt = f"""{role_prompt}
CRITICAL CONTEXT:
- Today's Date: {current_date_str}

RULES:
1. **Subjectivity**: Opinions are UNVERIFIABLE.
2. **Strictness**: Be pedantic about specific dates and numbers.
3. **Source simulation**: Since you are not browsing the live web, use your internal training data to simulate the search results from the requested domain ({source_filter}).
4. **Hallucination Prevention**: If the claim is too obscure, return "unverifiable".

RESPONSE FORMAT:
You MUST output a valid JSON object.
{{
  "verdict": "True" | "False" | "Unverifiable",
  "confidence": 0.0-1.0,
  "evidence": "A single sentence correction or confirmation.",
  "source": "Name of a specific {source_filter} source you are citing"
}}
"""
        try:
            full_prompt = f"{system_prompt}\n\nVerify this statement: {text}"

            # 2. 纯 Prompt 驱动，不调用 Tools
            response = self.model.generate_content(full_prompt)

            cleaned_text = self._clean_json_text(response.text)
            return json.loads(cleaned_text)

        except Exception as e:
            print(f"Realibuddy Error: {e}")
            return {
                "verdict": "Unverifiable",
                "confidence": 0,
                "evidence": f"Verification failed. ({str(e)})",
                "source": "System Error"
            }


realibuddy_service = RealibuddyService()