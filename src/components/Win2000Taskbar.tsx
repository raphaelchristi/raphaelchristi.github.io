"use client";

import { useState, useEffect } from "react";

export default function Win2000Taskbar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="win-taskbar">
      {/* Start button */}
      <button className="win-start-button" aria-label="Start menu">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <rect x="0" y="0" width="5" height="5" fill="#ff0000" />
          <rect x="7" y="0" width="5" height="5" fill="#00cc00" />
          <rect x="0" y="7" width="5" height="5" fill="#0000ff" />
          <rect x="7" y="7" width="5" height="5" fill="#ffff00" />
        </svg>
        <span>start</span>
      </button>

      {/* Divider */}
      <div
        style={{
          width: "1px",
          height: "20px",
          borderLeft: "1px solid rgba(255,255,255,0.3)",
          borderRight: "1px solid rgba(0,0,0,0.3)",
          marginLeft: "4px",
          marginRight: "4px",
        }}
      />

      {/* Active window button */}
      <button
        style={{
          backgroundColor: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#ffffff",
          fontFamily: '"Tahoma", sans-serif',
          fontSize: "11px",
          padding: "2px 10px",
          height: "22px",
          cursor: "default",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          minWidth: "160px",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="14" height="10" rx="0" fill="#000080" />
          <rect x="2" y="2" width="12" height="8" fill="#0000c0" />
          <rect x="1" y="11" width="14" height="4" fill="#d4d0c8" />
        </svg>
        raphael.agent — AI Engineer
      </button>

      {/* System tray */}
      <div className="win-taskbar-clock" aria-label={`Current time: ${time}`}>
        {time}
      </div>
    </div>
  );
}
