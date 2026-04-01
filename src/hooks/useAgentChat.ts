"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";
import { agentFileTree, flattenFiles } from "@/data/agent-files";
import type { AgentFile } from "@/data/agent-files";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "file" | "routing" | "system";
  content: string;
};

// === Local commands (ls, cd, cat, etc.) ===

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

// === Intent classification ===

function classifyIntent(msg: string): { agent: string } {
  const lower = msg.toLowerCase();
  if (/(hiring|hire|salary|contrat|disponib|remote|vagas?|seniorid|curricul|recrut|entrevista|contratar|linkedin|email|contact|cv\b|oportunid)/.test(lower)) return { agent: "Recruiter Agent" };
  if (/(arquitetura|architecture|code|código|como funciona|how does|implementa|technical|ceppem|langgraph|docker|redis|sandbox|pipeline|multi.?agent|como construiu|how did you build|design pattern|stack|sistema|api\b)/.test(lower)) return { agent: "Technical Agent" };
  return { agent: "Portfolio Agent" };
}

// === Main hook ===

export function useAgentChat() {
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [cwd, setCwd] = useState("");
  const lastAgentMsgCount = useRef(0);

  // CopilotKit v2 hooks
  const { agent } = useAgent();
  const { copilotkit } = useCopilotKit();

  const isLoading = agent.isRunning;

  // Sync CopilotKit agent messages → local messages
  useEffect(() => {
    const agentMessages = agent.messages;
    if (agentMessages.length <= lastAgentMsgCount.current) return;

    // Process new messages from CopilotKit
    const newMessages = agentMessages.slice(lastAgentMsgCount.current);
    lastAgentMsgCount.current = agentMessages.length;

    for (const msg of newMessages) {
      if (msg.role === "assistant" && msg.content) {
        const content = typeof msg.content === "string" ? msg.content : "";
        // Clean Hermes skill headers
        const cleanContent = content
          .split("\n")
          .filter((line: string) => !(/^`?📚/.test(line.trim()) || /^`?📦/.test(line.trim())))
          .join("\n")
          .trim();

        if (cleanContent) {
          setLocalMessages((prev) => {
            // Update existing or add new
            const existing = prev.findIndex((m) => m.id === `copilot-${msg.id}`);
            if (existing >= 0) {
              const updated = [...prev];
              updated[existing] = { ...updated[existing]!, content: cleanContent };
              return updated;
            }
            return [...prev, { id: `copilot-${msg.id}`, role: "assistant", content: cleanContent }];
          });
        }
      }
    }
  }, [agent.messages]);

  // Add a file read
  const addFileRead = useCallback((path: string, content: string) => {
    setLocalMessages([
      { id: `file-${Date.now()}`, role: "file", content: `▶ reading ${path}...\n─────────────────────────────\n${content}` },
    ]);
  }, []);

  // Send message
  const sendMessage = useCallback(
    async (userMessage: string) => {
      const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: userMessage };

      // Local commands
      const localResult = handleLocalCommand(userMessage, cwd, setCwd);
      if (localResult.handled) {
        if (localResult.output === "__CLEAR__") { setLocalMessages([]); lastAgentMsgCount.current = 0; return; }
        if (localResult.fileRead) {
          setLocalMessages((prev) => [...prev, userMsg, { id: `file-${Date.now()}`, role: "file", content: `▶ reading ${localResult.fileRead!.path}...\n─────────────────────────────\n${localResult.fileRead!.content}` }]);
          return;
        }
        setLocalMessages((prev) => [...prev, userMsg, { id: `system-${Date.now()}`, role: "system", content: localResult.output ?? "" }]);
        return;
      }

      // Agent chat via CopilotKit
      const intent = classifyIntent(userMessage);
      const routingMsg: ChatMessage = { id: `routing-${Date.now()}`, role: "routing", content: intent.agent };

      setLocalMessages((prev) => [...prev, userMsg, routingMsg]);

      try {
        // Add user message to CopilotKit agent
        agent.addMessage({
          id: crypto.randomUUID(),
          role: "user",
          content: userMessage,
        });

        // Run the agent
        await copilotkit.runAgent({ agent });
      } catch {
        setLocalMessages((prev) => [
          ...prev,
          { id: `system-${Date.now()}`, role: "system", content: "connection error. try again." },
        ]);
      }
    },
    [cwd, agent, copilotkit],
  );

  return {
    messages: localMessages,
    isOnline: true,
    isLoading,
    hasCheckedHealth: true,
    sendMessage,
    addFileRead,
    chatEnabled: true,
  };
}
