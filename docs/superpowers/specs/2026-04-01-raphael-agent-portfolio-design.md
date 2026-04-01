# RAPHAEL.AGENT — Portfolio Redesign Spec

## Overview

Refactor the personal portfolio site to present Raphael Valdetaro as an AI agent, using the metaphor of agent architecture (file tree, skills, tools, projects, memory, config). The visual style is inspired by the Hermes Agent site (minimalist, dev-first) combined with a VS Code-style file explorer for navigation and content display.

## Architecture

Single-page Next.js app with two main sections:

1. **Hero Section** — ASCII art banner + agent status line
2. **File Explorer Section** — split-pane IDE-style layout (sidebar + content panel)

No traditional navigation. The file tree IS the navigation.

## Section 1: Hero

### ASCII Art Banner

Large ASCII art rendering of "RAPHAEL.AGENT" using block characters (`██`). Appears with a fade-in animation on page load.

### Status Line

Below the ASCII art, a terminal-style status line with typing effect:

```
> Research Engineer & LLM Developer
> Status: online | Skills: 17 | Tools: 12 | Projects: 4
```

- Uses monospace font
- Green accent color for "online" status
- Typing animation using the existing `TypingText` component or a similar approach
- Stats numbers are derived from the actual content counts

### Layout

- Full-width, centered content
- Generous vertical padding (py-20 to py-32)
- Dark background matching the overall theme

## Section 2: File Explorer

### Layout

Split-pane layout occupying `calc(100vh - hero_height)`:

- **Left panel (sidebar):** ~280px fixed width, scrollable independently
- **Right panel (content):** fills remaining width, scrollable independently
- Divider line between panels (subtle border)

### Sidebar — File Tree

Header: "EXPLORER" in small caps at the top.

File tree structure:

```
raphael.agent/
├── AGENT.md
├── skills/
│   ├── python.md
│   ├── langchain.md
│   ├── ai-research.md
│   ├── crew-ai.md
│   ├── langflow.md
│   ├── llamaindex.md
│   ├── pydantic.md
│   ├── spacy.md
│   ├── google-ai-adk.md
│   ├── n8n.md
│   ├── data-science.md
│   ├── haskell.md
│   ├── c.md
│   └── shadcn-ui.md
├── tools/
│   ├── fastapi.md
│   ├── postgresql.md
│   ├── git.md
│   ├── github.md
│   └── linux.md
├── projects/
│   ├── styleflow.md
│   ├── langflow-contrib.md
│   ├── nasa-rover.md
│   └── crm-erp.md
├── memory/
│   ├── education.md
│   └── experience.md
└── config/
    └── contact.json
```

Interactions:
- Folders are collapsible/expandable with smooth animation (chevron icon rotates)
- Clicking a file highlights it and opens its content in the right panel
- Folder icons: closed/open folder emoji or SVG icons
- File icons: document icon, with special icon for `.json` files
- `AGENT.md` is selected by default on page load
- All folders start expanded on initial load

### Content Panel — File Viewer

Header: Tab bar showing the currently open file name (like VS Code tabs). Single tab only (no multi-tab).

Content rendering rules by file type:

#### AGENT.md (System Prompt / Bio)

Rendered as styled markdown. Content:

```markdown
# System Prompt

You are Raphael Valdetaro, a Research Engineer & LLM Developer
specialized in building AI-powered solutions.

## Core Directives
- Build innovative Generative AI applications
- Contribute to open-source AI frameworks
- Research and develop LLM-based solutions
- Transform complex problems into efficient solutions

## Background
Artificial Intelligence and Large Language Models (LLMs) enthusiast,
passionate about research and development of innovative solutions.
Strong expertise in Python and Data Science, using tools like
LangChain, LangFlow, LlamaIndex, Pydantic, Crew AI, n8n, and
Google AI (ADK) to build advanced Generative AI applications.

## Approach
Driven by creativity and innovation, always focused on delivering
efficient solutions to complex problems. Open-source contributor
and continuous learner.

## Model Info
- Version: human-v1.0
- Location: Brazil
- Languages: Portuguese (native), English (fluent)
- Status: open_to_opportunities
```

#### skills/*.md

Each skill file renders as a card-like section within the panel:

```markdown
# Python

## Proficiency: Advanced

## Description
Primary programming language for AI/ML development, data science,
and backend services.

## Used In
- Styleflow (1st Place IA Devs Langflow)
- Langflow open-source contributions
- CRM/ERP system at Arpa Solutions
```

Keep skill descriptions concise (3-5 lines). Include a proficiency indicator (visual bar or badge: Advanced/Intermediate/Learning).

#### tools/*.md

Similar to skills but focused on the tool itself:

```markdown
# FastAPI

## Category: Backend Framework

## Description
High-performance Python web framework for building APIs.
Used for serving AI models and building backend services.
```

#### projects/*.md

Project files render with richer content:

```markdown
# Styleflow

## Status: Completed | Award: 1st Place

## Description
AI solution for fashion e-commerce, achieving 1st place and a
R$ 50,000 prize in the Langflow IA Devs competition.

As the team's CRO, contributed to this tool that uses colorimetry
and AI to analyze user characteristics and recommend personalized
outfits.

## Stack
Python, LangFlow, Generative AI

## Links
- [Read Article on IT Forum](https://itforum.com.br/...)
```

#### memory/*.md

