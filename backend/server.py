"""
FastAPI server exposing the multi-agent system.
Endpoints:
  POST /v1/chat/completions — OpenAI-compatible chat (streaming SSE)
  GET  /health              — Health check
"""

import json
import os
import uuid

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage
from pydantic import BaseModel

from agent import agent

app = FastAPI(title="raphael.agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    model: str = "raphael-agent"
    stream: bool = True


@app.get("/health")
async def health():
    return {"status": "ok", "platform": "raphael-agent", "engine": "langgraph"}


@app.post("/v1/chat/completions")
async def chat_completions(request: ChatRequest):
    # Convert to LangChain messages
    lc_messages = []
    for msg in request.messages:
        if msg.role == "user":
            lc_messages.append(HumanMessage(content=msg.content))

    if not lc_messages:
        lc_messages = [HumanMessage(content="hello")]

    chat_id = f"chatcmpl-{uuid.uuid4().hex[:24]}"

    if request.stream:
        async def stream_response():
            # Run the agent
            result = agent.invoke({
                "messages": lc_messages,
                "current_agent": "",
            })

            # Get the last AI message
            ai_messages = [m for m in result["messages"] if hasattr(m, "content") and m.content]
            content = ai_messages[-1].content if ai_messages else "I'm here. How can I help?"
            routed_to = result.get("current_agent", "portfolio")

            # Stream content
            batch_size = 3
            for i in range(0, len(content), batch_size):
                text_chunk = content[i : i + batch_size]
                chunk = {
                    "id": chat_id,
                    "object": "chat.completion.chunk",
                    "model": "raphael-agent",
                    "choices": [{"index": 0, "delta": {"content": text_chunk}}],
                }
                yield f"data: {json.dumps(chunk)}\n\n"

            yield "data: [DONE]\n\n"

        return StreamingResponse(
            stream_response(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
        )
    else:
        # Non-streaming
        result = agent.invoke({
            "messages": lc_messages,
            "current_agent": "",
        })
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

    port = int(os.getenv("PORT", "8642"))
    uvicorn.run(app, host="0.0.0.0", port=port)
