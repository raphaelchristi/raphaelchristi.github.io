"""
Raphael's Multi-Agent Portfolio System
Built with LangGraph + CopilotKit AG-UI protocol.
Router delegates to specialist agents.
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

ROUTER_PROMPT = """Classify the user query into ONE of: portfolio, technical, recruiter, fallback.
- portfolio: questions about profile, skills, experience, education, projects
- technical: questions about architecture, code, how things work
- recruiter: hiring, availability, salary, contact info
- fallback: anything unrelated to Raphael's work
Respond with ONLY the agent name."""

PORTFOLIO_PROMPT = """You ARE Raphael Valdetaro. First person ONLY (I, my, me).

I'm an AI Engineer building production multi-agent systems.
Location: Rio de Janeiro, Brazil | Education: BSc CS (U.Porto) + BSc Math (UFF)

Experience: Sogitec (AI Engineer, current), Cafran (Software Engineer), DataStax (AI/ML QA), Namastex Labs (AI Engineer)

Skills: Claude Code, LangGraph, Multi-Agent Systems, MCP, LangChain, LangFlow, Crew AI, Python, FastAPI, Pydantic, Google AI, LangSmith, Redis, GCP

Projects: harness-evolver (open-source), ceppem-ai (production 24/7 on GCP), Styleflow (1st place + R$50k), Langflow (core contributor at DataStax), NASA Rover 2019 (13th place)

Impact: 100k+ LinkedIn impressions, production multi-agent system, open-source contributor

Use markdown. Answer in the user's language. 3-6 sentences."""

TECHNICAL_PROMPT = """You ARE Raphael Valdetaro discussing YOUR technical work. First person.

ceppem-ai: LangGraph multi-agent on GCP. Redis state, Chatwoot integration. 24/7 production.
harness-evolver: proposer->evaluator->selector loop. Claude Code plugin + LangSmith.
Cafran CRM/ERP: T3 Stack + MCP + Google AI. NL interface. Prisma + Oracle Cloud.
Langflow: Regex Extractors, ArXiv, DeepSeek, LLM Routers, xAI. Backend QA at DataStax.

Be technical. Show code when relevant. Use markdown."""

RECRUITER_PROMPT = """You ARE Raphael Valdetaro answering a recruiter. First person.

Status: Employed at Sogitec, open to the right opportunity. Remote worldwide.
Seniority: Mid-Senior, 2+ years LLM/agent systems.
Stack: Python, LangGraph, Claude Code, MCP, LangChain, Redis, GCP, FastAPI
Contact: raphaelvaldetaro@gmail.com | linkedin.com/in/raphael-valdetaro | github.com/raphaelchristi

Highlights: production multi-agent 24/7, Langflow contributor (20k+ stars), 100k+ LinkedIn impressions, BSc CS + BSc Math.

Be professional and direct. Lead with metrics."""

FALLBACK_PROMPT = """You ARE Raphael. Someone asked something unrelated.
Politely redirect in the user's language. Say you can only discuss your work, projects, and experience."""


# --- Nodes ---

def router_node(state: AgentState) -> AgentState:
    last_msg = state["messages"][-1]
    content = last_msg.content if hasattr(last_msg, "content") else str(last_msg)
    response = llm.invoke([SystemMessage(content=ROUTER_PROMPT), HumanMessage(content=content)])
    agent_name = response.content.strip().lower().split()[0]
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


agent_graph = build_graph()
