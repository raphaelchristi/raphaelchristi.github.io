"use client";

import { useState } from "react";
import { agentFileTree } from "@/data/agent-files";
import type { AgentFile } from "@/data/agent-files";
import FileTree from "./FileTree";
import ContentPanel from "./ContentPanel";

export default function FileExplorer() {
  const defaultFile = agentFileTree[0]!; // AGENT.md
  const [selectedPath, setSelectedPath] = useState("AGENT.md");
  const [selectedFile, setSelectedFile] = useState<AgentFile>(defaultFile);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelect = (path: string, file: AgentFile) => {
    setSelectedPath(path);
    setSelectedFile(file);
    setSidebarOpen(false); // close on mobile
  };

  return (
    <section
      className="w-full border-t"
      style={{
        borderColor: "var(--border)",
        height: "calc(100vh - 280px)",
        minHeight: "500px",
      }}
    >
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden w-full flex items-center gap-2 px-4 py-2 text-[13px] font-mono border-b"
        style={{
          backgroundColor: "var(--sidebar-bg)",
          color: "var(--muted)",
          borderColor: "var(--border)",
        }}
      >
        <span>{sidebarOpen ? "▼" : "▶"}</span>
        <span>EXPLORER</span>
        <span style={{ color: "var(--foreground)" }}>{selectedPath}</span>
      </button>

      <div className="flex h-full">
        {/* Sidebar - desktop always visible, mobile toggled */}
        <div
          className={`
            ${sidebarOpen ? "block" : "hidden"} md:block
            w-full md:w-[280px] md:min-w-[280px]
            border-r overflow-y-auto shrink-0
            absolute md:relative z-20 md:z-auto
          `}
          style={{
            backgroundColor: "var(--sidebar-bg)",
            borderColor: "var(--border)",
            height: sidebarOpen ? "calc(100vh - 320px)" : undefined,
          }}
        >
          <FileTree
            files={agentFileTree}
            selectedPath={selectedPath}
            onSelect={handleSelect}
          />
        </div>

        {/* Content panel */}
        <div
          className="flex-1 flex flex-col min-h-0"
          style={{ backgroundColor: "var(--background)" }}
        >
          <ContentPanel
            selectedFile={selectedFile}
            selectedPath={selectedPath}
          />
        </div>
      </div>
    </section>
  );
}
