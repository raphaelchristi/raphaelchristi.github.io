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
          style={{ color: "#5070ff" }}
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
          style={{ color: "#5070ff" }}
        >
          {earliest.match[0]}
        </a>,
      );
      remaining = remaining.slice(earliest.index + earliest.match[0].length);
    }
  }

  return parts;
}

function parseBold(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = /\*\*(.+?)\*\*/.exec(remaining);
    const linkMatch = LINK_RE.exec(remaining);

    const matches = [
      boldMatch ? { type: "bold" as const, match: boldMatch, index: boldMatch.index } : null,
      linkMatch ? { type: "link" as const, match: linkMatch, index: linkMatch.index } : null,
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

    if (earliest.type === "bold") {
      parts.push(
        <span key={key++} className="font-bold" style={{ color: "#e0e4ef" }}>
          {earliest.match[1]}
        </span>,
      );
    } else {
      parts.push(
        <a
          key={key++}
          href={earliest.match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
          style={{ color: "#5070ff" }}
        >
          {earliest.match[1]}
        </a>,
      );
    }
    remaining = remaining.slice(earliest.index + earliest.match[0].length);
  }

  return parts;
}

function renderMarkdownAsTerminal(content: string): React.ReactNode {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    let processed = line;

    // Headings → remove # prefix, render bold with size
    if (processed.startsWith("# ")) {
      return (
        <div key={i} className="mt-3 first:mt-0 mb-2 font-bold text-[18px]" style={{ color: "#e0e4ef" }}>
          {parseBold(processed.slice(2))}
        </div>
      );
    }
    if (processed.startsWith("## ")) {
      return (
        <div key={i} className="mt-4 mb-2 font-bold text-[15px]" style={{ color: "#c0c8e0" }}>
          {parseBold(processed.slice(3))}
        </div>
      );
    }
    if (processed.startsWith("### ")) {
      return (
        <div key={i} className="mt-3 mb-1 font-semibold text-[14px]" style={{ color: "#b0b8d0" }}>
          {parseBold(processed.slice(4))}
        </div>
      );
    }

    // List items → green bullet, remove dash
    if (processed.startsWith("- ")) {
      return (
        <div key={i}>
          <span style={{ color: "#5070ff" }}>  ▸ </span>
          {parseBold(processed.slice(2))}
        </div>
      );
    }

    // Strip bold markers for plain text
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
      <span style={{ color: "#7a8299" }}>{"{"}</span>
      {"\n"}
      {entries.map(([key, value], idx) => {
        const strValue = String(value);
        const isUrl = typeof value === "string" && (strValue.startsWith("http://") || strValue.startsWith("https://"));
        const isEmail = typeof value === "string" && strValue.includes("@") && !strValue.startsWith("http");

        return (
          <span key={key}>
            {"  "}
            <span style={{ color: "#5070ff" }}>&quot;{key}&quot;</span>
            <span style={{ color: "#7a8299" }}>: </span>
            {isUrl ? (
              <a
                href={strValue}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
                style={{ color: "#a5b4fc" }}
              >
                &quot;{strValue}&quot;
              </a>
            ) : isEmail ? (
              <a
                href={`mailto:${strValue}`}
                className="underline underline-offset-2 hover:opacity-80"
                style={{ color: "#a5b4fc" }}
              >
                &quot;{strValue}&quot;
              </a>
            ) : (
              <span style={{ color: "#a5b4fc" }}>
                &quot;{strValue}&quot;
              </span>
            )}
            {idx < entries.length - 1 && <span style={{ color: "#7a8299" }}>,</span>}
            {"\n"}
          </span>
        );
      })}
      <span style={{ color: "#7a8299" }}>{"}"}</span>
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
      className="font-mono text-[14px] md:text-[15px] leading-relaxed whitespace-pre-wrap break-words"
      style={{
        color: "#c0c8e0",
        textShadow: "0 0 8px rgba(80, 112, 255, 0.1)",
      }}
    >
      {contentType === "json"
        ? renderJsonAsTerminal(content)
        : renderMarkdownAsTerminal(content)}
    </pre>
  );
}