Education and experience entries:

```markdown
# Education

## Degrees
- (To be filled by Raphael during implementation)

## Certifications
- (To be filled by Raphael during implementation)
```

#### config/contact.json

Rendered with JSON syntax highlighting (colored keys, string values, etc.):

```json
{
  "name": "Raphael Valdetaro",
  "role": "Research Engineer & LLM Developer",
  "email": "raphaelvaldetaro@gmail.com",
  "linkedin": "https://www.linkedin.com/in/raphael-valdetaro/",
  "github": "https://github.com/raphaelchristi",
  "location": "Brazil",
  "status": "open_to_opportunities"
}
```

All URL values are clickable links. Email opens mailto.

### Mobile Layout

- Sidebar becomes a collapsible drawer/accordion at the top of the screen
- When a file is selected, the drawer collapses and content fills the screen
- A "back to explorer" button or breadcrumb allows returning to the tree
- Content panel takes full width

## Visual Design

### Color Palette (Dark Mode Only)

| Element | Color | Value |
|---------|-------|-------|
| Background | Near-black | `#0a0a0a` |
| Sidebar bg | Slightly lighter | `#1a1a1a` |
| Text primary | Soft white | `#e0e0e0` |
| Text muted | Gray | `#888888` |
| Accent (status, highlights) | Terminal green | `#4ade80` |
| Links / Primary | Light blue | `#60a5fa` |
| Borders | Subtle gray | `#2a2a2a` |
| Selected file bg | Dark highlight | `#2a2a2a` |
| Tab bar bg | Match sidebar | `#1a1a1a` |
| JSON keys | Blue | `#60a5fa` |
| JSON strings | Orange | `#f97316` |
| JSON punctuation | Gray | `#888888` |
| Markdown headings | White bold | `#ffffff` |
| Proficiency badge | Green shades | `#4ade80` / `#facc15` |

### Typography

| Context | Font | Size |
|---------|------|------|
| ASCII art | Monospace (system) | responsive (text-xs to text-base) |
| File tree | JetBrains Mono or Fira Code | 13px |
| Tab bar | Monospace | 13px |
| Content headings | Geist (existing sans) | 1.5rem - 2rem |
| Content body | Geist | 1rem |
| Code/JSON blocks | Monospace | 14px |
| Status line | Monospace | 14-16px |

Load JetBrains Mono from Google Fonts (or fallback to Fira Code / system monospace).

### Animations

| Element | Animation | Duration |
|---------|-----------|----------|
| ASCII art | Fade-in from opacity 0 | 800ms |
| Status line | Typing effect (character by character) | ~2s |
| Folder expand/collapse | Height transition + chevron rotation | 200ms |
| File content switch | Fade transition | 150ms |
| Selected file highlight | Background color transition | 100ms |
| Page load | AGENT.md auto-selected after hero animation completes | — |

### Spacing

- Hero section: `py-20 md:py-28`
- Explorer section: fills remaining viewport (`calc(100vh - hero)`)
- Sidebar internal padding: `p-4`
- Content panel padding: `p-6 md:p-8`
- File tree item padding: `py-1 px-2`
- Tree indentation: `pl-4` per level

## Data Architecture

All content is defined as TypeScript data objects in a single file (`src/data/agent-files.ts`), not actual markdown files. This keeps the site fully static with no file-reading at runtime.

```typescript
type AgentFile = {
  name: string;
  type: "file" | "folder";
  icon?: string;
  content?: string;        // markdown or JSON string
  contentType?: "markdown" | "json";
  children?: AgentFile[];
};

const agentFileTree: AgentFile[] = [
  {
    name: "AGENT.md",
    type: "file",
    contentType: "markdown",
    content: `# System Prompt\n\nYou are Raphael Valdetaro...`
  },
  {
    name: "skills",
    type: "folder",
    children: [
      { name: "python.md", type: "file", contentType: "markdown", content: "..." },
      // ...
    ]
  },
  // ...
];
```

## Components Breakdown

| Component | Responsibility |
|-----------|---------------|
| `HeroSection` | ASCII art + status line with animations |
| `FileExplorer` | Main split-pane container, manages selected file state |
| `FileTree` | Recursive tree renderer with collapse/expand |
| `FileTreeItem` | Individual file/folder row with icon and click handler |
| `ContentPanel` | Tab bar + content renderer |
| `MarkdownRenderer` | Styles markdown content (headings, lists, links, badges) |
| `JsonRenderer` | Syntax-highlighted JSON with clickable links |
| `MobileDrawer` | Mobile-only file tree drawer |

## Pages & Routing

Single page only (`src/app/page.tsx`). No routing needed. All state is client-side (selected file).

## Dependencies

- Keep existing: Next.js, Tailwind, Geist font, motion (framer-motion)
- Add: JetBrains Mono font (Google Fonts)
- Remove: ShadCN components (avatar, card, button, input, textarea, label) — no longer needed
- Remove: lucide-react Moon icon — no theme toggle (dark only)
- Remove: @tsparticles — not used in new design

## Static Export

The site deploys to GitHub Pages via `next export`. Ensure:
- `output: 'export'` in next.config.js
- No server-side features used
- All content is client-side rendered

## What This Spec Does NOT Cover

- Analytics / tracking
- Blog / writing section
- Multi-language support
- Light mode
- SEO beyond basic meta tags
- Contact form backend
