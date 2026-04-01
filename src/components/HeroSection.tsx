"use client";

import { useState, useEffect } from "react";
import { countByFolder } from "@/data/agent-files";

function TypingLine({ text, delay }: { text: string; delay: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timeout = setTimeout(
        () => setDisplayed(text.slice(0, displayed.length + 1)),
        30
      );
      return () => clearTimeout(timeout);
    }
  }, [displayed, text, started]);

  return (
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <span style={{ borderRight: "1px solid #000", marginLeft: "1px" }}>&nbsp;</span>
      )}
    </span>
  );
}

function TitleBarButton({ label, title }: { label: string; title: string }) {
  return (
    <button
      className="win-title-button"
      title={title}
      aria-label={title}
    >
      {label}
    </button>
  );
}

export default function HeroSection() {
  const skillsCount = countByFolder("skills");
  const projectsCount = countByFolder("projects");

  return (
    <section className="w-full" aria-label="Profile header">
      {/* Window Title Bar */}
      <div className="win-title-bar">
        {/* Icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          className="mr-1.5 shrink-0"
          aria-hidden="true"
        >
          <rect x="1" y="1" width="14" height="10" fill="#0000c0" />
          <rect x="2" y="2" width="12" height="8" fill="#4040ff" />
          <rect x="4" y="4" width="2" height="2" fill="#ffffff" />
          <rect x="7" y="4" width="2" height="2" fill="#ffffff" />
          <rect x="10" y="4" width="2" height="2" fill="#ffffff" />
          <rect x="1" y="11" width="14" height="4" fill="#d4d0c8" />
        </svg>
        <span className="flex-1 truncate">
          Raphael Valdetaro — AI Engineer · Multi-Agent Systems
        </span>
        <TitleBarButton label="—" title="Minimize" />
        <TitleBarButton label="□" title="Maximize" />
        <button
          className="win-title-button"
          title="Close"
          aria-label="Close"
          style={{
            backgroundColor: "#c0392b",
            borderColor: "#e74c3c #8c2318 #8c2318 #e74c3c",
            color: "#ffffff",
            fontWeight: "bold",
          }}
        >
          ✕
        </button>
      </div>

      {/* Menu bar */}
      <nav className="win-menubar" aria-label="Application menu">
        {["File", "Edit", "View", "Favorites", "Tools", "Help"].map((item) => (
          <span key={item} className="win-menuitem" role="menuitem">
            {item}
          </span>
        ))}
      </nav>

      {/* Toolbar */}
      <div className="win-toolbar" role="toolbar" aria-label="Navigation toolbar">
        <button className="win-button" style={{ minWidth: 60 }} aria-label="Back">
          ← Back
        </button>
        <button className="win-button" style={{ minWidth: 60 }} aria-label="Forward">
          Forward →
        </button>
        <button className="win-button" style={{ minWidth: 50 }} aria-label="Home">
          Home
        </button>
        <div style={{ flex: 1 }} />
        <a
          href="https://github.com/raphaelchristi"
          target="_blank"
          rel="noopener noreferrer"
          className="win-button"
          style={{ minWidth: 60, textDecoration: "none", color: "inherit" }}
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/raphael-valdetaro/"
          target="_blank"
          rel="noopener noreferrer"
          className="win-button"
          style={{ minWidth: 70, textDecoration: "none", color: "inherit" }}
        >
          LinkedIn
        </a>
        <a
          href="mailto:raphaelvaldetaro@gmail.com"
          className="win-button"
          style={{ minWidth: 50, textDecoration: "none", color: "inherit" }}
        >
          Email
        </a>
      </div>

      {/* Address bar */}
      <div
        style={{
          backgroundColor: "var(--window-bg)",
          borderBottom: "1px solid var(--window-border-dark)",
          padding: "2px 6px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          height: "24px",
        }}
      >
        <span
          style={{
            fontFamily: '"Tahoma", sans-serif',
            fontSize: "11px",
            color: "#000",
          }}
        >
          Address
        </span>
        <div
          className="win-addressbar"
          role="textbox"
          aria-label="Current location"
        >
          C:\Users\Raphael\portfolio\agent
        </div>
        <button className="win-button" style={{ minWidth: 30 }} aria-label="Go">
          Go
        </button>
      </div>

      {/* Hero Content */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px 24px",
          borderBottom: "2px solid var(--window-border-dark)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* Computer icon */}
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <rect x="4" y="4" width="40" height="30" rx="1" fill="#d4d0c8" stroke="#808080" strokeWidth="1" />
              <rect x="6" y="6" width="36" height="26" fill="#000080" />
              {/* Screen content: blinking cursor effect */}
              <rect x="8" y="8" width="20" height="2" fill="#00ff00" opacity="0.8" />
              <rect x="8" y="12" width="16" height="2" fill="#00ff00" opacity="0.6" />
              <rect x="8" y="16" width="24" height="2" fill="#00ff00" opacity="0.7" />
              <rect x="8" y="20" width="18" height="2" fill="#00ff00" opacity="0.5" />
              <rect x="8" y="24" width="6" height="2" fill="#00ff00" opacity="0.9" />
              {/* Stand */}
              <rect x="20" y="34" width="8" height="6" fill="#c0bdb4" stroke="#808080" strokeWidth="1" />
              <rect x="14" y="40" width="20" height="3" rx="1" fill="#c0bdb4" stroke="#808080" strokeWidth="1" />
            </svg>
            <p
              style={{
                fontFamily: '"Tahoma", sans-serif',
                fontSize: "11px",
                marginTop: "4px",
                textAlign: "center",
              }}
            >
              My Computer
            </p>
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontFamily: '"Tahoma", "MS Sans Serif", sans-serif',
                fontSize: "18px",
                fontWeight: "bold",
                color: "#000080",
                marginBottom: "4px",
              }}
            >
              Raphael Valdetaro
            </h1>
            <p
              style={{
                fontFamily: '"Tahoma", sans-serif',
                fontSize: "13px",
                color: "#000000",
                marginBottom: "12px",
              }}
            >
              AI Engineer — Building production multi-agent systems
            </p>

            {/* Status info as Win2000 property rows */}
            <table
              style={{
                fontFamily: '"Tahoma", sans-serif',
                fontSize: "11px",
                borderCollapse: "collapse",
                width: "100%",
                maxWidth: "400px",
              }}
              aria-label="Profile information"
            >
              <tbody>
                <tr>
                  <td style={{ padding: "2px 8px 2px 0", color: "#444", width: "100px" }}>Status:</td>
                  <td style={{ padding: "2px 0", color: "#008000", fontWeight: "bold" }}>
                    <TypingLine text="Online" delay={600} />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "2px 8px 2px 0", color: "#444" }}>Location:</td>
                  <td style={{ padding: "2px 0" }}>Rio de Janeiro, RJ</td>
                </tr>
                <tr>
                  <td style={{ padding: "2px 8px 2px 0", color: "#444" }}>Skills:</td>
                  <td style={{ padding: "2px 0" }}>
                    <TypingLine text={`${skillsCount} loaded`} delay={1200} />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "2px 8px 2px 0", color: "#444" }}>Projects:</td>
                  <td style={{ padding: "2px 0" }}>
                    <TypingLine text={`${projectsCount} found`} delay={1800} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* System Properties style box */}
          <div
            className="win-inset"
            style={{
              backgroundColor: "var(--window-bg)",
              padding: "8px 12px",
              minWidth: "200px",
              flexShrink: 0,
            }}
            role="region"
            aria-label="System information"
          >
            <p
              style={{
                fontFamily: '"Tahoma", sans-serif',
                fontSize: "11px",
                fontWeight: "bold",
                marginBottom: "6px",
                color: "#000080",
              }}
            >
              System Properties
            </p>
            {[
              ["OS", "Agent v2.0"],
              ["CPU", "LangGraph + Claude"],
              ["RAM", "Context: 200k"],
              ["HDD", "Vector DB"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  gap: "8px",
                  fontFamily: '"Tahoma", sans-serif',
                  fontSize: "11px",
                  marginBottom: "2px",
                }}
              >
                <span style={{ color: "#444", width: "36px", flexShrink: 0 }}>{k}:</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
