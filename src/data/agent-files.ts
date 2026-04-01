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

You are **Raphael Valdetaro**, a Research Engineer & LLM Developer specialized in building AI-powered solutions.

## Core Directives
- Build innovative Generative AI applications
- Contribute to open-source AI frameworks
- Research and develop LLM-based solutions
- Transform complex problems into efficient solutions

## Background
Artificial Intelligence and Large Language Models (LLMs) enthusiast, passionate about research and development of innovative solutions. Strong expertise in Python and Data Science, using tools like LangChain, LangFlow, LlamaIndex, Pydantic, Crew AI, n8n, and Google AI (ADK) to build advanced Generative AI applications.

## Approach
Driven by creativity and innovation, always focused on delivering efficient solutions to complex problems. Open-source contributor and continuous learner.

## Model Info
- **Version:** human-v1.0
- **Location:** Brazil
- **Languages:** Portuguese (native), English (fluent)
- **Status:** open_to_opportunities`,
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

Primary programming language for AI/ML development, data science, and backend services.

**Used In:**
- Styleflow (1st Place IA Devs Langflow)
- Langflow open-source contributions
- CRM/ERP system at Arpa Solutions`,
      },
      {
        name: "langchain.md",
        type: "file",
        contentType: "markdown",
        content: `# LangChain

**Proficiency:** Advanced

Framework for developing applications powered by language models. Building chains, agents, and RAG pipelines.

**Used In:**
- Styleflow
- AI application development`,
      },
      {
        name: "ai-research.md",
        type: "file",
        contentType: "markdown",
        content: `# AI Research

**Proficiency:** Advanced

Research and development of innovative AI solutions, with focus on LLMs, prompt engineering, and generative AI applications.

**Used In:**
- All projects and contributions`,
      },
      {
        name: "crew-ai.md",
        type: "file",
        contentType: "markdown",
        content: `# Crew AI

**Proficiency:** Advanced

Multi-agent orchestration framework for building collaborative AI systems.

**Used In:**
- AI agent workflows
- Multi-agent application development`,
      },
      {
        name: "langflow.md",
        type: "file",
        contentType: "markdown",
        content: `# LangFlow

**Proficiency:** Advanced

Visual framework for building LLM applications. Active open-source contributor with multiple merged PRs.

**Used In:**
- Styleflow competition
- Open-source contributions (components, templates, integrations)`,
      },
      {
        name: "llamaindex.md",
        type: "file",
        contentType: "markdown",
        content: `# LlamaIndex

**Proficiency:** Intermediate

Data framework for LLM applications. Used for building RAG systems and data connectors.

**Used In:**
- AI application development
- Data pipeline integrations`,
      },
      {
        name: "pydantic.md",
        type: "file",
        contentType: "markdown",
        content: `# Pydantic

**Proficiency:** Advanced

Data validation and settings management using Python type annotations.

**Used In:**
- API development with FastAPI
- LLM application schemas
- Langflow component development`,
      },
      {
        name: "spacy.md",
        type: "file",
        contentType: "markdown",
        content: `# spaCy

**Proficiency:** Intermediate

Industrial-strength NLP library for advanced natural language processing tasks.

**Used In:**
- NLP pipelines
- Text processing and entity extraction`,
      },
      {
        name: "google-ai-adk.md",
        type: "file",
        contentType: "markdown",
        content: `# Google AI (ADK)

**Proficiency:** Advanced

Google's Agent Development Kit for building AI agents and applications.

**Used In:**
- Langflow integrations (Gemini models)
- AI application development`,
      },
      {
        name: "n8n.md",
        type: "file",
        contentType: "markdown",
        content: `# n8n

**Proficiency:** Intermediate

Workflow automation platform for connecting services and building automation pipelines.

**Used In:**
- AI workflow automation
- Integration pipelines`,
      },
      {
        name: "data-science.md",
        type: "file",
        contentType: "markdown",
        content: `# Data Science

**Proficiency:** Advanced

Statistical analysis, data visualization, and machine learning with Python ecosystem (pandas, numpy, scikit-learn).

**Used In:**
- AI research and development
- Data analysis projects`,
      },
      {
        name: "haskell.md",
        type: "file",
        contentType: "markdown",
        content: `# Haskell

**Proficiency:** Intermediate

Functional programming language. Academic background in pure functional paradigms.

**Used In:**
- Academic studies
- Functional programming concepts`,
      },
      {
        name: "c.md",
        type: "file",
        contentType: "markdown",
        content: `# C

**Proficiency:** Intermediate

Systems programming language. Low-level programming and algorithm implementation.

**Used In:**
- Academic studies
- Systems-level programming`,
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

High-performance Python web framework for building APIs. Used for serving AI models and building backend services.`,
      },
      {
        name: "postgresql.md",
        type: "file",
        contentType: "markdown",
        content: `# PostgreSQL

**Category:** Database

Relational database for structured data storage. Used in CRM/ERP systems and application backends.`,
      },
      {
        name: "git.md",
        type: "file",
        contentType: "markdown",
        content: `# Git

**Category:** Version Control

Distributed version control system. Daily driver for all development work and open-source contributions.`,
      },
      {
        name: "github.md",
        type: "file",
        contentType: "markdown",
        content: `# GitHub

**Category:** Platform

Code hosting and collaboration. Active contributor to open-source projects including Langflow.`,
      },
      {
        name: "linux.md",
        type: "file",
        contentType: "markdown",
        content: `# Linux

**Category:** Operating System

Primary development environment. System administration and deployment.`,
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

**Status:** Completed | **Award:** 1st Place

AI solution for fashion e-commerce, achieving 1st place and a R$ 50,000 prize in the Langflow IA Devs competition.

As the team's CRO, contributed to this tool that uses colorimetry and AI to analyze user characteristics and recommend personalized outfits, combating cart abandonment and offering a tailor-made shopping experience.

Since the competition, the solution has been enhanced with more efficient AI models and prompts for various occasions.

**Stack:** Python, LangFlow, Generative AI

**Links:**
- [Read Article on IT Forum](https://itforum.com.br/inteligencia-artificial/styleflow-looks-ia-vence-langflow/)`,
      },
      {
        name: "langflow-contrib.md",
        type: "file",
        contentType: "markdown",
        content: `# Langflow Open-Source Contributions

**Status:** Ongoing

Active contributor to Langflow, a leading open-source framework for building LLM applications.

**Contributions include:**
- Development of new components (Regex Pattern Extractors, ArXiv, Git, DeepSeek Models, LLM Routers)
- xAI integration
- Addition and updating of language models (Google AI, Groq, Gemini)
- Creation of templates (YouTube Video Analysis)
- Refactoring and improvement of existing components

**Links:**
- [View Commits on GitHub](https://github.com/langflow-ai/langflow/commits?author=raphaelchristi)`,
      },
      {
        name: "nasa-rover.md",
        type: "file",
        contentType: "markdown",
        content: `# NASA Human Exploration Rover Challenge 2019

**Status:** Completed | **Result:** 13th Place Overall

In April 2019, part of the "Alpha Team," one of four Brazilian teams representing the country in this international NASA competition held in Alabama, USA.

The team secured 13th place overall (out of 100+ international teams) and 2nd place among Brazilian teams.

This project involved designing, building, and testing a human-powered rover to traverse a simulated extraterrestrial terrain.

**Links:**
- [Read News Article](https://www.osaqua.com.br/2019/05/14/saquarema-presente-na-nasa-human-exploration-rover-challenge-2019/)`,
      },
      {
        name: "crm-erp.md",
        type: "file",
        contentType: "markdown",
        content: `# Internal CRM/ERP System

**Status:** Completed

During an internship at Arpa Elastic Solution, developed and implemented an internal CRM and ERP system.

**Stack:** PostgreSQL, Power Apps, Python (CRUD operations)

Optimized the company's internal processes through a custom-built management system.`,
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

*(To be filled by Raphael)*`,
      },
      {
        name: "experience.md",
        type: "file",
        contentType: "markdown",
        content: `# Experience

## Arpa Elastic Solution — Intern
Developed and implemented an internal CRM/ERP system using PostgreSQL, Power Apps, and Python.

## Langflow — Open Source Contributor
Active contributor to the Langflow framework. Multiple merged PRs including new components, integrations, and templates.

## Styleflow — CRO
Led the CRO efforts for Styleflow, the AI fashion e-commerce solution that won 1st place at IA Devs Langflow competition.`,
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
            role: "Research Engineer & LLM Developer",
            email: "raphaelvaldetaro@gmail.com",
            linkedin: "https://www.linkedin.com/in/raphael-valdetaro/",
            github: "https://github.com/raphaelchristi",
            location: "Brazil",
            status: "open_to_opportunities",
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
