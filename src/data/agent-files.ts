export type AgentFile = {
  name: string;
  type: "file" | "folder";
  contentType?: "markdown" | "json";
  content?: string;
  children?: AgentFile[];
};

export const agentFileTree: AgentFile[] = [
  {
    name: "AGENT.md",
    type: "file",
    contentType: "markdown",
    content: `# System Prompt

You are **Raphael Valdetaro**, an AI Engineer & AI Architect building intelligent systems that bridge the gap between cutting-edge LLM research and production-grade applications.

## Core Directives
- Architect and deploy production AI systems using LLMs, agents, and RAG pipelines
- Contribute to open-source AI frameworks at scale (Langflow @ DataStax)
- Design full-stack applications with AI-native capabilities (MCP, agentic workflows)
- Ship fast, iterate faster — from prototype to production

## Background
Computer Science graduate from the University of Porto with a Mathematics foundation from Universidade Federal Fluminense. Hands-on experience building AI products at DataStax, Sogitec, Namastex Labs, and Cafran — from QA engineering on Langflow's open-source codebase to architecting full-stack AI-powered CRM systems with natural language interfaces.

## Approach
Code-first, research-informed. I don't just use AI frameworks — I contribute to them. My open-source work on Langflow has directly impacted thousands of developers worldwide. I build with LangChain, LangGraph, Claude Code, and MCP to create systems that are both powerful and practical.

## Model Info
- **Version:** human-v1.0
- **Location:** Rio de Janeiro, Brazil
- **Languages:** Portuguese (native), English (fluent)
- **Education:** BSc Computer Science (U.Porto) + BSc Mathematics (UFF)
- **Status:** building`,
  },
  {
    name: "skills",
    type: "folder",
    children: [
      {
        name: "python.md",
        type: "file",
        contentType: "markdown",
        content: `# Python

**Proficiency:** Advanced

Primary language for everything AI/ML — from building LangChain agents to FastAPI backends and data pipelines. Daily driver across all professional roles.

**Used In:**
- Langflow open-source contributions @ DataStax
- AI-powered CRM/ERP @ Cafran (backend + AI services)
- Styleflow (1st Place, IA Devs Langflow)
- All AI engineering work @ Sogitec & Namastex Labs`,
      },
      {
        name: "langchain.md",
        type: "file",
        contentType: "markdown",
        content: `# LangChain

**Proficiency:** Advanced

Framework for building LLM-powered applications — chains, agents, RAG pipelines, and tool-use patterns. Deep experience with the ecosystem including LangGraph for stateful agent orchestration.

**Used In:**
- Production AI systems @ Sogitec
- Agent architectures @ Namastex Labs
- Styleflow competition`,
      },
      {
        name: "langgraph.md",
        type: "file",
        contentType: "markdown",
        content: `# LangGraph

**Proficiency:** Advanced

Framework for building stateful, multi-step agent workflows as graphs. Used for complex agentic systems with branching logic, cycles, and human-in-the-loop patterns.

**Used In:**
- Multi-agent systems @ Sogitec
- Complex workflow orchestration
- Production agentic applications`,
      },
      {
        name: "langflow.md",
        type: "file",
        contentType: "markdown",
        content: `# LangFlow

**Proficiency:** Advanced

Visual framework for building LLM applications, maintained by DataStax. Not just a user — active contributor to the core codebase with dozens of merged PRs including new components, integrations, and templates.

**Used In:**
- Core contributor @ DataStax (QA + development)
- Styleflow competition (1st place)
- Component development (Regex Extractors, ArXiv, DeepSeek, LLM Routers, xAI)`,
      },
      {
        name: "mcp.md",
        type: "file",
        contentType: "markdown",
        content: `# Model Context Protocol (MCP)

**Proficiency:** Advanced

Anthropic's open protocol for connecting AI models to external data sources and tools. Built production MCP integrations enabling natural language interfaces to enterprise systems.

**Used In:**
- AI Chat system @ Cafran (MCP + Google ecosystem for CRM/ERP queries)
- Tool-use architectures across multiple projects`,
      },
      {
        name: "claude-code.md",
        type: "file",
        contentType: "markdown",
        content: `# Claude Code

**Proficiency:** Advanced

Anthropic's agentic coding tool. Power user for development workflows, custom skills, hooks, and multi-agent development patterns.

**Used In:**
- Daily development workflow
- Custom skill and agent development
- This portfolio (built with Claude Code)`,
      },
      {
        name: "typescript.md",
        type: "file",
        contentType: "markdown",
        content: `# TypeScript

**Proficiency:** Advanced

Type-safe JavaScript for building robust full-stack applications. Used with Next.js, tRPC, and React for production frontends and APIs.

**Used In:**
- Full-stack CRM/ERP @ Cafran (T3 Stack)
- Frontend applications
- Type-safe API development with tRPC`,
      },
      {
        name: "nextjs.md",
        type: "file",
        contentType: "markdown",
        content: `# Next.js

**Proficiency:** Advanced

React framework for production web applications. Server components, static generation, and full-stack capabilities with the App Router.

**Used In:**
- CRM/ERP application @ Cafran (T3 Stack)
- This portfolio site
- Production web applications`,
      },
      {
        name: "crew-ai.md",
        type: "file",
        contentType: "markdown",
        content: `# Crew AI

**Proficiency:** Advanced

Multi-agent orchestration framework for building collaborative AI systems with role-based agents and task delegation.

**Used In:**
- Multi-agent workflows
- Collaborative AI system design`,
      },
      {
        name: "llamaindex.md",
        type: "file",
        contentType: "markdown",
        content: `# LlamaIndex

**Proficiency:** Intermediate

Data framework for LLM applications — RAG systems, data connectors, and indexing pipelines.

**Used In:**
- RAG pipeline development
- Data integration for LLM applications`,
      },
      {
        name: "pydantic.md",
        type: "file",
        contentType: "markdown",
        content: `# Pydantic

**Proficiency:** Advanced

Data validation and settings management with Python type annotations. Essential for structured outputs, API schemas, and LLM response parsing.

**Used In:**
- API schemas (FastAPI)
- LLM structured output parsing
- Langflow component development @ DataStax`,
      },
      {
        name: "google-ai.md",
        type: "file",
        contentType: "markdown",
        content: `# Google AI Services

**Proficiency:** Advanced

Google's AI ecosystem including Gemini models, ADK (Agent Development Kit), and Vertex AI. Built production integrations with Google's AI stack.

**Used In:**
- MCP + Google ecosystem integration @ Cafran
- Langflow Gemini/Google AI components @ DataStax
- AI application development`,
      },
      {
        name: "data-science.md",
        type: "file",
        contentType: "markdown",
        content: `# Data Science

**Proficiency:** Advanced

Statistical analysis, data visualization, and ML with the Python ecosystem (pandas, numpy, scikit-learn). Mathematics background from UFF provides strong foundation.

**Used In:**
- AI research and model evaluation
- Data analysis and visualization
- Mathematical foundations for ML`,
      },
    ],
  },
  {
    name: "tools",
    type: "folder",
    children: [
      {
        name: "fastapi.md",
        type: "file",
        contentType: "markdown",
        content: `# FastAPI

**Category:** Backend Framework

High-performance Python web framework for building APIs. Used for serving AI models, building microservices, and creating backend infrastructure for AI applications.`,
      },
      {
        name: "prisma.md",
        type: "file",
        contentType: "markdown",
        content: `# Prisma ORM

**Category:** Database Toolkit

Type-safe ORM for Node.js/TypeScript. Used for database schema design, migrations, and optimized queries against Oracle Cloud Database in production CRM/ERP systems.`,
      },
      {
        name: "oracle-cloud.md",
        type: "file",
        contentType: "markdown",
        content: `# Oracle Cloud Infrastructure (OCI)

**Category:** Cloud Platform

Enterprise cloud platform used for database hosting and infrastructure. Designed data architectures optimized for high-performance client and order operations.`,
      },
      {
        name: "trpc.md",
        type: "file",
        contentType: "markdown",
        content: `# tRPC

**Category:** API Framework

End-to-end type-safe APIs for TypeScript applications. Used with the T3 Stack for building full-stack applications with zero API contract drift.`,
      },
      {
        name: "postgresql.md",
        type: "file",
        contentType: "markdown",
        content: `# PostgreSQL

**Category:** Database

Relational database for structured data storage. Used across multiple projects for application backends and data persistence.`,
      },
      {
        name: "git.md",
        type: "file",
        contentType: "markdown",
        content: `# Git & GitHub

**Category:** Version Control & Collaboration

Daily driver for all development and open-source contributions. Extensive experience with PR workflows, code review processes, and collaborative development on large repositories like Langflow.`,
      },
      {
        name: "linux.md",
        type: "file",
        contentType: "markdown",
        content: `# Linux

**Category:** Operating System

Primary development and deployment environment. System administration, containerization, and server management.`,
      },
      {
        name: "n8n.md",
        type: "file",
        contentType: "markdown",
        content: `# n8n

**Category:** Workflow Automation

Visual workflow automation platform for connecting services and building integration pipelines. Used for AI workflow orchestration and data processing automation.`,
      },
    ],
  },
  {
    name: "projects",
    type: "folder",
    children: [
      {
        name: "styleflow.md",
        type: "file",
        contentType: "markdown",
        content: `# Styleflow

**Status:** Completed | **Award:** 1st Place | **Prize:** R$ 50,000

AI-powered fashion e-commerce solution that won 1st place at the Langflow IA Devs competition. Uses colorimetry and generative AI to analyze user characteristics and recommend personalized outfits, combating cart abandonment with a tailor-made shopping experience.

As the team's CRO, led conversion optimization strategy while contributing to the AI architecture. Post-competition, enhanced with more efficient models and multi-occasion prompt engineering.

**Stack:** Python, LangFlow, Generative AI, Colorimetry

**Links:**
- [Read Article on IT Forum](https://itforum.com.br/inteligencia-artificial/styleflow-looks-ia-vence-langflow/)`,
      },
      {
        name: "cafran-crm.md",
        type: "file",
        contentType: "markdown",
        content: `# AI-Powered CRM/ERP System

**Status:** Completed | **Company:** Cafran

Full-stack CRM/ERP system with an AI-native natural language interface. Users can ask questions about clients, orders, and business data in plain language and get contextualized real-time responses — no complex training required.

**Key achievements:**
- Designed data architecture with Prisma ORM optimized for Oracle Cloud Database
- Built complete frontend with T3 Stack (Next.js, TypeScript, tRPC, shadcn/ui)
- Implemented MCP-based AI chat integrated with Google ecosystem
- Developed type-safe APIs ensuring seamless frontend-backend-AI communication

**Stack:** Next.js, TypeScript, tRPC, Prisma, Oracle Cloud, MCP, Google AI

**Impact:** Eliminated the need for complex system training — users interact with enterprise data through natural language.`,
      },
      {
        name: "langflow-contrib.md",
        type: "file",
        contentType: "markdown",
        content: `# Langflow Open-Source Contributions

**Status:** Ongoing | **Context:** DataStax (AI/ML QA Engineer)

Core contributor to Langflow, one of the most popular open-source frameworks for building LLM applications (20k+ GitHub stars). Contributed as part of the DataStax engineering team, directly impacting thousands of developers worldwide.

**Contributions include:**
- New components: Regex Pattern Extractors, ArXiv, Git, DeepSeek Models, LLM Routers
- xAI integration
- Google AI, Groq, and Gemini model updates
- YouTube Video Analysis template
- Quality assurance and testing for platform stability
- Code review and PR development

**Links:**
- [View Commits on GitHub](https://github.com/langflow-ai/langflow/commits?author=raphaelchristi)`,
      },
      {
        name: "nasa-rover.md",
        type: "file",
        contentType: "markdown",
        content: `# NASA Human Exploration Rover Challenge 2019

**Status:** Completed | **Result:** 13th Place Overall (100+ teams)

Represented Brazil as part of the "Alpha Team" at NASA's international competition in Alabama, USA. One of only four Brazilian teams selected. Secured 13th place overall and 2nd among Brazilian teams.

Designed, built, and tested a human-powered rover to traverse simulated extraterrestrial terrain — an experience in engineering, teamwork, and problem-solving under pressure.

**Links:**
- [Read News Article](https://www.osaqua.com.br/2019/05/14/saquarema-presente-na-nasa-human-exploration-rover-challenge-2019/)`,
      },
    ],
  },
  {
    name: "memory",
    type: "folder",
    children: [
      {
        name: "education.md",
        type: "file",
        contentType: "markdown",
        content: `# Education

## Universidade do Porto — BSc Computer Science
Porto, Portugal (2020)

Studied at one of Portugal's top universities, gaining strong foundations in algorithms, systems architecture, and software engineering.

## Universidade Federal Fluminense — BSc Mathematics
Niterói, Brazil (2018)

Mathematical foundations that inform my approach to data science, ML model evaluation, and algorithmic thinking.

## Certifications
- **AI Fluency Framework**`,
      },
      {
        name: "experience.md",
        type: "file",
        contentType: "markdown",
        content: `# Experience

## Sogitec - Soluções Digitais — AI Engineer
*July 2025 – Present*

Building AI-powered digital solutions and intelligent systems for enterprise clients.

## Cafran — Software Engineer
*May 2025 – December 2025*

Architected and built a full-stack AI-powered CRM/ERP system using the T3 Stack with a natural language interface via MCP + Google AI. Designed the database layer on Oracle Cloud with Prisma ORM.

## DataStax — AI/ML QA Engineer
*November 2024 – July 2025*

Quality assurance and open-source development on the Langflow platform. Contributed dozens of PRs including new components, integrations, and templates. Collaborated directly with engineering teams on one of the most popular AI developer tools in the world.

## Namastex Labs — AI Engineer
*July 2024 – June 2025*

Built AI solutions and agent architectures in a remote-first AI research lab.`,
      },
    ],
  },
  {
    name: "config",
    type: "folder",
    children: [
      {
        name: "contact.json",
        type: "file",
        contentType: "json",
        content: JSON.stringify(
          {
            name: "Raphael Valdetaro",
            role: "AI Engineer & AI Architect",
            email: "raphaelvaldetaro@gmail.com",
            linkedin: "https://www.linkedin.com/in/raphael-valdetaro/",
            github: "https://github.com/raphaelchristi",
            location: "Rio de Janeiro, Brazil",
            status: "building",
          },
          null,
          2,
        ),
      },
    ],
  },
];

export function flattenFiles(
  files: AgentFile[],
  path = "",
): { path: string; file: AgentFile }[] {
  const result: { path: string; file: AgentFile }[] = [];
  for (const file of files) {
    const fullPath = path ? `${path}/${file.name}` : file.name;
    if (file.type === "file") {
      result.push({ path: fullPath, file });
    }
    if (file.children) {
      result.push(...flattenFiles(file.children, fullPath));
    }
  }
  return result;
}

export function countByFolder(folder: string): number {
  const root = agentFileTree.find(
    (f) => f.name === folder && f.type === "folder",
  );
  if (!root?.children) return 0;
  return root.children.length;
}
