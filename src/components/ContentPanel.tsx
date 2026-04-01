"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { AgentFile } from "@/data/agent-files";
import TerminalRenderer from "./TerminalRenderer";

type Props = {
  selectedFile: AgentFile | null;
  selectedPath: string;
};

function TypingPrompt({
  text,
  onDone,
}: {
  text: string;
  onDone: () => void;
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
  }, [text]);

  useEffect(() => {
    if (displayed.length < text.length) {
      const timeout = setTimeout(
        () => setDisplayed(text.slice(0, displayed.length + 1)),
        20,
      );
      return () => clearTimeout(timeout);
    } else {
      onDone();
    }
  }, [displayed, text, onDone]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="animate-pulse">▊</span>
      )}
    </span>
  );
}

export default function ContentPanel({ selectedFile, selectedPath }: Props) {
  const [contentVisible, setContentVisible] = useState(true);
  const [currentPath, setCurrentPath] = useState(selectedPath);

  useEffect(() => {
    if (selectedPath !== currentPath) {
      setContentVisible(false);
      setCurrentPath(selectedPath);
    }
  }, [selectedPath, currentPath]);

  if (!selectedFile) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        {/* Terminal title bar */}
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
        <div
          className="flex-1 flex items-center justify-center font-mono text-sm"
          style={{ color: "#4ade80", backgroundColor: "#0a0a0a" }}
        >
          <span style={{ textShadow: "0 0 8px rgba(74, 222, 128, 0.3)" }}>
            $ waiting for input...
          </span>
          <span className="animate-pulse ml-1">▊</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Terminal title bar - macOS style */}
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

      {/* Terminal content */}
      <div
        className="flex-1 overflow-auto p-5 md:p-6"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPath}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {/* Prompt line */}
            <div
              className="font-mono text-[13px] md:text-[14px] mb-4"
              style={{
                color: "#4ade80",
                textShadow: "0 0 10px rgba(74, 222, 128, 0.3)",
              }}
            >
              <TypingPrompt
                text={`▶ reading ${selectedPath}...`}
                onDone={() => setContentVisible(true)}
              />
            </div>

            {/* File content */}
            {contentVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="border-t pt-4 mb-4"
                  style={{ borderColor: "#333" }}
                />
                <TerminalRenderer
                  content={selectedFile.content ?? ""}
                  contentType={selectedFile.contentType ?? "markdown"}
                />
                <div className="mt-6 font-mono text-[13px] md:text-[14px]">
                  <span style={{ color: "#4ade80", textShadow: "0 0 10px rgba(74, 222, 128, 0.3)" }}>
                    $
                  </span>
                  <span className="animate-pulse ml-1" style={{ color: "#4ade80" }}>▊</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
