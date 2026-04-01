"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import type { AgentFile } from "@/data/agent-files";
import type { ChatMessage } from "@/hooks/useAgentChat";
import ChatInput from "./ChatInput";

type Props = {
  selectedFile: AgentFile | null;
  selectedPath: string;
  messages: ChatMessage[];
  isLoading: boolean;
  hasCheckedHealth: boolean;
  chatEnabled: boolean;
  onSendMessage: (message: string) => void;
  onFileRead: (path: string, content: string) => void;
};

function TerminalTitleBar() {
  return (
    <div
      className="flex items-center h-10 px-4 shrink-0"
      style={{
        backgroundColor: "#2a2a2a",
        borderBottom: "1px solid #333",
      }}
    >
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#febc2e" }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#28c840" }} />
      </div>
      <span
        className="flex-1 text-center text-[12px] font-mono"
        style={{ color: "#888" }}
      >
        raphael.agent — bash
      </span>
      <div className="w-[52px]" />
    </div>
  );
}

function MessageBlock({ msg }: { msg: ChatMessage }) {
  if (msg.role === "file") {
    return (
      <div className="mb-4">
        <pre
          className="font-mono text-[13px] md:text-[14px] leading-relaxed whitespace-pre-wrap break-words"
          style={{
            color: "#d4d4d4",
            textShadow: "0 0 8px rgba(74, 222, 128, 0.15)",
          }}
        >
          {msg.content}
        </pre>
      </div>
    );
  }

  if (msg.role === "user") {
    return (
      <div className="mb-2">
        <span
          className="font-mono text-[13px] md:text-[14px]"
          style={{
            color: "#4ade80",
            textShadow: "0 0 10px rgba(74, 222, 128, 0.3)",
          }}
        >
          ${" "}
        </span>
        <span
          className="font-mono text-[13px] md:text-[14px]"
          style={{ color: "#d4d4d4" }}
        >
          {msg.content}
        </span>
      </div>
    );
  }

  // assistant
  return (
    <div className="mb-4">
      <span
        className="font-mono text-[13px] md:text-[14px]"
        style={{
          color: "#4ade80",
          textShadow: "0 0 10px rgba(74, 222, 128, 0.3)",
        }}
      >
        ▶{" "}
      </span>
      <span
        className="font-mono text-[13px] md:text-[14px] whitespace-pre-wrap break-words"
        style={{ color: "#d4d4d4" }}
      >
        {msg.content}
        {msg.content === "" && (
          <span className="animate-pulse" style={{ color: "#4ade80" }}>▊</span>
        )}
      </span>
    </div>
  );
}

export default function ContentPanel({
  selectedFile,
  selectedPath,
  messages,
  isLoading,
  hasCheckedHealth,
  chatEnabled,
  onSendMessage,
  onFileRead,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastFileRef = useRef<string>("");

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // When a file is selected, add it to conversation
  useEffect(() => {
    if (selectedFile && selectedPath && selectedPath !== lastFileRef.current) {
      lastFileRef.current = selectedPath;
      const content = selectedFile.contentType === "json"
        ? selectedFile.content ?? "{}"
        : selectedFile.content ?? "";
      onFileRead(selectedPath, content);
    }
  }, [selectedFile, selectedPath, onFileRead]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TerminalTitleBar />

      {/* Scrollable terminal content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto p-5 md:p-6"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        {/* Status message */}
        {hasCheckedHealth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 font-mono text-[13px] md:text-[14px]"
            style={{
              color: "#4ade80",
              textShadow: "0 0 10px rgba(74, 222, 128, 0.3)",
            }}
          >
            {chatEnabled
              ? "▶ agent online. ask me anything about raphael."
              : "▶ agent is sleeping... browse the files to learn about raphael."}
          </motion.div>
        )}

        {/* Conversation history */}
        {messages.map((msg) => (
          <MessageBlock key={msg.id} msg={msg} />
        ))}

        {/* Blinking cursor at the end */}
        {!isLoading && (
          <div className="font-mono text-[13px] md:text-[14px]">
            <span style={{ color: "#4ade80", textShadow: "0 0 10px rgba(74, 222, 128, 0.3)" }}>
              $
            </span>
            <span className="animate-pulse ml-1" style={{ color: "#4ade80" }}>▊</span>
          </div>
        )}
      </div>

      {/* Chat input - only when online */}
      {chatEnabled && (
        <ChatInput onSend={onSendMessage} disabled={isLoading} />
      )}
    </div>
  );
}
