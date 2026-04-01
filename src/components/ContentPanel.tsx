"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import type { AgentFile } from "@/data/agent-files";
import type { ChatMessage } from "@/hooks/useAgentChat";
import TerminalRenderer from "./TerminalRenderer";

const PLACEHOLDER_HINTS = [
  "What projects have you built?",
  "Tell me about your skills",
  "How can I contact you?",
  "What's your experience with AI?",
  "How does ceppem-ai work?",
];

function AnimatedPlaceholder({ visible }: { visible: boolean }) {
  const [hintIndex, setHintIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const hint = PLACEHOLDER_HINTS[hintIndex] ?? "";

    if (!deleting && charIndex < hint.length) {
      const timeout = setTimeout(() => setCharIndex((c) => c + 1), 40);
      return () => clearTimeout(timeout);
    }
    if (!deleting && charIndex === hint.length) {
      const timeout = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }
    if (deleting && charIndex > 0) {
      const timeout = setTimeout(() => setCharIndex((c) => c - 1), 20);
      return () => clearTimeout(timeout);
    }
    if (deleting && charIndex === 0) {
      setDeleting(false);
      setHintIndex((i) => (i + 1) % PLACEHOLDER_HINTS.length);
    }
  }, [visible, charIndex, deleting, hintIndex]);

  if (!visible) return null;

  const hint = PLACEHOLDER_HINTS[hintIndex] ?? "";
  return (
    <span
      className="absolute pointer-events-none font-mono text-[13px] select-none"
      style={{ color: "#3a4560", left: 0, top: 0 }}
    >
      {hint.slice(0, charIndex)}
    </span>
  );
}

function RoutingStatus({ agentName, done }: { agentName: string; done: boolean }) {
  const [phase, setPhase] = useState(0);
  const phases = [
    "routing query...",
    `→ ${agentName}`,
    "loading skills...",
  ];

  useEffect(() => {
    if (phase < phases.length - 1) {
      const timeout = setTimeout(() => setPhase((p) => p + 1), 400);
      return () => clearTimeout(timeout);
    }
  }, [phase, phases.length]);

  // Hide completely once response is done
  if (done) return null;

  return (
    <div className="mb-2 font-mono text-[12px] flex items-center gap-2" style={{ color: "#4a5568" }}>
      <span className="animate-pulse" style={{ color: "#5070ff" }}>●</span>
      <span>
        {phase === 1 ? (
          <>
            <span style={{ color: "#4a5568" }}>→ </span>
            <span style={{ color: "#5070ff", fontWeight: "bold" }}>{agentName}</span>
          </>
        ) : (
          phases[phase]
        )}
      </span>
    </div>
  );
}

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

function MessageBlock({ msg, nextMsg }: { msg: ChatMessage; nextMsg?: ChatMessage }) {
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

  if (msg.role === "system") {
    return (
      <div className="mb-3">
        <pre className="font-mono text-[13px] whitespace-pre-wrap" style={{ color: "#c0c8e0" }}>
          {msg.content}
        </pre>
      </div>
    );
  }

  if (msg.role === "routing") {
    const responseDone = nextMsg?.role === "assistant" && nextMsg.content.length > 0;
    return <RoutingStatus agentName={msg.content} done={responseDone} />;
  }

  if (msg.role === "user") {
    return (
      <div className="mb-1">
        <span className="font-mono text-[13px]"><span style={{ color: "#5070ff" }}>raphael@agent</span><span style={{ color: "#c0c8e0" }}>:</span><span style={{ color: "#818cf8" }}>~</span><span style={{ color: "#c0c8e0" }}>$ </span></span>
        <span className="font-mono text-[13px]" style={{ color: "#e0e4ef" }}>{msg.content}</span>
      </div>
    );
  }

  // Assistant response — filter Hermes skill headers, render as markdown
  const cleanContent = msg.content
    .split("\n")
    .filter((line) => !(/^`?📚/.test(line.trim()) || /^`?📦/.test(line.trim()) || /^`?🔧/.test(line.trim())))
    .join("\n")
    .trim();

  return (
    <div className="mb-3">
      {msg.content === "" ? (
        <span className="animate-pulse font-mono text-[13px]" style={{ color: "#e0e4ef" }}>▊</span>
      ) : cleanContent ? (
        <TerminalRenderer content={cleanContent} contentType="markdown" />
      ) : null}
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
        {/* Welcome block */}
        {hasCheckedHealth && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            <div className="font-mono text-[13px] mb-2" style={{ color: "#c0c8e0" }}>
              {chatEnabled
                ? "Welcome to raphael.agent — an AI that knows my work."
                : "Agent offline — browse files in the sidebar to learn about me."}
            </div>
            {chatEnabled && (
              <>
                <div className="font-mono text-[12px] mb-3" style={{ color: "#7a8299" }}>
                  Ask me anything below, or type <span style={{ color: "#5070ff" }}>help</span> for commands.
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["about me", "my projects", "my skills", "contact"].map((label) => (
                    <button
                      key={label}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendMessage(label);
                      }}
                      className="font-mono text-[12px] px-3 py-1 rounded border transition-all hover:opacity-80"
                      style={{
                        color: "#5070ff",
                        borderColor: "#1a2340",
                        backgroundColor: "#0f1525",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Messages */}
        {messages.map((msg, idx) => (
          <MessageBlock key={msg.id} msg={msg} nextMsg={messages[idx + 1]} />
        ))}

        {/* Inline prompt */}
        {!isLoading && (
          <div className="flex items-start font-mono text-[13px]">
            <span className="font-mono text-[13px] shrink-0"><span style={{ color: "#5070ff" }}>raphael@agent</span><span style={{ color: "#c0c8e0" }}>:</span><span style={{ color: "#818cf8" }}>~</span><span style={{ color: "#c0c8e0" }}>$ </span></span>
            <span className="relative flex-1 min-w-[1px]">
              <AnimatedPlaceholder visible={inputValue.length === 0 && messages.length === 0} />
              <span
                ref={inputRef}
                contentEditable
                suppressContentEditableWarning
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                className="outline-none inline-block min-w-[1px]"
                style={{
                  color: "#e0e4ef",
                  caretColor: "transparent",
                }}
                spellCheck={false}
              />
            </span>
            <span
              className="animate-pulse inline-block"
              style={{
                width: "8px",
                height: "16px",
                backgroundColor: "#e0e4ef",
                marginLeft: "1px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
