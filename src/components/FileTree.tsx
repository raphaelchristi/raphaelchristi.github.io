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
    <div className="py-2">
      <p
        className="px-4 py-2 text-[11px] font-semibold tracking-widest uppercase"
        style={{ color: "var(--muted)" }}
      >
        Explorer
      </p>
      <p
        className="px-4 pb-2 text-[12px] font-mono"
        style={{ color: "var(--muted)" }}
      >
        raphael.agent
      </p>
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
    </div>
  );
}
