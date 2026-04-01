"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  onSend: (message: string) => void;
  disabled: boolean;
};

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="flex items-center gap-2 px-5 py-3 border-t"
      style={{
        backgroundColor: "#0a0a0a",
        borderColor: "#333",
      }}
    >
      <span
        className="font-mono text-[14px] shrink-0"
        style={{
          color: "#4ade80",
          textShadow: "0 0 10px rgba(74, 222, 128, 0.3)",
        }}
      >
        $
      </span>
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={disabled ? "agent is responding..." : "ask me anything about raphael..."}
        rows={1}
        className="flex-1 bg-transparent border-none outline-none resize-none font-mono text-[14px] placeholder:opacity-40"
        style={{
          color: "#d4d4d4",
          caretColor: "#4ade80",
        }}
      />
      {!disabled && value.trim() && (
        <button
          onClick={handleSubmit}
          className="font-mono text-[12px] px-2 py-1 rounded transition-opacity hover:opacity-80"
          style={{
            color: "#4ade80",
            border: "1px solid #333",
          }}
        >
          ↵
        </button>
      )}
    </div>
  );
}
