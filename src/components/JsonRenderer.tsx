"use client";

export default function JsonRenderer({ content }: { content: string }) {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    return (
      <pre className="font-mono text-sm" style={{ color: "var(--foreground)" }}>
        {content}
      </pre>
    );
  }

  const renderValue = (value: unknown): React.ReactNode => {
    if (typeof value === "string") {
      const isUrl =
        value.startsWith("http://") || value.startsWith("https://");
      const isEmail = value.includes("@") && !value.startsWith("http");

      if (isUrl) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80"
            style={{ color: "var(--json-string)" }}
          >
            &quot;{value}&quot;
          </a>
        );
      }
      if (isEmail) {
        return (
          <a
            href={`mailto:${value}`}
            className="underline underline-offset-2 hover:opacity-80"
            style={{ color: "var(--json-string)" }}
          >
            &quot;{value}&quot;
          </a>
        );
      }
      return (
        <span style={{ color: "var(--json-string)" }}>
          &quot;{value}&quot;
        </span>
      );
    }
    return (
      <span style={{ color: "var(--foreground)" }}>
        {String(value)}
      </span>
    );
  };

  const entries = Object.entries(parsed);

  return (
    <pre className="font-mono text-sm leading-7">
      <span style={{ color: "var(--json-punct)" }}>{"{"}</span>
      {"\n"}
      {entries.map(([key, value], idx) => (
        <span key={key}>
          {"  "}
          <span style={{ color: "var(--json-key)" }}>&quot;{key}&quot;</span>
          <span style={{ color: "var(--json-punct)" }}>: </span>
          {renderValue(value)}
          {idx < entries.length - 1 && (
            <span style={{ color: "var(--json-punct)" }}>,</span>
          )}
          {"\n"}
        </span>
      ))}
      <span style={{ color: "var(--json-punct)" }}>{"}"}</span>
    </pre>
  );
}
