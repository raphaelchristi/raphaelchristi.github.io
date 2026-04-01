"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { countByFolder } from "@/data/agent-files";

const ASCII_ART = [
  "██████╗  █████╗ ██████╗ ██╗  ██╗ █████╗ ███████╗██╗          █████╗  ██████╗ ███████╗███╗   ██╗████████╗",
  "██╔══██╗██╔══██╗██╔══██╗██║  ██║██╔══██╗██╔════╝██║         ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝",
  "██████╔╝███████║██████╔╝███████║███████║█████╗  ██║         ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ",
  "██╔══██╗██╔══██║██╔═══╝ ██╔══██║██╔══██║██╔══╝  ██║         ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ",
  "██║  ██║██║  ██║██║     ██║  ██║██║  ██║███████╗███████╗    ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ",
  "╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ",
].join("\n");

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
        30,
      );
      return () => clearTimeout(timeout);
    }
  }, [displayed, text, started]);

  return (
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="animate-pulse">▊</span>
      )}
    </span>
  );
}

export default function HeroSection() {
  const skillsCount = countByFolder("skills");
  const toolsCount = countByFolder("tools");
  const projectsCount = countByFolder("projects");

  return (
    <section className="w-full py-20 md:py-32 text-center overflow-hidden">
      <div className="container mx-auto px-4">
        {/* ASCII art title - exact Hermes Agent style */}
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 0.8 }}
          aria-hidden="true"
          className="mb-7 overflow-x-auto"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontVariantLigatures: "none",
            fontSize: "clamp(4px, 0.95vw, 11px)",
            lineHeight: 1.15,
            color: "#5070FF",
            textShadow: "0 0 20px rgba(48, 80, 255, 0.3)",
            whiteSpace: "pre",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.85"; }}
        >
          {ASCII_ART}
        </motion.pre>

        {/* Subtitle - Hermes style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: "var(--foreground)" }}>
            Research Engineer &
          </h1>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
            style={{ color: "#5070FF" }}
          >
            LLM Developer.
          </h1>
        </motion.div>

        {/* Status line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 font-mono text-sm md:text-base space-y-1"
          style={{ color: "var(--muted)" }}
        >
          <p>
            <span>{">"} </span>
            <TypingLine text="Status: " delay={1000} />
            <span style={{ color: "var(--accent)" }}>
              <TypingLine text="online" delay={1400} />
            </span>
            <TypingLine
              text={` | Skills: ${skillsCount} | Tools: ${toolsCount} | Projects: ${projectsCount}`}
              delay={1800}
            />
          </p>
        </motion.div>
      </div>
    </section>
  );
}
