"""
FastAPI server with dual endpoints:
  - /v1/chat/completions — OpenAI-compatible (for terminal chat fallback)
  - /agent              — AG-UI protocol (for CopilotKit)
  - /health             — Health check
"""

import json
import os
import uuid

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage
from pydantic import BaseModel

from agent import agent_graph

app = FastAPI(title="raphael.agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AG-UI endpoint for CopilotKit ---
try:
    from copilotkit import LangGraphAGUIAgent
    from ag_ui_langgraph import add_langgraph_fastapi_endpoint

    copilot_agent = LangGraphAGUIAgent(
        name="raphael_agent",
        description="Raphael Valdetaro's multi-agent portfolio system",
        graph=agent_graph,
    )

    add_langgraph_fastapi_endpoint(app=app, agent=copilot_agent, path="/agent")
    print("✅ CopilotKit AG-UI endpoint enabled at /agent")
except ImportError as e:
    print(f"⚠️ CopilotKit AG-UI not available: {e}")
except Exception as e:
    print(f"⚠️ CopilotKit AG-UI setup error: {e}")


# --- OpenAI-compatible endpoint (fallback for terminal) ---

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    model: str = "raphael-agent"
    stream: bool = True


@app.get("/health")
async def health():
    return {"status": "ok", "platform": "raphael-agent", "engine": "langgraph", "copilotkit": True}


@app.post("/v1/chat/completions")
async def chat_completions(request: ChatRequest):
    lc_messages = [HumanMessage(content=m.content) for m in request.messages if m.role == "user"]
    if not lc_messages:
        lc_messages = [HumanMessage(content="hello")]

    chat_id = f"chatcmpl-{uuid.uuid4().hex[:24]}"

    if request.stream:
        async def stream_response():
            result = agent_graph.invoke({"messages": lc_messages, "current_agent": ""})
            ai_messages = [m for m in result["messages"] if hasattr(m, "content") and m.content]
            content = ai_messages[-1].content if ai_messages else "I'm here."

            batch_size = 3
            for i in range(0, len(content), batch_size):
                chunk = {
                    "id": chat_id,
                    "object": "chat.completion.chunk",
                    "model": "raphael-agent",
                    "choices": [{"index": 0, "delta": {"content": content[i:i + batch_size]}}],
                }
                yield f"data: {json.dumps(chunk)}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(stream_response(), media_type="text/event-stream")
    else:
        result = agent_graph.invoke({"messages": lc_messages, "current_agent": ""})
        ai_messages = [m for m in result["messages"] if hasattr(m, "content") and m.content]
        content = ai_messages[-1].content if ai_messages else "I'm here."
        return {
            "id": chat_id,
            "object": "chat.completion",
            "model": "raphael-agent",
            "choices": [{"index": 0, "message": {"role": "assistant", "content": content}}],
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
