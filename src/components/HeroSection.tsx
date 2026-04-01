"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
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
        {/* Pixel title - Hermes style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-wide"
            style={{
              fontFamily: "var(--font-pixel), monospace",
              background: "linear-gradient(135deg, #6366f1 0%, #818cf8 40%, #a5b4fc 70%, #6366f1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(99, 102, 241, 0.4)) drop-shadow(0 0 60px rgba(99, 102, 241, 0.2))",
            }}
          >
            RAPHAEL
            <br />
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              .AGENT
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <p
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Research Engineer &
          </p>
          <p
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
            style={{
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            LLM Developer.
          </p>
        </motion.div>

        {/* Status line */}
        <div
          className="mt-8 font-mono text-sm md:text-base space-y-1"
          style={{ color: "var(--muted)" }}
        >
          <p>
            <span>{">"} </span>
            <TypingLine
              text={`Status: `}
              delay={1200}
            />
            <span style={{ color: "var(--accent)" }}>
              <TypingLine text="online" delay={1600} />
            </span>
            <TypingLine
              text={` | Skills: ${skillsCount} | Tools: ${toolsCount} | Projects: ${projectsCount}`}
              delay={2000}
            />
          </p>
        </div>
      </div>
    </section>
  );
}
