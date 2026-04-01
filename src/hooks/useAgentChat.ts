"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { buildSystemPrompt, agentFileTree, flattenFiles } from "@/data/agent-files";
import type { AgentFile } from "@/data/agent-files";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "file" | "routing" | "system";
  content: string;
};

function resolveDir(tree: AgentFile[], cwd: string): AgentFile[] | null {
  if (cwd === "/" || cwd === "") return tree;
  const parts = cwd.split("/").filter(Boolean);
  let current = tree;
  for (const part of parts) {
    const found = current.find((f) => f.name === part && f.type === "folder");
    if (!found?.children) return null;
    current = found.children;
  }
  return current;
}

function resolveFile(tree: AgentFile[], path: string): { file: AgentFile; fullPath: string } | null {
  const allFiles = flattenFiles(tree);
  const match = allFiles.find((f) => f.path === path || f.path.endsWith(`/${path}`) || f.file.name === path);
  return match ? { file: match.file, fullPath: match.path } : null;
}

function handleLocalCommand(
  input: string,
  cwd: string,
  setCwd: (cwd: string) => void,
): { handled: boolean; output?: string; fileRead?: { path: string; content: string } } {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0]?.toLowerCase();
  const arg = parts.slice(1).join(" ");

  if (cmd === "help") {
    return {
      handled: true,
      output: `Available commands:
  ls          List files in current directory
  cd <dir>    Change directory (cd .., cd skills/core)
  pwd         Print working directory
  cat <file>  Read a file
  tree        Show full file tree
  clear       Clear terminal
  whoami      Who am I?
  help        Show this help

Anything else is sent to the AI agent.`,
    };
  }

  if (cmd === "clear") {
    return { handled: true, output: "__CLEAR__" };
  }

  if (cmd === "whoami") {
    return { handled: true, output: "raphael" };
  }

  if (cmd === "pwd") {
    return { handled: true, output: `/${cwd || "raphael.agent"}` };
  }

  if (cmd === "ls") {
    const dir = resolveDir(agentFileTree, cwd);
    if (!dir) return { handled: true, output: `ls: cannot access '${cwd}': No such directory` };
    const listing = dir
      .map((f) => (f.type === "folder" ? `\x1b[34m${f.name}/\x1b[0m` : f.name))
      .join("  ");
    return { handled: true, output: listing.replace(/\x1b\[\d+m/g, "") + "\n" + dir.map((f) => f.type === "folder" ? `📂 ${f.name}/` : `📄 ${f.name}`).join("\n") };
  }

  if (cmd === "cd") {
    if (!arg || arg === "/" || arg === "~") {
      setCwd("");
      return { handled: true, output: "" };
    }
    if (arg === "..") {
      const parts = cwd.split("/").filter(Boolean);
      parts.pop();
      setCwd(parts.join("/"));
      return { handled: true, output: "" };
    }
    const newPath = cwd ? `${cwd}/${arg}` : arg;
    const dir = resolveDir(agentFileTree, newPath);
    if (!dir) return { handled: true, output: `cd: no such directory: ${arg}` };
    setCwd(newPath);
    return { handled: true, output: "" };
  }

  if (cmd === "cat") {
    if (!arg) return { handled: true, output: "cat: missing file argument" };
    const searchPath = cwd ? `${cwd}/${arg}` : arg;
    const result = resolveFile(agentFileTree, searchPath) ?? resolveFile(agentFileTree, arg);
    if (!result) return { handled: true, output: `cat: ${arg}: No such file` };
    return { handled: true, fileRead: { path: result.fullPath, content: result.file.content ?? "" } };
  }

  if (cmd === "tree") {
    const allFiles = flattenFiles(agentFileTree);
    const treeStr = allFiles.map((f) => {
      const depth = f.path.split("/").length - 1;
      const indent = "  ".repeat(depth);
      return `${indent}${f.file.type === "folder" ? "📂" : "📄"} ${f.file.name}`;
    }).join("\n");
    return { handled: true, output: `raphael.agent/\n${treeStr}` };
  }

  return { handled: false };
}

