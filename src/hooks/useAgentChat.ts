"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { buildSystemPrompt } from "@/data/agent-files";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "file" | "routing";
  content: string;
};

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

  // Send a chat message
  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!API_URL || !isOnline || isLoading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userMessage,
      };

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
    [isOnline, isLoading, messages],
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
