# RAPHAEL.AGENT Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio site as an agent-themed IDE experience with ASCII art hero and VS Code-style file explorer.

**Architecture:** Single-page Next.js app with client-side state for file selection. Two main sections: hero (ASCII art + status) and file explorer (sidebar tree + content panel). All content stored as TypeScript data, no runtime file reading.

**Tech Stack:** Next.js 15, Tailwind CSS v4, Framer Motion, JetBrains Mono font, TypeScript

---

### Task 1: Update foundations (globals.css + layout.tsx)

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace globals.css with new dark-only theme**

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme {
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-mono: var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo,
    Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

:root {
  --radius: 0.5rem;
  --background: #0a0a0a;
  --foreground: #e0e0e0;
  --muted: #888888;
  --accent: #4ade80;
  --primary: #60a5fa;
  --sidebar-bg: #1a1a1a;
  --border: #2a2a2a;
  --selected: #2a2a2a;
  --tab-bg: #1a1a1a;
  --json-key: #60a5fa;
  --json-string: #f97316;
  --json-punct: #888888;
}

@layer base {
  * {
    @apply border-[var(--border)];
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--background);
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--muted);
}
```

- [ ] **Step 2: Update layout.tsx with JetBrains Mono font + dark-only**

```tsx
import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "RAPHAEL.AGENT — Research Engineer & LLM Developer",
  description:
    "Raphael Valdetaro — Research Engineer & LLM Developer. AI agent-themed portfolio.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify dev server starts**

Run: `npm run dev`
Expected: Site loads with dark background, no errors in console.

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css src/app/layout.tsx
git commit -m "refactor: update theme to dark-only with JetBrains Mono font"
```

---

### Task 2: Create agent file tree data

**Files:**
- Create: `src/data/agent-files.ts`

- [ ] **Step 1: Create the data file with all content**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/data/agent-files.ts` or check in IDE.

- [ ] **Step 3: Commit**

```bash
git add src/data/agent-files.ts
git commit -m "feat: add agent file tree data with all portfolio content"
```

---

### Task 3: Create HeroSection component

**Files:**
- Create: `src/components/HeroSection.tsx`

- [ ] **Step 1: Create the hero with ASCII art and typing status**

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { countByFolder } from "@/data/agent-files";

const ASCII_ART = `
██████╗   █████╗  ██████╗  ██╗  ██╗  █████╗  ███████╗ ██╗
██╔══██╗ ██╔══██╗ ██╔══██╗ ██║  ██║ ██╔══██╗ ██╔════╝ ██║
██████╔╝ ███████║ ██████╔╝ ███████║ ███████║ █████╗   ██║
██╔══██╗ ██╔══██║ ██╔═══╝  ██╔══██║ ██╔══██║ ██╔══╝   ██║
██║  ██║ ██║  ██║ ██║      ██║  ██║ ██║  ██║ ███████╗ ███████╗
╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝      ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚══════╝ ╚══════╝

          █████╗   ██████╗  ███████╗ ███╗   ██╗ ████████╗
         ██╔══██╗ ██╔════╝  ██╔════╝ ████╗  ██║ ╚══██╔══╝
         ███████║ ██║  ███╗ █████╗   ██╔██╗ ██║    ██║
         ██╔══██║ ██║   ██║ ██╔══╝   ██║╚██╗██║    ██║
    ██╗  ██║  ██║ ╚██████╔╝ ███████╗ ██║ ╚████║    ██║
    ╚═╝  ╚═╝  ╚═╝  ╚═════╝  ╚══════╝ ╚═╝  ╚═══╝    ╚═╝`.trimStart();

function TypingLine({ text, delay }: { text: string; delay: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timeout = setTimeout(
        () => setDisplayed(text.slice(0, displayed.length + 1)),
        30,
      );
      return () => clearTimeout(timeout);
    }
  }, [displayed, text, started]);

  return (
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="animate-pulse">▊</span>
      )}
    </span>
  );
}

