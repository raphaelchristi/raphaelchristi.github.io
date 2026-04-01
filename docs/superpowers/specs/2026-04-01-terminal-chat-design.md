# Terminal Chat Interface — Design Spec

## Overview

Transform the existing macOS terminal content panel into an interactive chat interface that connects to a Hermes Agent backend running Gemini Flash Lite. The terminal supports dual-mode: file browsing (clicking sidebar) and conversational chat (typing messages). When the backend is offline, the site gracefully degrades to file-browsing only.

## Architecture

```
GitHub Pages (static frontend)
  └── fetch POST /v1/chat/completions
        └── Cloudflare Tunnel (HTTPS)
              └── Docker (local machine)
                    └── Hermes Agent (Gemini Flash Lite)
```

Frontend is fully static. All chat logic is client-side JavaScript making HTTP requests to a configurable API endpoint.

## Terminal Behavior

### Dual-Mode Operation

The terminal supports two modes in a single continuous conversation stream:

1. **File browsing** — User clicks a file in the sidebar. Terminal appends:
   ```
   ▶ reading skills/python.md...
   ─────────────────────────────
   [file content in green monospace]
   ```

2. **Chat** — User types a message in the input field. Terminal appends:
   ```
   $ what technologies do you use?
   ▶ [agent response streaming character by character]
   ```

Both modes share the same scrollable terminal history. A user can read a file, then ask a question about it — the conversation is contextual.

### Chat Input

- Fixed at the bottom of the terminal, below the scrollable content area
- Styled as a terminal prompt: green `$ ` prefix, monospace font, blinking cursor
- Enter to send, Shift+Enter for newline
- Input disabled while agent is responding (show spinner/dots)
- Input hidden when agent is offline (fallback mode)

### Agent Responses

- Stream character-by-character via SSE (Server-Sent Events) from the chat completions API
- Prefixed with `▶ ` in green
- Links in responses are clickable (underlined green)
- After response completes, show blinking cursor on new line

### Initial State

On page load:
1. Frontend calls `GET <API_URL>/health`
2. **If online:** Show `▶ agent online. ask me anything about raphael.` + enable chat input
3. **If offline:** Show `▶ agent is sleeping... browse the files to learn about raphael.` + hide chat input
4. AGENT.md is auto-selected in sidebar (file content shown in terminal)

### Conversation State

- Messages stored in React state as an array of `{ role: 'user' | 'assistant' | 'system' | 'file', content: string }`
- File reads are stored as `role: 'file'` entries (displayed but NOT sent to the LLM)
- Only `user` and `assistant` messages are sent to the chat completions API
- A system message with Raphael's portfolio context is prepended to every API call
- Conversation resets on page reload (no persistence)

## API Integration

### Endpoint

Configurable via environment variable:
```
NEXT_PUBLIC_AGENT_API_URL=https://agent.raphaelvaldetaro.com
```

Defaults to empty string (chat disabled, file-browsing only).

### Chat Request

```typescript
POST ${API_URL}/v1/chat/completions
Content-Type: application/json

{
  "model": "hermes-agent",
  "messages": [
    { "role": "system", "content": "<portfolio context>" },
    { "role": "user", "content": "what projects have you worked on?" },
    { "role": "assistant", "content": "..." },
    ...
  ],
  "stream": true
}
```

### System Prompt

The system message sent with every request contains a condensed version of all portfolio data (AGENT.md content, skills list, projects list, experience, education, contact). This is assembled at build time from the `agent-files.ts` data and embedded in the component.

### Streaming Response

The API returns SSE (text/event-stream) in OpenAI format:
```
data: {"choices":[{"delta":{"content":"Hello"}}]}
data: {"choices":[{"delta":{"content":" there"}}]}
data: [DONE]
```

Frontend parses each chunk and appends to the current assistant message character by character.

### Health Check

```typescript
GET ${API_URL}/health
```

- Timeout: 3 seconds
- If response 200: agent is online
- If error/timeout: agent is offline
- Re-check every 30 seconds while page is open (silent, no UI flicker)

### Error Handling

- Network error during chat → append `▶ connection lost. try again.` to terminal
- Timeout (30s no response) → append `▶ agent timed out. try again.`
- Agent goes offline mid-conversation → disable input, show offline message

## Component Changes

### Modified Components

| Component | Change |
|-----------|--------|
| `ContentPanel.tsx` | Add chat input, conversation state, API calls, health check |
| `FileExplorer.tsx` | Pass `onChatMessage` callback if needed |

### New Components

| Component | Purpose |
|-----------|---------|
| `ChatInput.tsx` | Terminal-styled input field at bottom of terminal |
| `useAgentChat.ts` | Custom hook: manages messages, streaming, health check |

### Removed Components

| Component | Reason |
|-----------|--------|
| `MarkdownRenderer.tsx` | No longer used (terminal shows plain text) |
| `JsonRenderer.tsx` | Replaced by TerminalRenderer |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_AGENT_API_URL` | No | `""` | Hermes Agent API base URL |

When empty, chat is disabled and the terminal works in file-browsing-only mode (current behavior).

## What This Spec Does NOT Cover

- Docker/Hermes Agent setup (separate spec — Phase 2)
- Cloudflare Tunnel configuration (Phase 2)
- Conversation persistence across page reloads
- Voice input/output
- File upload
- Multi-turn tool use display (agent tool calls are hidden, only final response shown)
