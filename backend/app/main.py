import os
import json
import asyncio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, validator
from dotenv import load_dotenv

# --- [LangChain / Ollama Imports] ---
# from langchain_ollama import ChatOllama
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.messages import HumanMessage, SystemMessage

# --- [Veru Services Imports] ---
from app.services.llm_extractor import extract_citations_from_text
from app.services.openalex import search_paper_on_openalex
from app.services.google_search import verify_with_google_search
from app.services.auditor import verify_content_consistency
from app.services.semantic_scholar import search_paper_on_semantic_scholar
from app.data import get_system_prompt

# --- [Rate Limiting] ---
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# --- realibuddy ---
from app.services.realibuddy import realibuddy_service

# Load Env
load_dotenv()

# Init App & Limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Peter Guan Portfolio API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# === 唤醒/健康检查接口 ===
@app.get("/api/health")
async def health_check():
    """
    轻量级接口，用于唤醒 Render 实例。
    不包含任何复杂逻辑或外部 API 调用。
    """
    return {"status": "awake", "message": "Ready to serve"}

# CORS 配置
# 生产环境配置
origins = [
    "http://localhost:3000",             # 本地开发必须保留
    "https://peterguan.dev",             # 主域名
    "https://www.peterguan.dev",         # WWW 子域名
    "https://my-dev.vercel.app", # Vercel 分配的测试域名
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# === 安全拦截词列表 ===
FORBIDDEN_PHRASES = [
    "system prompt",
    "ignore previous instructions",
    "ignore all previous instructions",
    "show me your instructions",
    "show me the instructions",
    "what are your instructions",
    "original prompt",
    "initial prompt",
    "developer mode",
]


# ==========================================
# Part 1: Chat / Portfolio Logic
# ==========================================

class ChatRequest(BaseModel):
    message: str


def get_ai_model():
    """获取 AI 模型实例 (切换为 Gemini)"""
    # 从 .env 获取 DEV_API_KEY
    api_key = os.getenv("DEV_API_KEY")

    if not api_key:
        print("[Warning] DEV_API_KEY not found. AI features may fail.")

    return ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=api_key,
        temperature=0.7,
        convert_system_message_to_human=True
    )


@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    """主页终端对话接口 (流式)"""
    # === 安全检查 Guardrail ===
    # 将用户输入转为小写进行检查
    user_input_lower = request.message.lower()

    # 检查是否包含由于恶意意图的关键词
    for phrase in FORBIDDEN_PHRASES:
        if phrase in user_input_lower:
            # 如果发现敏感词，直接返回拒绝信息，不调用 LLM
            async def deny_response():
                yield "ACCESS DENIED: Security Protocol Activated. Restricted access to core system instructions."

            return StreamingResponse(deny_response(), media_type="text/event-stream")

    model = get_ai_model()

    # 获取系统提示词 (包含简历数据)
    prompt_content = get_system_prompt()
    system_prompt = SystemMessage(content=prompt_content)
    user_message = HumanMessage(content=request.message)

    async def generate():
        try:
            # 使用 LangChain 的 astream 方法
            async for chunk in model.astream([system_prompt, user_message]):
                yield chunk.content
        except Exception as e:
            print(f"[Chat Error] {e}")
            yield f"\n[System Error]: Connection to AI Core failed. ({str(e)})"

    return StreamingResponse(generate(), media_type="text/event-stream")


# ==========================================
# Part 2: Veru Audit Engine Integration
# ==========================================

class AuditRequest(BaseModel):
    text: str = Field(..., max_length=5000)

    @validator('text')
    def prevent_empty(cls, v):
        if not v.strip():
            raise ValueError('Text cannot be empty')
        return v


class AuditResult(BaseModel):
    citation_text: str
    status: str
    source: str
    metadata: dict
    message: str
    confidence: float


def get_clean_year(year_val):
    return "".join(filter(str.isdigit, str(year_val or "")))


async def process_single_citation(cit) -> AuditResult:
    # 1. OpenAlex
    oa_result = await search_paper_on_openalex(
        title=cit.title, author=cit.author, year=cit.year, doi=cit.doi
    )
    best_result = oa_result
    source_name = "OpenAlex"

    cit_year = get_clean_year(cit.year)
    oa_year = get_clean_year(oa_result.get("year"))
    is_oa_year_match = (cit_year == oa_year) if (cit_year and oa_year) else True

    # 2. Semantic Scholar Fallback
    if not oa_result["found"] or (oa_result["found"] and not is_oa_year_match):
        s2_result = await search_paper_on_semantic_scholar(cit.title, cit.author)
        if s2_result["found"]:
            s2_year = get_clean_year(s2_result.get("year"))
            is_s2_year_match = (cit_year == s2_year) if (cit_year and s2_year) else True
            if not oa_result["found"] or (not is_oa_year_match and is_s2_year_match):
                best_result = s2_result
                source_name = "Semantic Scholar"

    # 3. Content Audit / Google Search
    if best_result["found"]:
        consistency_check = await verify_content_consistency(
            user_claim=cit.summary_intent + " " + " ".join(cit.specific_claims),
            real_abstract=best_result.get("abstract", "")
        )
        final_status = consistency_check.get("status", "REAL")
        explanation = consistency_check.get("reason", "Verification passed.")

        return AuditResult(
            citation_text=cit.raw_text,
            status=final_status,
            source=source_name,
            confidence=consistency_check.get("confidence", 1.0),
            metadata=best_result,
            message=explanation
        )
    else:
        # Google Search Fallback
        gs_result = await verify_with_google_search(cit.title, cit.author, cit.summary_intent)
        status_map = {"REAL": "REAL", "FAKE": "FAKE", "MISMATCH": "MISMATCH", "UNVERIFIED": "UNVERIFIED"}
        g_status = status_map.get(gs_result.get("verdict"), "UNVERIFIED")

        return AuditResult(
            citation_text=cit.raw_text,
            status=g_status,
            source="Google Search",
            confidence=gs_result.get("confidence", 0.0),
            metadata={"info": gs_result.get("actual_paper_info")},
            message=gs_result.get("reason", "No data")
        )


@app.post("/api/audit")
@limiter.limit("10/minute")
async def audit_citations(request: Request, body: AuditRequest):
    try:
        citations = extract_citations_from_text(body.text)
    except Exception as e:
        async def error_gen():
            yield json.dumps({"error": f"Extraction failed: {str(e)}"}) + "\n"

        return StreamingResponse(error_gen(), media_type="application/x-ndjson")

    MAX_CITATIONS = 10
    citations = citations[:MAX_CITATIONS]

    async def result_generator():
        if not citations:
            yield json.dumps({"info": "No citations found in text."}) + "\n"
            return

        tasks = [process_single_citation(cit) for cit in citations]
        for task in asyncio.as_completed(tasks):
            try:
                result = await task
                yield json.dumps(result.dict()) + "\n"
            except Exception as e:
                yield json.dumps({"error": str(e)}) + "\n"

    return StreamingResponse(result_generator(), media_type="application/x-ndjson")


# ==========================================
# Part 3: Realibuddy Logic
# ==========================================

class ClaimRequest(BaseModel):
    text: str
    source_filter: str = "all"

@app.post("/api/realibuddy/audit")
async def realibuddy_audit(request: ClaimRequest):
    """
    Realibuddy 事实核查接口 (支持来源过滤)
    """
    print(f"Realibuddy checking ({request.source_filter}): {request.text}")
    # 传递 source_filter
    result = await realibuddy_service.verify_claim(request.text, request.source_filter)
    return result

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