export default function HeroSection() {
  const skillsCount = countByFolder("skills");
  const toolsCount = countByFolder("tools");
  const projectsCount = countByFolder("projects");

  return (
    <section className="w-full py-16 md:py-24 text-center overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="font-mono text-[5px] leading-[1.1] sm:text-[7px] md:text-[9px] lg:text-xs xl:text-sm whitespace-pre inline-block text-left"
          style={{ color: "var(--foreground)" }}
        >
          {ASCII_ART}
        </motion.pre>

        <div
          className="mt-8 font-mono text-sm md:text-base space-y-1"
          style={{ color: "var(--muted)" }}
        >
          <p>
            <span style={{ color: "var(--muted)" }}>{">"} </span>
            <TypingLine
              text="Research Engineer & LLM Developer"
              delay={800}
            />
          </p>
          <p>
            <span style={{ color: "var(--muted)" }}>{">"} </span>
            <TypingLine
              text={`Status: `}
              delay={2200}
            />
            <span style={{ color: "var(--accent)" }}>
              <TypingLine text="online" delay={2500} />
            </span>
            <TypingLine
              text={` | Skills: ${skillsCount} | Tools: ${toolsCount} | Projects: ${projectsCount}`}
              delay={2800}
            />
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: add HeroSection with ASCII art and typing status line"
```

---

### Task 4: Create FileTree components

**Files:**
- Create: `src/components/FileTreeItem.tsx`
- Create: `src/components/FileTree.tsx`

- [ ] **Step 1: Create FileTreeItem**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { AgentFile } from "@/data/agent-files";

type Props = {
  file: AgentFile;
  depth: number;
  selectedPath: string;
  onSelect: (path: string, file: AgentFile) => void;
  parentPath: string;
};

export default function FileTreeItem({
  file,
  depth,
  selectedPath,
  onSelect,
  parentPath,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const fullPath = parentPath ? `${parentPath}/${file.name}` : file.name;
  const isSelected = selectedPath === fullPath;
  const isFolder = file.type === "folder";

  const handleClick = () => {
    if (isFolder) {
      setExpanded(!expanded);
    } else {
      onSelect(fullPath, file);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="w-full text-left flex items-center gap-1.5 py-1 px-2 rounded-sm text-[13px] font-mono transition-colors duration-100 hover:bg-[var(--selected)]"
        style={{
          paddingLeft: `${depth * 16 + 8}px`,
          backgroundColor: isSelected ? "var(--selected)" : "transparent",
          color: isSelected ? "var(--foreground)" : "var(--muted)",
        }}
      >
        {isFolder && (
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="inline-block text-[10px]"
          >
            ▶
          </motion.span>
        )}
        <span>{isFolder ? (expanded ? "📂" : "📁") : file.name.endsWith(".json") ? "⚙️" : "📄"}</span>
        <span>{file.name}</span>
      </button>

      {isFolder && (
        <AnimatePresence initial={false}>
          {expanded && file.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden" }}
            >
              {file.children.map((child) => (
                <FileTreeItem
                  key={child.name}
                  file={child}
                  depth={depth + 1}
                  selectedPath={selectedPath}
                  onSelect={onSelect}
                  parentPath={fullPath}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create FileTree**

```tsx
"use client";

import type { AgentFile } from "@/data/agent-files";
import FileTreeItem from "./FileTreeItem";

type Props = {
  files: AgentFile[];
  selectedPath: string;
  onSelect: (path: string, file: AgentFile) => void;
};

export default function FileTree({ files, selectedPath, onSelect }: Props) {
  return (
    <div className="py-2">
      <p
        className="px-4 py-2 text-[11px] font-semibold tracking-widest uppercase"
        style={{ color: "var(--muted)" }}
      >
        Explorer
      </p>
      <p
        className="px-4 pb-2 text-[12px] font-mono"
        style={{ color: "var(--muted)" }}
      >
        raphael.agent
      </p>
      {files.map((file) => (
        <FileTreeItem
          key={file.name}
          file={file}
          depth={0}
          selectedPath={selectedPath}
          onSelect={onSelect}
          parentPath=""
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FileTreeItem.tsx src/components/FileTree.tsx
git commit -m "feat: add recursive FileTree and FileTreeItem components"
```

---

### Task 5: Create content renderers

**Files:**
- Create: `src/components/MarkdownRenderer.tsx`
- Create: `src/components/JsonRenderer.tsx`

- [ ] **Step 1: Create MarkdownRenderer**

A simple renderer that parses basic markdown (headings, bold, lists, links, paragraphs) into styled HTML. No external markdown library needed — the content is controlled and simple.

```tsx
"use client";

import React from "react";

function parseLine(line: string): React.ReactNode {
  // Parse inline elements: **bold**, [link](url), `code`
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Link
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);
    // Inline code
    const codeMatch = remaining.match(/`(.+?)`/);

    // Find earliest match
    const matches = [
      boldMatch ? { type: "bold", match: boldMatch, index: boldMatch.index! } : null,
      linkMatch ? { type: "link", match: linkMatch, index: linkMatch.index! } : null,
      codeMatch ? { type: "code", match: codeMatch, index: codeMatch.index! } : null,
    ]
      .filter(Boolean)
      .sort((a, b) => a!.index - b!.index);

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const earliest = matches[0]!;
    if (earliest.index > 0) {
      parts.push(remaining.slice(0, earliest.index));
    }

    if (earliest.type === "bold") {
      parts.push(
        <strong key={key++} className="font-semibold text-white">
          {earliest.match![1]}
        </strong>,
      );
      remaining = remaining.slice(earliest.index + earliest.match![0].length);
    } else if (earliest.type === "link") {
      parts.push(
        <a
          key={key++}
          href={earliest.match![2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors"
          style={{ color: "var(--primary)" }}
        >
          {earliest.match![1]}
        </a>,
      );
      remaining = remaining.slice(earliest.index + earliest.match![0].length);
    } else if (earliest.type === "code") {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded text-[13px] font-mono"
          style={{ backgroundColor: "var(--selected)" }}
        >
          {earliest.match![1]}
        </code>,
      );
      remaining = remaining.slice(earliest.index + earliest.match![0].length);
    }
  }

  return parts;
}

export default function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;

    // Headings
    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={i}
          className="text-2xl font-bold text-white mb-4 mt-2 first:mt-0"
        >
          {parseLine(line.slice(2))}
        </h1>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="text-lg font-semibold text-white mb-3 mt-6"
        >
          {parseLine(line.slice(3))}
        </h2>,
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={i}
          className="text-base font-semibold text-white mb-2 mt-4"
        >
          {parseLine(line.slice(4))}
        </h3>,
      );
    }
    // List items
    else if (line.startsWith("- ")) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && lines[i]?.startsWith("- ")) {
        listItems.push(
          <li key={i} className="ml-4 list-disc" style={{ color: "var(--muted)" }}>
            <span style={{ color: "var(--foreground)" }}>
              {parseLine(lines[i]!.slice(2))}
            </span>
          </li>,
        );
        i++;
      }
      elements.push(
        <ul key={`list-${i}`} className="space-y-1.5 mb-4 text-[15px]">
          {listItems}
        </ul>,
      );
      continue;
    }
    // Empty line
    else if (line.trim() === "") {
      // skip
    }
    // Paragraph
    else {
      elements.push(
        <p key={i} className="mb-3 text-[15px] leading-relaxed" style={{ color: "var(--foreground)" }}>
          {parseLine(line)}
        </p>,
      );
    }

    i++;
  }

  return <div className="max-w-2xl">{elements}</div>;
}
```

- [ ] **Step 2: Create JsonRenderer**

```tsx
"use client";

