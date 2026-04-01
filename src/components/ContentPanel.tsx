"use client";

import { motion, AnimatePresence } from "motion/react";
import type { AgentFile } from "@/data/agent-files";
import MarkdownRenderer from "./MarkdownRenderer";
import JsonRenderer from "./JsonRenderer";

type Props = {
  selectedFile: AgentFile | null;
  selectedPath: string;
};

export default function ContentPanel({ selectedFile, selectedPath }: Props) {
  if (!selectedFile) {
    return (
      <div
        className="flex-1 flex items-center justify-center font-mono text-sm"
        style={{ color: "var(--muted)" }}
      >
        Select a file to view
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Tab bar */}
      <div
        className="flex items-center h-9 border-b px-2 shrink-0"
        style={{
          backgroundColor: "var(--tab-bg)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-1 text-[13px] font-mono border-b-2"
          style={{
            color: "var(--foreground)",
            borderColor: "var(--primary)",
          }}
        >
          <span>
            {selectedFile.name.endsWith(".json") ? "⚙️" : "📄"}
          </span>
          <span>{selectedPath}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPath}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {selectedFile.contentType === "json" ? (
              <JsonRenderer content={selectedFile.content ?? "{}"} />
            ) : (
              <MarkdownRenderer content={selectedFile.content ?? ""} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
