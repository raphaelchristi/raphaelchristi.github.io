"use client";

import React from "react";

const BOLD_RE = /\*\*(.+?)\*\*/;
const LINK_RE = /\[(.+?)\]\((.+?)\)/;
const CODE_RE = /`(.+?)`/;

function parseLine(line: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = BOLD_RE.exec(remaining);
    const linkMatch = LINK_RE.exec(remaining);
    const codeMatch = CODE_RE.exec(remaining);

    const matches = [
      boldMatch ? { type: "bold" as const, match: boldMatch, index: boldMatch.index } : null,
      linkMatch ? { type: "link" as const, match: linkMatch, index: linkMatch.index } : null,
      codeMatch ? { type: "code" as const, match: codeMatch, index: codeMatch.index } : null,
    ]
      .filter(
        (m): m is NonNullable<typeof m> => m !== null,
      )
      .sort((a, b) => a.index - b.index);

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const earliest = matches[0]!;
    if (earliest.index > 0) {
      parts.push(remaining.slice(0, earliest.index));
    }

    if (earliest.type === "bold") {
      parts.push(
        <strong key={key++} className="font-semibold text-white">
          {earliest.match[1]}
        </strong>,
      );
      remaining = remaining.slice(earliest.index + earliest.match[0].length);
    } else if (earliest.type === "link") {
      parts.push(
        <a
          key={key++}
          href={earliest.match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors"
          style={{ color: "var(--primary)" }}
        >
          {earliest.match[1]}
        </a>,
      );
      remaining = remaining.slice(earliest.index + earliest.match[0].length);
    } else if (earliest.type === "code") {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded text-[13px] font-mono"
          style={{ backgroundColor: "var(--selected)" }}
        >
          {earliest.match[1]}
        </code>,
      );
      remaining = remaining.slice(earliest.index + earliest.match[0].length);
    }
  }

  return parts;
}

export default function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";

    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={i}
          className="text-2xl font-bold text-white mb-4 mt-2 first:mt-0"
        >
          {parseLine(line.slice(2))}
        </h1>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="text-lg font-semibold text-white mb-3 mt-6"
        >
          {parseLine(line.slice(3))}
        </h2>,
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={i}
          className="text-base font-semibold text-white mb-2 mt-4"
        >
          {parseLine(line.slice(4))}
        </h3>,
      );
    } else if (line.startsWith("- ")) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && (lines[i] ?? "").startsWith("- ")) {
        listItems.push(
          <li key={i} className="ml-4 list-disc" style={{ color: "var(--muted)" }}>
            <span style={{ color: "var(--foreground)" }}>
              {parseLine((lines[i] ?? "").slice(2))}
            </span>
          </li>,
        );
        i++;
      }
      elements.push(
        <ul key={`list-${i}`} className="space-y-1.5 mb-4 text-[15px]">
          {listItems}
        </ul>,
      );
      continue;
    } else if (line.trim() === "") {
      // skip empty lines
    } else {
      elements.push(
        <p key={i} className="mb-3 text-[15px] leading-relaxed" style={{ color: "var(--foreground)" }}>
          {parseLine(line)}
        </p>,
      );
    }

    i++;
  }

  return <div className="max-w-2xl">{elements}</div>;
}
