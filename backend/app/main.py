import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# LangChain Imports
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage

from app.data import get_system_prompt

# 1. 加载 .env 环境变量
load_dotenv()

app = FastAPI()

# 2. CORS 配置
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 3. 初始化 AI 模型
# 这里即使以后换 Gemini，也只需要改这一小块代码
def get_ai_model():
    provider = os.getenv("AI_PROVIDER", "ollama")

    if provider == "ollama":
        return ChatOllama(
            model=os.getenv("OLLAMA_MODEL", "llama3.1:8b"),
            base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
            temperature=0.7
        )
    # 未来只需要在这里加 elif provider == "gemini": ...
    else:
        raise ValueError(f"Unknown AI Provider: {provider}")


# 定义请求体
class ChatRequest(BaseModel):
    message: str


@app.get("/")
def read_root():
    return {"status": "System Online", "model": os.getenv("OLLAMA_MODEL")}


# 4. 流式聊天接口
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    model = get_ai_model()

    # 系统提示词 (Persona)
    # 动态获取包含最新简历数据的 Prompt
    prompt_content = get_system_prompt()
    system_prompt = SystemMessage(content=prompt_content)

    user_message = HumanMessage(content=request.message)

    # 生成器函数：负责一点点产生数据
    async def generate():
        async for chunk in model.astream([system_prompt, user_message]):
            # chunk.content 就是模型刚刚吐出的那几个字
            yield chunk.content

    # 返回流式响应 (text/event-stream)
    return StreamingResponse(generate(), media_type="text/event-stream")