export default function JsonRenderer({ content }: { content: string }) {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    return (
      <pre className="font-mono text-sm" style={{ color: "var(--foreground)" }}>
        {content}
      </pre>
    );
  }

  const renderValue = (value: unknown): React.ReactNode => {
    if (typeof value === "string") {
      const isUrl =
        value.startsWith("http://") || value.startsWith("https://");
      const isEmail = value.includes("@") && !value.startsWith("http");

      if (isUrl) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80"
            style={{ color: "var(--json-string)" }}
          >
            &quot;{value}&quot;
          </a>
        );
      }
      if (isEmail) {
        return (
          <a
            href={`mailto:${value}`}
            className="underline underline-offset-2 hover:opacity-80"
            style={{ color: "var(--json-string)" }}
          >
            &quot;{value}&quot;
          </a>
        );
      }
      return (
        <span style={{ color: "var(--json-string)" }}>
          &quot;{value}&quot;
        </span>
      );
    }
    return (
      <span style={{ color: "var(--foreground)" }}>
        {String(value)}
      </span>
    );
  };

  const entries = Object.entries(parsed);

  return (
    <pre className="font-mono text-sm leading-7">
      <span style={{ color: "var(--json-punct)" }}>{"{"}</span>
      {"\n"}
      {entries.map(([key, value], idx) => (
        <span key={key}>
          {"  "}
          <span style={{ color: "var(--json-key)" }}>&quot;{key}&quot;</span>
          <span style={{ color: "var(--json-punct)" }}>: </span>
          {renderValue(value)}
          {idx < entries.length - 1 && (
            <span style={{ color: "var(--json-punct)" }}>,</span>
          )}
          {"\n"}
        </span>
      ))}
      <span style={{ color: "var(--json-punct)" }}>{"}"}</span>
    </pre>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/MarkdownRenderer.tsx src/components/JsonRenderer.tsx
git commit -m "feat: add MarkdownRenderer and JsonRenderer components"
```

---

### Task 6: Create ContentPanel component

**Files:**
- Create: `src/components/ContentPanel.tsx`

- [ ] **Step 1: Create ContentPanel with tab bar**

```tsx
"use client";

import { motion, AnimatePresence } from "motion/react";
import type { AgentFile } from "@/data/agent-files";
import MarkdownRenderer from "./MarkdownRenderer";
import JsonRenderer from "./JsonRenderer";

type Props = {
  selectedFile: AgentFile | null;
  selectedPath: string;
};

export default function ContentPanel({ selectedFile, selectedPath }: Props) {
  if (!selectedFile) {
    return (
      <div
        className="flex-1 flex items-center justify-center font-mono text-sm"
        style={{ color: "var(--muted)" }}
      >
        Select a file to view
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Tab bar */}
      <div
        className="flex items-center h-9 border-b px-2 shrink-0"
        style={{
          backgroundColor: "var(--tab-bg)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-1 text-[13px] font-mono border-b-2"
          style={{
            color: "var(--foreground)",
            borderColor: "var(--primary)",
          }}
        >
          <span>
            {selectedFile.name.endsWith(".json") ? "⚙️" : "📄"}
          </span>
          <span>{selectedPath}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPath}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {selectedFile.contentType === "json" ? (
              <JsonRenderer content={selectedFile.content ?? "{}"} />
            ) : (
              <MarkdownRenderer content={selectedFile.content ?? ""} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ContentPanel.tsx
git commit -m "feat: add ContentPanel with tab bar and content switching"
```

---

### Task 7: Create FileExplorer container

**Files:**
- Create: `src/components/FileExplorer.tsx`

- [ ] **Step 1: Create the split-pane explorer**

```tsx
"use client";

import { useState } from "react";
import { agentFileTree } from "@/data/agent-files";
import type { AgentFile } from "@/data/agent-files";
import FileTree from "./FileTree";
import ContentPanel from "./ContentPanel";

export default function FileExplorer() {
  const defaultFile = agentFileTree[0]!; // AGENT.md
  const [selectedPath, setSelectedPath] = useState("AGENT.md");
  const [selectedFile, setSelectedFile] = useState<AgentFile>(defaultFile);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelect = (path: string, file: AgentFile) => {
    setSelectedPath(path);
    setSelectedFile(file);
    setSidebarOpen(false); // close on mobile
  };

  return (
    <section
      className="w-full border-t"
      style={{
        borderColor: "var(--border)",
        height: "calc(100vh - 280px)",
        minHeight: "500px",
      }}
    >
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden w-full flex items-center gap-2 px-4 py-2 text-[13px] font-mono border-b"
        style={{
          backgroundColor: "var(--sidebar-bg)",
          color: "var(--muted)",
          borderColor: "var(--border)",
        }}
      >
        <span>{sidebarOpen ? "▼" : "▶"}</span>
        <span>EXPLORER</span>
        <span style={{ color: "var(--foreground)" }}>{selectedPath}</span>
      </button>

      <div className="flex h-full">
        {/* Sidebar - desktop always visible, mobile toggled */}
        <div
          className={`
            ${sidebarOpen ? "block" : "hidden"} md:block
            w-full md:w-[280px] md:min-w-[280px]
            border-r overflow-y-auto shrink-0
            absolute md:relative z-20 md:z-auto
          `}
          style={{
            backgroundColor: "var(--sidebar-bg)",
            borderColor: "var(--border)",
            height: sidebarOpen ? "calc(100vh - 320px)" : undefined,
          }}
        >
          <FileTree
            files={agentFileTree}
            selectedPath={selectedPath}
            onSelect={handleSelect}
          />
        </div>

        {/* Content panel */}
        <div
          className="flex-1 flex flex-col min-h-0"
          style={{ backgroundColor: "var(--background)" }}
        >
          <ContentPanel
            selectedFile={selectedFile}
            selectedPath={selectedPath}
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FileExplorer.tsx
git commit -m "feat: add FileExplorer split-pane container with mobile support"
```

---

### Task 8: Wire up page.tsx and clean up

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite page.tsx**

```tsx
import HeroSection from "@/components/HeroSection";
import FileExplorer from "@/components/FileExplorer";

export default function Page() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <HeroSection />
      <FileExplorer />
    </div>
  );
}
```

- [ ] **Step 2: Verify the full page works**

Run: `npm run dev`
Expected: Hero with ASCII art appears, file explorer below with sidebar and AGENT.md content visible. Clicking files in the tree switches content.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire up page with HeroSection and FileExplorer"
```

---

### Task 9: Clean up unused files

**Files:**
- Delete: `src/components/FlickeringBackgroundClient.tsx`
- Delete: `src/components/animate-ui/backgrounds/hexagon.tsx`
- Delete: `src/components/animate-ui/backgrounds/stars.tsx`
- Delete: `src/components/animate-ui/text/typing.tsx`
- Delete: `src/components/magicui/dot-pattern.tsx`
- Delete: `src/components/magicui/flickering-grid.tsx`
- Delete: `src/components/ui/avatar.tsx`
- Delete: `src/components/ui/button.tsx`
- Delete: `src/components/ui/card.tsx`
- Delete: `src/components/ui/input.tsx`
- Delete: `src/components/ui/label.tsx`
- Delete: `src/components/ui/textarea.tsx`

- [ ] **Step 1: Remove unused component files**

```bash
rm src/components/FlickeringBackgroundClient.tsx
rm -r src/components/animate-ui
rm -r src/components/magicui
rm -r src/components/ui
```

- [ ] **Step 2: Verify build still works**

Run: `npm run build`
Expected: Build succeeds with no import errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove unused UI components from old design"
```

---

### Task 10: Build and deploy

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Static export succeeds, output in `out/` directory.

- [ ] **Step 2: Verify static output**

Check that `out/index.html` exists and the site works when served locally.

- [ ] **Step 3: Commit built files if needed for GitHub Pages**

```bash
git add -A
git commit -m "build: generate static output for GitHub Pages deployment"
```
