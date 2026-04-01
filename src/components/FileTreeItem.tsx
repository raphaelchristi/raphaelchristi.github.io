"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { AgentFile } from "@/data/agent-files";

type Props = {
  file: AgentFile;
  depth: number;
  selectedPath: string;
  onSelect: (path: string, file: AgentFile) => void;
  parentPath: string;
};

export default function FileTreeItem({
  file,
  depth,
  selectedPath,
  onSelect,
  parentPath,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const fullPath = parentPath ? `${parentPath}/${file.name}` : file.name;
  const isSelected = selectedPath === fullPath;
  const isFolder = file.type === "folder";

  const handleClick = () => {
    if (isFolder) {
      setExpanded(!expanded);
    } else {
      onSelect(fullPath, file);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="w-full text-left flex items-center gap-1.5 py-1 px-2 rounded-sm text-[13px] font-mono transition-colors duration-100 hover:bg-[var(--selected)]"
        style={{
          paddingLeft: `${depth * 16 + 8}px`,
          backgroundColor: isSelected ? "var(--selected)" : "transparent",
          color: isSelected ? "var(--foreground)" : "var(--muted)",
        }}
      >
        {isFolder && (
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="inline-block text-[10px]"
          >
            ▶
          </motion.span>
        )}
        <span>{isFolder ? (expanded ? "📂" : "📁") : file.name.endsWith(".json") ? "⚙️" : "📄"}</span>
        <span>{file.name}</span>
      </button>

      {isFolder && (
        <AnimatePresence initial={false}>
          {expanded && file.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden" }}
            >
              {file.children.map((child) => (
                <FileTreeItem
                  key={child.name}
                  file={child}
                  depth={depth + 1}
                  selectedPath={selectedPath}
                  onSelect={onSelect}
                  parentPath={fullPath}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
