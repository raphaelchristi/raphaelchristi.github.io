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
      className="w-full"
      aria-label="File explorer"
      style={{ borderTop: "2px solid var(--window-border-dark)" }}
    >
      {/* Mobile toggle bar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden w-full flex items-center gap-2 px-3 py-1 text-[11px] font-sans"
        style={{
          backgroundColor: "var(--window-bg)",
          color: "var(--foreground)",
          borderBottom: "1px solid var(--window-border-dark)",
        }}
        aria-expanded={sidebarOpen}
        aria-controls="explorer-sidebar"
      >
        <span>{sidebarOpen ? "▼" : "▶"}</span>
        <span style={{ fontWeight: "bold" }}>Folders</span>
        <span style={{ color: "#444" }}>{selectedPath}</span>
      </button>

      {/* Main explorer body */}
      <div
        style={{
          display: "flex",
          height: "calc(100vh - 260px)",
          minHeight: "400px",
          backgroundColor: "var(--window-bg)",
        }}
      >
        {/* Left panel: folder tree */}
        <div
          id="explorer-sidebar"
          className={`${sidebarOpen ? "block" : "hidden"} md:block`}
          style={{
            width: "220px",
            minWidth: "220px",
            borderRight: "2px solid var(--window-border-dark)",
            overflowY: "auto",
            backgroundColor: "var(--window-bg)",
            flexShrink: 0,
          }}
        >
          {/* Sidebar header */}
          <div
            style={{
              background: "linear-gradient(to bottom, #1a6ec7, #1458a8)",
              color: "#ffffff",
              fontFamily: '"Tahoma", sans-serif',
              fontSize: "11px",
              fontWeight: "bold",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <rect x="0" y="2" width="12" height="9" rx="0" fill="#ffcc00" stroke="#cc9900" strokeWidth="1" />
              <rect x="0" y="1" width="5" height="3" rx="0" fill="#ffcc00" stroke="#cc9900" strokeWidth="1" />
            </svg>
            Folders
          </div>
          <FileTree
            files={agentFileTree}
            selectedPath={selectedPath}
            onSelect={handleSelect}
          />
        </div>

        {/* Right panel: content + chat */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            backgroundColor: "#ffffff",
          }}
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
        className="win-statusbar"
        role="status"
        aria-live="polite"
      >
        <div className="win-statusbar-panel" style={{ flex: 1 }}>
          {selectedPath
            ? `${selectedPath}`
            : "Select a file to view its contents"}
        </div>
        <div className="win-statusbar-panel" style={{ minWidth: "120px" }}>
          <a
            href="https://github.com/raphaelchristi"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#000080", textDecoration: "underline", marginRight: "8px" }}
          >
            github
          </a>
          <a
            href="https://www.linkedin.com/in/raphael-valdetaro/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#000080", textDecoration: "underline", marginRight: "8px" }}
          >
            linkedin
          </a>
          <a
            href="mailto:raphaelvaldetaro@gmail.com"
            style={{ color: "#000080", textDecoration: "underline" }}
          >
            email
          </a>
        </div>
        <div className="win-statusbar-panel">
          Online · Rio de Janeiro, RJ
        </div>
      </div>
    </section>
  );
}
