"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
      className="absolute pointer-events-none select-none"
      style={{
        color: "#999999",
        left: 0,
        top: 0,
        fontFamily: '"Courier New", monospace',
        fontSize: "12px",
      }}
    >
      {hint.slice(0, charIndex)}
    </span>
  );
}

function RoutingStatus({ agentName, done }: { agentName: string; done: boolean }) {
  const [phase, setPhase] = useState(0);
  const phases = ["routing query...", `→ ${agentName}`, "loading skills..."];

  useEffect(() => {
    if (phase < phases.length - 1) {
      const timeout = setTimeout(() => setPhase((p) => p + 1), 400);
      return () => clearTimeout(timeout);
    }
  }, [phase, phases.length]);

  if (done) return null;

  return (
    <div
      style={{
        marginBottom: "6px",
        fontFamily: '"Courier New", monospace',
        fontSize: "12px",
        color: "#666666",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span style={{ color: "#008000" }}>●</span>
      <span>
        {phase === 1 ? (
          <>
            <span style={{ color: "#444444" }}>→ </span>
            <span style={{ color: "#000080", fontWeight: "bold" }}>{agentName}</span>
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

function ContentTabBar({ selectedPath }: { selectedPath: string }) {
  return (
    <div
      style={{
        backgroundColor: "var(--window-bg)",
        borderBottom: "1px solid var(--window-border-dark)",
        display: "flex",
        alignItems: "flex-end",
        paddingLeft: "4px",
        paddingTop: "2px",
        height: "22px",
        gap: "2px",
      }}
      role="tablist"
    >
      {/* Agent chat tab */}
      <div
        role="tab"
        aria-selected="true"
        style={{
          backgroundColor: "#ffffff",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "var(--window-border-dark) var(--window-border-dark) #ffffff var(--window-border-dark)",
          padding: "1px 10px",
          fontFamily: '"Tahoma", sans-serif',
          fontSize: "11px",
          color: "#000000",
          cursor: "default",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          marginBottom: "-1px",
          userSelect: "none",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="14" height="10" rx="0" fill="#000080" />
          <rect x="2" y="2" width="12" height="8" fill="#0000cc" />
          <rect x="3" y="4" width="2" height="1" fill="#ffffff" />
          <rect x="6" y="4" width="2" height="1" fill="#ffffff" />
          <rect x="9" y="4" width="2" height="1" fill="#ffffff" />
          <rect x="1" y="11" width="14" height="4" fill="#d4d0c8" />
        </svg>
        {selectedPath
          ? selectedPath.split("/").pop()
          : "raphael.agent"}
      </div>
    </div>
  );
}

function MessageBlock({ msg, nextMsg }: { msg: ChatMessage; nextMsg?: ChatMessage }) {
  if (msg.role === "file") {
    const lines = msg.content.split("\n");
    const headerLine = lines[0] ?? "";
    const fileContent = lines.slice(2).join("\n");
    const isJson = headerLine.includes(".json");

    return (
      <div style={{ marginBottom: "8px" }}>
        <div
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: "11px",
            color: "#444444",
            marginBottom: "4px",
            borderBottom: "1px solid #d4d0c8",
            paddingBottom: "2px",
          }}
        >
          {headerLine}
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
      <div style={{ marginBottom: "8px" }}>
        <pre
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: "12px",
            whiteSpace: "pre-wrap",
            color: "#000080",
            margin: 0,
            padding: "4px 6px",
            backgroundColor: "#f0f0f8",
            borderLeft: "3px solid #000080",
          }}
        >
          {msg.content}
        </pre>
      </div>
    );
  }

  if (msg.role === "routing") {
    const responseDone =
      nextMsg?.role === "assistant" && nextMsg.content.length > 0;
    return <RoutingStatus agentName={msg.content} done={responseDone} />;
  }

  if (msg.role === "user") {
    return (
      <div style={{ marginBottom: "4px" }}>
        <span
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: "12px",
          }}
        >
          <span style={{ color: "#000080", fontWeight: "bold" }}>C:\raphael\agent{">"}</span>
          <span style={{ color: "#000000" }}> {msg.content}</span>
        </span>
      </div>
    );
  }

  // Assistant
  const cleanContent = msg.content
    .split("\n")
    .filter(
      (line) =>
        !(/^`?📚/.test(line.trim()) ||
          /^`?📦/.test(line.trim()) ||
          /^`?🔧/.test(line.trim()))
    )
    .join("\n")
    .trim();

  return (
    <div style={{ marginBottom: "8px", paddingLeft: "8px" }}>
      {msg.content === "" ? (
        <span
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: "12px",
            color: "#000000",
          }}
        >
          _
        </span>
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

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

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
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <ContentTabBar selectedPath={selectedPath} />

      {/* Content area: inset Win2000 style */}
      <div
        ref={scrollRef}
        className="win-inset"
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#ffffff",
          padding: "8px 12px",
          cursor: "text",
          margin: "4px",
        }}
        onClick={focusInput}
        role="region"
        aria-label="Agent chat terminal"
        aria-live="polite"
      >
        {/* Welcome block */}
        {hasCheckedHealth && messages.length === 0 && (
          <div style={{ marginBottom: "12px" }}>
            {/* Win2000 info box */}
            <div
              className="win-raised"
              style={{
                backgroundColor: "#fffde7",
                padding: "8px 10px",
                marginBottom: "8px",
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
              }}
              role="status"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: "1px" }}>
                <circle cx="8" cy="8" r="7" fill="#ffcc00" stroke="#cc9900" strokeWidth="1" />
                <rect x="7" y="4" width="2" height="4" fill="#000000" />
                <rect x="7" y="10" width="2" height="2" fill="#000000" />
              </svg>
              <div>
                <p
                  style={{
                    fontFamily: '"Tahoma", sans-serif',
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "#000080",
                    marginBottom: "2px",
                  }}
                >
                  {chatEnabled
                    ? "Welcome to raphael.agent"
                    : "Agent offline"}
                </p>
                <p
                  style={{
                    fontFamily: '"Tahoma", sans-serif',
                    fontSize: "11px",
                    color: "#000000",
                  }}
                >
                  {chatEnabled
                    ? "An AI that knows my work. Type below or click a quick action."
                    : "Browse files in the left panel to learn about me."}
                </p>
              </div>
            </div>

            {chatEnabled && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {["about me", "my projects", "my skills", "contact"].map(
                  (label) => (
                    <button
                      key={label}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendMessage(label);
                      }}
                      className="win-button"
                      style={{ minWidth: "auto" }}
                      aria-label={`Ask about ${label}`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, idx) => (
          <MessageBlock key={msg.id} msg={msg} nextMsg={messages[idx + 1]} />
        ))}

        {/* Inline prompt */}
        {!isLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              fontFamily: '"Courier New", monospace',
              fontSize: "12px",
            }}
          >
            <span
              style={{
                flexShrink: 0,
                color: "#000080",
                fontWeight: "bold",
              }}
            >
              C:\raphael\agent{">"}
            </span>
            <span className="relative flex-1 min-w-[1px]" style={{ marginLeft: "4px" }}>
              <AnimatedPlaceholder
                visible={inputValue.length === 0 && messages.length === 0}
              />
              <span
                ref={inputRef}
                contentEditable
                suppressContentEditableWarning
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                className="outline-none inline-block min-w-[1px]"
                style={{
                  color: "#000000",
                  caretColor: "#000000",
                  fontFamily: '"Courier New", monospace',
                  fontSize: "12px",
                }}
                spellCheck={false}
                aria-label="Enter your message"
                role="textbox"
              />
            </span>
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "14px",
                backgroundColor: "#000000",
                marginLeft: "1px",
                animation: "pulse 1s step-end infinite",
              }}
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </div>
  );
}
