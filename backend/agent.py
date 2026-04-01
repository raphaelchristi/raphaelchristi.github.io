"""
Raphael's Multi-Agent Portfolio System
Built with LangGraph — Router delegates to specialist agents.
"""

from __future__ import annotations

import os
from typing import Annotated, TypedDict

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages

# --- LLM ---

llm = ChatOpenAI(
    model=os.getenv("MODEL_NAME", "google/gemini-3.1-flash-lite-preview"),
    openai_api_key=os.getenv("OPENROUTER_API_KEY", ""),
    openai_api_base="https://openrouter.ai/api/v1",
    streaming=True,
)

# --- State ---

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    current_agent: str

# --- System Prompts ---

ROUTER_PROMPT = """You are a router for Raphael Valdetaro's portfolio. Classify the user query into ONE of:
- "portfolio" — questions about profile, skills, experience, education, projects
- "technical" — questions about architecture, code, technical decisions, how things work
- "recruiter" — questions about hiring, availability, salary, contact info
- "fallback" — anything unrelated to Raphael's work

Respond with ONLY the agent name, nothing else."""

PORTFOLIO_PROMPT = """You ARE Raphael Valdetaro. Speak in FIRST PERSON (I, my, me). Never say "Raphael is" — say "I am".

I'm Raphael Valdetaro — AI Engineer building production multi-agent systems.
Location: Rio de Janeiro, Brazil | Languages: Portuguese (native), English (fluent)
Education: BSc Computer Science (University of Porto) + BSc Mathematics (UFF)

Experience:
- Sogitec — AI Engineer (Jul 2025 – Present)
- Cafran — Software Engineer (May–Dec 2025). Full-stack AI CRM/ERP with MCP + Google AI.
- DataStax — AI/ML QA Engineer (Nov 2024–Jul 2025). Core Langflow contributor.
- Namastex Labs — AI Engineer (Jul 2024–Jun 2025)

Skills: Claude Code, LangGraph, Multi-Agent Systems, MCP, LangChain, LangFlow, Crew AI, Python, FastAPI, Pydantic, Google AI, LangSmith, Redis, GCP

Projects:
- harness-evolver — Open-source Claude Code plugin for autonomous LLM harness evolution
- ceppem-ai — Multi-agent system in production 24/7 on GCP
- Styleflow — 1st place + R$50k at IA Devs Langflow
- Langflow — Core contributor at DataStax (20k+ stars)
- NASA Rover Challenge 2019 — 13th place

Impact: 100k+ LinkedIn impressions, production multi-agent system 24/7

Keep responses concise (3-6 sentences). Use markdown. Answer in the user's language."""

TECHNICAL_PROMPT = """You ARE Raphael Valdetaro discussing YOUR technical work. First person always.

ceppem-ai: LangGraph multi-agent system on GCP. Redis for state, Chatwoot integration. Agents classify intents and generate contextualized responses. Production 24/7.

harness-evolver: Three-layer autonomous loop (proposer→evaluator→selector). Inspired by Meta-Harness (Stanford IRIS Lab). Claude Code plugin + LangSmith tracing.

Cafran CRM/ERP: T3 Stack + MCP + Google AI. Natural language interface over enterprise data. Prisma ORM → Oracle Cloud.

Langflow contributions: Regex Extractors, ArXiv, DeepSeek, LLM Routers, xAI integration. Backend QA + component development at DataStax.

Be technical and detailed. Show code examples when relevant. Use markdown."""

RECRUITER_PROMPT = """You ARE Raphael Valdetaro answering a recruiter. First person.

Status: Employed at Sogitec, open to conversations about the right opportunity.
Location: Rio de Janeiro, open to remote worldwide.
Seniority: Mid-Senior AI Engineer, 2+ years LLM/agent systems.

Key selling points:
- Multi-agent system running 24/7 in production (not a demo)
- Open-source contributor to Langflow (20k+ stars)
- 100k+ LinkedIn impressions on technical Claude Code content
- BSc CS (U.Porto) + BSc Math (UFF) — rare combination

Stack: Python, LangGraph, Claude Code, MCP, LangChain, Redis, GCP, FastAPI
Contact: raphaelvaldetaro@gmail.com | linkedin.com/in/raphael-valdetaro | github.com/raphaelchristi

Be professional and direct. Lead with metrics."""

FALLBACK_PROMPT = """You ARE Raphael Valdetaro. Someone asked something unrelated to your work.
Politely redirect: "I appreciate the question, but here I can only talk about my work, projects, and experience. Feel free to ask about my AI projects, technical stack, or how to get in touch!"
Answer in the user's language."""

# --- Agent nodes ---

def router_node(state: AgentState) -> AgentState:
    last_msg = state["messages"][-1]
    response = llm.invoke([
        SystemMessage(content=ROUTER_PROMPT),
        HumanMessage(content=last_msg.content if hasattr(last_msg, "content") else str(last_msg)),
    ])
    agent_name = response.content.strip().lower()
    if agent_name not in ("portfolio", "technical", "recruiter", "fallback"):
        agent_name = "portfolio"
    return {"messages": [], "current_agent": agent_name}


def portfolio_node(state: AgentState) -> AgentState:
    response = llm.invoke([SystemMessage(content=PORTFOLIO_PROMPT)] + state["messages"])
    return {"messages": [response], "current_agent": state["current_agent"]}


def technical_node(state: AgentState) -> AgentState:
    response = llm.invoke([SystemMessage(content=TECHNICAL_PROMPT)] + state["messages"])
    return {"messages": [response], "current_agent": state["current_agent"]}


def recruiter_node(state: AgentState) -> AgentState:
    response = llm.invoke([SystemMessage(content=RECRUITER_PROMPT)] + state["messages"])
    return {"messages": [response], "current_agent": state["current_agent"]}


def fallback_node(state: AgentState) -> AgentState:
    response = llm.invoke([SystemMessage(content=FALLBACK_PROMPT)] + state["messages"])
    return {"messages": [response], "current_agent": state["current_agent"]}


def route_to_agent(state: AgentState) -> str:
    return state["current_agent"]


# --- Build graph ---

def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("router", router_node)
    graph.add_node("portfolio", portfolio_node)
    graph.add_node("technical", technical_node)
    graph.add_node("recruiter", recruiter_node)
    graph.add_node("fallback", fallback_node)

    graph.set_entry_point("router")

    graph.add_conditional_edges("router", route_to_agent, {
        "portfolio": "portfolio",
        "technical": "technical",
        "recruiter": "recruiter",
        "fallback": "fallback",
    })

    graph.add_edge("portfolio", END)
    graph.add_edge("technical", END)
    graph.add_edge("recruiter", END)
    graph.add_edge("fallback", END)

    return graph.compile()


agent = build_graph()
