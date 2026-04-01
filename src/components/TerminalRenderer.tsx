"use client";

import React from "react";

const LINK_RE = /\[(.+?)\]\((.+?)\)/;
const URL_RE = /(https?:\/\/[^\s)]+)/;

function parseLinks(line: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  while (remaining.length > 0) {
    const mdLink = LINK_RE.exec(remaining);
    const rawUrl = URL_RE.exec(remaining);

    const matches = [
      mdLink ? { type: "md" as const, match: mdLink, index: mdLink.index } : null,
      rawUrl ? { type: "raw" as const, match: rawUrl, index: rawUrl.index } : null,
    ]
      .filter((m): m is NonNullable<typeof m> => m !== null)
      .sort((a, b) => a.index - b.index);

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const earliest = matches[0]!;
    if (earliest.index > 0) {
      parts.push(remaining.slice(0, earliest.index));
    }

    if (earliest.type === "md") {
      parts.push(
        <a
          key={key++}
          href={earliest.match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
          style={{ color: "#4ade80" }}
        >
          {earliest.match[1]}
        </a>,
      );
      remaining = remaining.slice(earliest.index + earliest.match[0].length);
    } else {
      parts.push(
        <a
          key={key++}
          href={earliest.match[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
          style={{ color: "#4ade80" }}
        >
          {earliest.match[0]}
        </a>,
      );
      remaining = remaining.slice(earliest.index + earliest.match[0].length);
    }
  }

  return parts;
}

function renderMarkdownAsTerminal(content: string): React.ReactNode {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    let processed = line;

    // Headings → bold green with # prefix
    if (processed.startsWith("# ")) {
      return (
        <div key={i} className="mt-2 first:mt-0 mb-1 font-bold" style={{ color: "#4ade80" }}>
          {parseLinks(processed)}
        </div>
      );
    }
    if (processed.startsWith("## ")) {
      return (
        <div key={i} className="mt-3 mb-1 font-bold" style={{ color: "#4ade80", opacity: 0.9 }}>
          {parseLinks(processed)}
        </div>
      );
    }
    if (processed.startsWith("### ")) {
      return (
        <div key={i} className="mt-2 mb-1 font-bold" style={{ color: "#4ade80", opacity: 0.8 }}>
          {parseLinks(processed)}
        </div>
      );
    }

    // List items → keep the dash, green bullet
    if (processed.startsWith("- ")) {
      return (
        <div key={i}>
          <span style={{ color: "#4ade80" }}>  ▸ </span>
          {parseLinks(processed.slice(2))}
        </div>
      );
    }

    // Bold markers → just render with brightness
    processed = processed.replace(/\*\*(.+?)\*\*/g, "$1");

    // Empty lines
    if (processed.trim() === "") {
      return <div key={i} className="h-2" />;
    }

    // Regular text
    return <div key={i}>{parseLinks(processed)}</div>;
  });
}

function renderJsonAsTerminal(content: string): React.ReactNode {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content) as Record<string, unknown>;
  } catch {
    return <span>{content}</span>;
  }

  const entries = Object.entries(parsed);

  return (
    <>
      <span style={{ color: "#888" }}>{"{"}</span>
      {"\n"}
      {entries.map(([key, value], idx) => {
        const strValue = String(value);
        const isUrl = typeof value === "string" && (strValue.startsWith("http://") || strValue.startsWith("https://"));
        const isEmail = typeof value === "string" && strValue.includes("@") && !strValue.startsWith("http");

        return (
          <span key={key}>
            {"  "}
            <span style={{ color: "#4ade80" }}>&quot;{key}&quot;</span>
            <span style={{ color: "#888" }}>: </span>
            {isUrl ? (
              <a
                href={strValue}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
                style={{ color: "#fbbf24" }}
              >
                &quot;{strValue}&quot;
              </a>
            ) : isEmail ? (
              <a
                href={`mailto:${strValue}`}
                className="underline underline-offset-2 hover:opacity-80"
                style={{ color: "#fbbf24" }}
              >
                &quot;{strValue}&quot;
              </a>
            ) : (
              <span style={{ color: "#fbbf24" }}>
                &quot;{strValue}&quot;
              </span>
            )}
            {idx < entries.length - 1 && <span style={{ color: "#888" }}>,</span>}
            {"\n"}
          </span>
        );
      })}
      <span style={{ color: "#888" }}>{"}"}</span>
    </>
  );
}

export default function TerminalRenderer({
  content,
  contentType,
}: {
  content: string;
  contentType: "markdown" | "json";
}) {
  return (
    <pre
      className="font-mono text-[13px] md:text-[14px] leading-relaxed whitespace-pre-wrap break-words"
      style={{
        color: "#d4d4d4",
        textShadow: "0 0 8px rgba(74, 222, 128, 0.15)",
      }}
    >
      {contentType === "json"
        ? renderJsonAsTerminal(content)
        : renderMarkdownAsTerminal(content)}
    </pre>
  );
}
