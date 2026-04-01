"use client";

import { useState, useCallback } from "react";
import { agentFileTree, flattenFiles } from "@/data/agent-files";
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
    return { handled: true, output: `Available commands:\n  ls, cd, pwd, cat, tree, clear, whoami, help\n\nAnything else is sent to the AI agent.` };
  }
  if (cmd === "clear") return { handled: true, output: "__CLEAR__" };
  if (cmd === "whoami") return { handled: true, output: "raphael" };
  if (cmd === "pwd") return { handled: true, output: `/${cwd || "raphael.agent"}` };

  if (cmd === "ls") {
    const dir = resolveDir(agentFileTree, cwd);
    if (!dir) return { handled: true, output: `ls: cannot access '${cwd}': No such directory` };
    return { handled: true, output: dir.map((f) => f.type === "folder" ? `📂 ${f.name}/` : `📄 ${f.name}`).join("\n") };
  }

  if (cmd === "cd") {
    if (!arg || arg === "/" || arg === "~") { setCwd(""); return { handled: true, output: "" }; }
    if (arg === "..") { const p = cwd.split("/").filter(Boolean); p.pop(); setCwd(p.join("/")); return { handled: true, output: "" }; }
    const newPath = cwd ? `${cwd}/${arg}` : arg;
    if (!resolveDir(agentFileTree, newPath)) return { handled: true, output: `cd: no such directory: ${arg}` };
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
      return `${"  ".repeat(depth)}${f.file.type === "folder" ? "📂" : "📄"} ${f.file.name}`;
    }).join("\n");
    return { handled: true, output: `raphael.agent/\n${treeStr}` };
  }

  return { handled: false };
}

function classifyIntent(msg: string): { agent: string } {
  const lower = msg.toLowerCase();
  if (/(hiring|hire|salary|contrat|disponib|remote|vagas?|seniorid|curricul|recrut|entrevista|contratar|linkedin|email|contact|cv\b|oportunid)/.test(lower)) return { agent: "Recruiter Agent" };
  if (/(arquitetura|architecture|code|código|como funciona|how does|implementa|technical|ceppem|langgraph|docker|redis|sandbox|pipeline|multi.?agent|como construiu|how did you build|design pattern|stack|sistema|api\b)/.test(lower)) return { agent: "Technical Agent" };
  return { agent: "Portfolio Agent" };
}

export function useAgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cwd, setCwd] = useState("");

  const addFileRead = useCallback((path: string, content: string) => {
    setMessages([
      { id: `file-${Date.now()}`, role: "file", content: `▶ reading ${path}...\n─────────────────────────────\n${content}` },
    ]);
  }, []);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: userMessage };

      // Local commands
      const localResult = handleLocalCommand(userMessage, cwd, setCwd);
      if (localResult.handled) {
        if (localResult.output === "__CLEAR__") { setMessages([]); return; }
        if (localResult.fileRead) {
          setMessages((prev) => [...prev, userMsg, { id: `file-${Date.now()}`, role: "file", content: `▶ reading ${localResult.fileRead!.path}...\n─────────────────────────────\n${localResult.fileRead!.content}` }]);
          return;
        }
        setMessages((prev) => [...prev, userMsg, { id: `system-${Date.now()}`, role: "system", content: localResult.output ?? "" }]);
        return;
      }

      // Agent chat via /api/chat
      const intent = classifyIntent(userMessage);
      const routingMsg: ChatMessage = { id: `routing-${Date.now()}`, role: "routing", content: intent.agent };
      const assistantMsg: ChatMessage = { id: `assistant-${Date.now()}`, role: "assistant", content: "" };

      setMessages((prev) => [...prev, userMsg, routingMsg, assistantMsg]);
      setIsLoading(true);

      const apiMessages = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));
      apiMessages.push({ role: "user", content: userMessage });

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);
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
              const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last?.role === "assistant") {
                    updated[updated.length - 1] = { ...last, content: last.content + content };
                  }
                  return updated;
                });
              }
            } catch { /* skip */ }
          }
        }
      } catch {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === "assistant" && last.content === "") {
            updated[updated.length - 1] = { ...last, content: "connection error. try again." };
          }
          return updated;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [cwd, messages],
  );

  return { messages, isOnline: true, isLoading, hasCheckedHealth: true, sendMessage, addFileRead, chatEnabled: true };
}
