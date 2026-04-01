"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import type { AgentFile } from "@/data/agent-files";
import type { ChatMessage } from "@/hooks/useAgentChat";
import TerminalRenderer from "./TerminalRenderer";

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
      className="flex items-center h-10 px-4 shrink-0 rounded-t-lg"
      style={{
        backgroundColor: "#111827",
        borderBottom: "1px solid #1a2340",
      }}
    >
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#febc2e" }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#28c840" }} />
      </div>
      <span
        className="flex-1 text-center text-[13px] font-mono"
        style={{ color: "#7a8299" }}
      >
        raphael.agent — bash
      </span>
      <div className="w-[52px]" />
    </div>
  );
}

function MessageBlock({ msg }: { msg: ChatMessage }) {
  if (msg.role === "file") {
    // Extract header line (▶ reading ...) and content
    const lines = msg.content.split("\n");
    const headerLine = lines[0] ?? "";
    const separator = lines[1] ?? "";
    const fileContent = lines.slice(2).join("\n");
    const isJson = headerLine.includes(".json");

    return (
      <div className="mb-3">
        <div className="font-mono text-[13px] mb-1" style={{ color: "#7a8299" }}>
          {headerLine}
        </div>
        <div className="font-mono text-[13px] mb-2" style={{ color: "#1a2340" }}>
          {separator}
        </div>
        <TerminalRenderer
          content={fileContent}
          contentType={isJson ? "json" : "markdown"}
        />
      </div>
    );
  }

  if (msg.role === "user") {
    return (
      <div className="mb-1">
        <span className="font-mono text-[13px]"><span style={{ color: "#5070ff" }}>raphael@agent</span><span style={{ color: "#c0c8e0" }}>:</span><span style={{ color: "#818cf8" }}>~</span><span style={{ color: "#c0c8e0" }}>$ </span></span>
        <span className="font-mono text-[13px]" style={{ color: "#e0e4ef" }}>{msg.content}</span>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <span className="font-mono text-[13px] whitespace-pre-wrap break-words" style={{ color: "#c0c8e0" }}>
        {msg.content}
        {msg.content === "" && <span className="animate-pulse" style={{ color: "#e0e4ef" }}>▊</span>}
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
  const inputRef = useRef<HTMLSpanElement>(null);
  const lastFileRef = useRef<string>("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, inputValue]);

  // Focus input on click anywhere in terminal
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // When a file is selected, add it to conversation
  useEffect(() => {
    if (selectedFile && selectedPath && selectedPath !== lastFileRef.current) {
      lastFileRef.current = selectedPath;
      const content = selectedFile.content ?? "";
      onFileRead(selectedPath, content);
    }
  }, [selectedFile, selectedPath, onFileRead]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !isLoading) {
        onSendMessage(trimmed);
        setInputValue("");
        if (inputRef.current) inputRef.current.textContent = "";
      }
    }
  };

  const handleInput = () => {
    setInputValue(inputRef.current?.textContent ?? "");
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TerminalTitleBar />

      <div
        ref={scrollRef}
        className="flex-1 overflow-auto p-4 md:p-5 cursor-text"
        style={{ backgroundColor: "#0a0e1a" }}
        onClick={focusInput}
      >
        {/* Status line */}
        {hasCheckedHealth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-3 font-mono text-[13px]"
            style={{ color: "#7a8299" }}
          >
            {chatEnabled
              ? "Welcome to raphael.agent. Type a question or browse files."
              : "Agent offline. Browse files to learn about Raphael."}
          </motion.div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <MessageBlock key={msg.id} msg={msg} />
        ))}

        {/* Inline prompt */}
        {!isLoading && (
          <div className="flex items-start font-mono text-[13px]">
            <span className="font-mono text-[13px] shrink-0"><span style={{ color: "#5070ff" }}>raphael@agent</span><span style={{ color: "#c0c8e0" }}>:</span><span style={{ color: "#818cf8" }}>~</span><span style={{ color: "#c0c8e0" }}>$ </span></span>
            {chatEnabled ? (
              <span
                ref={inputRef}
                contentEditable
                suppressContentEditableWarning
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                className="outline-none flex-1 min-w-[1px]"
                style={{
                  color: "#e0e4ef",
                  caretColor: "#f0f0f0",
                }}
                spellCheck={false}
              />
            ) : (
              <span className="animate-pulse" style={{ color: "#e0e4ef" }}>▊</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
