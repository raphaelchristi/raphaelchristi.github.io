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
          style={{ color: "#000080" }}
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
          style={{ color: "#000080" }}
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
    const italicMatch = /(?<!\*)\*([^*]+?)\*(?!\*)/.exec(remaining);
    const linkMatch = LINK_RE.exec(remaining);
    const codeMatch = /`([^`]+?)`/.exec(remaining);

    const matches = [
      boldMatch ? { type: "bold" as const, match: boldMatch, index: boldMatch.index } : null,
      italicMatch ? { type: "italic" as const, match: italicMatch, index: italicMatch.index } : null,
      linkMatch ? { type: "link" as const, match: linkMatch, index: linkMatch.index } : null,
      codeMatch ? { type: "code" as const, match: codeMatch, index: codeMatch.index } : null,
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
        <span key={key++} className="font-bold" style={{ color: "#000000" }}>
          {earliest.match[1]}
        </span>,
      );
    } else if (earliest.type === "italic") {
      parts.push(
        <span key={key++} className="italic" style={{ color: "#000000" }}>
          {earliest.match[1]}
        </span>,
      );
    } else if (earliest.type === "code") {
      parts.push(
        <span key={key++} className="px-1 py-0.5 text-[11px]" style={{ backgroundColor: "#e8e8e8", color: "#000080", border: "1px solid #aaaaaa", fontFamily: '"Courier New", monospace' }}>
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
          style={{ color: "#000080" }}
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
    const processed = line;

    // Headings → remove # prefix, render bold with size
    if (processed.startsWith("# ")) {
      return (
        <div key={i} className="mt-3 first:mt-0 mb-2 font-bold text-[14px]" style={{ color: "#000080" }}>
          {parseBold(processed.slice(2))}
        </div>
      );
    }
    if (processed.startsWith("## ")) {
      return (
        <div key={i} className="mt-4 mb-2 font-bold text-[13px]" style={{ color: "#000080" }}>
          {parseBold(processed.slice(3))}
        </div>
      );
    }
    if (processed.startsWith("### ")) {
      return (
        <div key={i} className="mt-3 mb-1 font-semibold text-[12px]" style={{ color: "#000000" }}>
          {parseBold(processed.slice(4))}
        </div>
      );
    }

    // List items → bullet, supports both "- " and "* "
    if (processed.startsWith("- ") || processed.startsWith("* ")) {
      return (
        <div key={i}>
          <span style={{ color: "#000080" }}>  ▸ </span>
          {parseBold(processed.slice(2))}
        </div>
      );
    }

    // Indented list items ("  - " or "  * ")
    const indentMatch = /^(\s+)[-*] (.*)/.exec(processed);
    if (indentMatch) {
      return (
        <div key={i}>
          <span style={{ color: "#000080" }}>    ▸ </span>
          {parseBold(indentMatch[2] ?? "")}
        </div>
      );
    }

    // Empty lines
    if (processed.trim() === "") {
      return <div key={i} className="h-2" />;
    }

    // Regular text — parse bold, italic, code, links
    return <div key={i}>{parseBold(processed)}</div>;
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
      <span style={{ color: "#444444" }}>{"{"}</span>
      {"\n"}
      {entries.map(([key, value], idx) => {
        const strValue = String(value);
        const isUrl = typeof value === "string" && (strValue.startsWith("http://") || strValue.startsWith("https://"));
        const isEmail = typeof value === "string" && strValue.includes("@") && !strValue.startsWith("http");

        return (
          <span key={key}>
            {"  "}
            <span style={{ color: "#000080" }}>&quot;{key}&quot;</span>
            <span style={{ color: "#444444" }}>: </span>
            {isUrl ? (
              <a
                href={strValue}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
                style={{ color: "#000080" }}
              >
                &quot;{strValue}&quot;
              </a>
            ) : isEmail ? (
              <a
                href={`mailto:${strValue}`}
                className="underline underline-offset-2 hover:opacity-80"
                style={{ color: "#000080" }}
              >
                &quot;{strValue}&quot;
              </a>
            ) : (
              <span style={{ color: "#008000" }}>
                &quot;{strValue}&quot;
              </span>
            )}
            {idx < entries.length - 1 && <span style={{ color: "#444444" }}>,</span>}
            {"\n"}
          </span>
        );
      })}
      <span style={{ color: "#444444" }}>{"}"}</span>
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
      className="font-mono text-[12px] leading-relaxed whitespace-pre-wrap break-words"
      style={{
        color: "#000000",
        fontFamily: '"Courier New", monospace',
      }}
    >
      {contentType === "json"
        ? renderJsonAsTerminal(content)
        : renderMarkdownAsTerminal(content)}
    </pre>
  );
}
