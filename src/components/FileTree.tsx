"use client";

import type { AgentFile } from "@/data/agent-files";
import FileTreeItem from "./FileTreeItem";

type Props = {
  files: AgentFile[];
  selectedPath: string;
  onSelect: (path: string, file: AgentFile) => void;
};

export default function FileTree({ files, selectedPath, onSelect }: Props) {
  return (
    <nav aria-label="File tree navigation" style={{ paddingBottom: "8px" }}>
      {/* Desktop icon row at top */}
      <div
        style={{
          padding: "8px 8px 4px 8px",
          borderBottom: "1px solid #c0bdb4",
          marginBottom: "2px",
        }}
      >
        <p
          style={{
            fontFamily: '"Tahoma", sans-serif',
            fontSize: "11px",
            color: "#000080",
            fontWeight: "bold",
            marginBottom: "2px",
          }}
        >
          raphael.agent
        </p>
        <p
          style={{
            fontFamily: '"Tahoma", sans-serif',
            fontSize: "10px",
            color: "#666666",
          }}
        >
          C:\portfolio\agent\
        </p>
      </div>

      {files.map((file) => (
        <FileTreeItem
          key={file.name}
          file={file}
          depth={0}
          selectedPath={selectedPath}
          onSelect={onSelect}
          parentPath=""
        />
      ))}
    </nav>
  );
}