function classifyIntent(msg: string): { agent: string } {
  const lower = msg.toLowerCase();

  // Recruiter patterns
  if (
    /(hiring|hire|salary|contrat|disponib|remote|vagas?|seniorid|curricul|recrut|entrevista|contratar|linkedin|email|contact|cv\b|oportunid)/.test(lower)
  ) {
    return { agent: "Recruiter Agent" };
  }

  // Technical patterns
  if (
    /(arquitetura|architecture|code|código|como funciona|how does|implementa|technical|ceppem|langgraph|docker|redis|sandbox|pipeline|multi.?agent|como construiu|how did you build|design pattern)/.test(lower)
  ) {
    return { agent: "Technical Agent" };
  }

  // Default: Portfolio
  return { agent: "Portfolio Agent" };
}

const API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL ?? "";

export function useAgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedHealth, setHasCheckedHealth] = useState(false);
  const [cwd, setCwd] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const systemPrompt = useRef(buildSystemPrompt());

  // Health check
  useEffect(() => {
    if (!API_URL) {
      setHasCheckedHealth(true);
      return;
    }

    const checkHealth = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(`${API_URL}/health`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);
        setIsOnline(res.ok);
      } catch {
        setIsOnline(false);
      }
      setHasCheckedHealth(true);
    };

    void checkHealth();
    const interval = setInterval(() => void checkHealth(), 30000);
    return () => clearInterval(interval);
  }, []);

  // Add a file read — clears previous messages (clean terminal)
  const addFileRead = useCallback((path: string, content: string) => {
    setMessages([
      { id: `file-${Date.now()}`, role: "file", content: `▶ reading ${path}...\n─────────────────────────────\n${content}` },
    ]);
  }, []);

  // Send a chat message (or handle local command)
  const sendMessage = useCallback(
    async (userMessage: string) => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userMessage,
      };

      // Try local commands first
      const localResult = handleLocalCommand(userMessage, cwd, setCwd);
      if (localResult.handled) {
        if (localResult.output === "__CLEAR__") {
          setMessages([]);
          return;
        }
        if (localResult.fileRead) {
          setMessages((prev) => [
            ...prev,
            userMsg,
            { id: `file-${Date.now()}`, role: "file", content: `▶ reading ${localResult.fileRead!.path}...\n─────────────────────────────\n${localResult.fileRead!.content}` },
          ]);
          return;
        }
        setMessages((prev) => [
          ...prev,
          userMsg,
          { id: `system-${Date.now()}`, role: "system", content: localResult.output ?? "" },
        ]);
        return;
      }

      // Not a local command — send to agent
      if (!API_URL || !isOnline || isLoading) {
        setMessages((prev) => [
          ...prev,
          userMsg,
          { id: `system-${Date.now()}`, role: "system", content: "agent offline. try local commands: help, ls, cat <file>" },
        ]);
        return;
      }

      // Route to the appropriate agent
      const intent = classifyIntent(userMessage);

      const routingMsg: ChatMessage = {
        id: `routing-${Date.now()}`,
        role: "routing",
        content: intent.agent,
      };

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, routingMsg, assistantMsg]);
      setIsLoading(true);

      // Build messages for API (only user/assistant, not file reads)
      // No system prompt here — Hermes Agent has its own multi-agent routing prompt
      const apiMessages = [
        ...messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user" as const, content: userMessage },
      ];

      try {
        abortRef.current = new AbortController();
        const res = await fetch(`${API_URL}/v1/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "hermes-agent",
            messages: apiMessages,
            stream: true,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last?.role === "assistant") {
                    updated[updated.length - 1] = {
                      ...last,
                      content: last.content + content,
                    };
                  }
                  return updated;
                });
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === "assistant" && last.content === "") {
            updated[updated.length - 1] = {
              ...last,
              content: "connection lost. try again.",
            };
          }
          return updated;
        });
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [isOnline, isLoading, messages, cwd],
  );

  return {
    messages,
    isOnline,
    isLoading,
    hasCheckedHealth,
    sendMessage,
    addFileRead,
    chatEnabled: !!API_URL && isOnline,
  };
}
