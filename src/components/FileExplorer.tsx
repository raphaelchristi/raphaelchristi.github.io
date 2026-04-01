"use client";

import { useState } from "react";
import { agentFileTree } from "@/data/agent-files";
import type { AgentFile } from "@/data/agent-files";
import { useAgentChat } from "@/hooks/useAgentChat";
import FileTree from "./FileTree";
import ContentPanel from "./ContentPanel";

export default function FileExplorer() {
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedFile, setSelectedFile] = useState<AgentFile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    messages,
    isLoading,
    hasCheckedHealth,
    sendMessage,
    addFileRead,
    chatEnabled,
  } = useAgentChat();

  const handleSelect = (path: string, file: AgentFile) => {
    setSelectedPath(path);
    setSelectedFile(file);
    setSidebarOpen(false);
  };

  return (
    <section
      className="w-full border-t"
      style={{
        borderColor: "var(--border)",
        height: "calc(100vh - 160px)",
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

      <div className="flex" style={{ height: "calc(100% - 28px)" }}>
        {/* Sidebar */}
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

        {/* Content panel with chat */}
        <div
          className="flex-1 flex flex-col min-h-0"
          style={{ backgroundColor: "var(--background)" }}
        >
          <ContentPanel
            selectedFile={selectedFile}
            selectedPath={selectedPath}
            messages={messages}
            isLoading={isLoading}
            hasCheckedHealth={hasCheckedHealth}
            chatEnabled={chatEnabled}
            onSendMessage={sendMessage}
            onFileRead={addFileRead}
          />
        </div>
      </div>

      {/* Status bar */}
      <div
        style={{
          height: "28px",
          background: "#0f1525",
          borderTop: "1px solid #1a2340",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          fontSize: "12px",
          fontFamily: "monospace",
          color: "#7a8299",
          gap: "16px",
        }}
      >
        <a
          href="https://github.com/raphaelchristi"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#5070ff", textDecoration: "none" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.7"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
        >
          github
        </a>
        <a
          href="https://www.linkedin.com/in/raphael-valdetaro/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#5070ff", textDecoration: "none" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.7"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
        >
          linkedin
        </a>
        <a
          href="mailto:raphaelvaldetaro@gmail.com"
          style={{ color: "#5070ff", textDecoration: "none" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.7"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
        >
          email
        </a>
        <span style={{ marginLeft: "auto" }}>Online · Rio de Janeiro, RJ</span>
      </div>
    </section>
  );
}
