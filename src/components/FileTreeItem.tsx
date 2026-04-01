"use client";

import { useState } from "react";
import type { AgentFile } from "@/data/agent-files";

type Props = {
  file: AgentFile;
  depth: number;
  selectedPath: string;
  onSelect: (path: string, file: AgentFile) => void;
  parentPath: string;
};

function FolderIcon({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      {open ? (
        <>
          <path d="M1 5 L1 14 L15 14 L15 6 L7 6 L5 4 L1 4 Z" fill="#ffcc00" stroke="#cc9900" strokeWidth="0.8" />
          <path d="M1 6 L15 6 L13 14 L3 14 Z" fill="#ffdd44" stroke="#cc9900" strokeWidth="0.8" />
        </>
      ) : (
        <>
          <rect x="1" y="4" width="14" height="10" rx="0" fill="#ffcc00" stroke="#cc9900" strokeWidth="0.8" />
          <rect x="1" y="3" width="6" height="3" rx="0" fill="#ffcc00" stroke="#cc9900" strokeWidth="0.8" />
        </>
      )}
    </svg>
  );
}

function FileIcon({ name }: { name: string }) {
  const isJson = name.endsWith(".json");
  const isMd = name.endsWith(".md") || name.endsWith(".txt");

  if (isJson) {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
        <rect x="2" y="1" width="9" height="14" rx="0" fill="#ffffff" stroke="#808080" strokeWidth="0.8" />
        <path d="M9 1 L12 4 L9 4 Z" fill="#d4d0c8" stroke="#808080" strokeWidth="0.6" />
        <rect x="4" y="6" width="6" height="1" fill="#0000aa" />
        <rect x="4" y="8" width="5" height="1" fill="#666666" />
        <rect x="4" y="10" width="4" height="1" fill="#666666" />
        <rect x="4" y="12" width="3" height="1" fill="#666666" />
      </svg>
    );
  }

  if (isMd) {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
        <rect x="2" y="1" width="9" height="14" rx="0" fill="#ffffff" stroke="#808080" strokeWidth="0.8" />
        <path d="M9 1 L12 4 L9 4 Z" fill="#d4d0c8" stroke="#808080" strokeWidth="0.6" />
        <rect x="4" y="5" width="5" height="1.5" fill="#000080" />
        <rect x="4" y="8" width="6" height="1" fill="#666666" />
        <rect x="4" y="10" width="5" height="1" fill="#666666" />
        <rect x="4" y="12" width="4" height="1" fill="#666666" />
      </svg>
    );
  }

  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="2" y="1" width="9" height="14" rx="0" fill="#ffffff" stroke="#808080" strokeWidth="0.8" />
      <path d="M9 1 L12 4 L9 4 Z" fill="#d4d0c8" stroke="#808080" strokeWidth="0.6" />
      <rect x="4" y="7" width="6" height="1" fill="#666666" />
      <rect x="4" y="9" width="5" height="1" fill="#666666" />
      <rect x="4" y="11" width="4" height="1" fill="#666666" />
    </svg>
  );
}

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
        style={{
          width: "100%",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: "3px",
          paddingTop: "1px",
          paddingBottom: "1px",
          paddingRight: "4px",
          paddingLeft: `${depth * 14 + 4}px`,
          fontFamily: '"Tahoma", "MS Sans Serif", sans-serif',
          fontSize: "11px",
          backgroundColor: isSelected ? "#000080" : "transparent",
          color: isSelected ? "#ffffff" : "#000000",
          cursor: "default",
          border: "none",
          outline: "none",
          userSelect: "none",
        }}
        aria-selected={isSelected}
        aria-expanded={isFolder ? expanded : undefined}
      >
        {/* Expand/collapse triangle for folders */}
        {isFolder && (
          <span
            style={{
              fontSize: "8px",
              marginRight: "1px",
              color: isSelected ? "#ffffff" : "#666666",
              display: "inline-block",
              width: "8px",
            }}
          >
            {expanded ? "▼" : "▶"}
          </span>
        )}
        {!isFolder && <span style={{ display: "inline-block", width: "9px" }} />}

        {isFolder ? (
          <FolderIcon open={expanded} />
        ) : (
          <FileIcon name={file.name} />
        )}
        <span style={{ marginLeft: "3px" }}>{file.name}</span>
      </button>

      {isFolder && expanded && file.children && (
        <div>
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
        </div>
      )}
    </div>
  );
}
