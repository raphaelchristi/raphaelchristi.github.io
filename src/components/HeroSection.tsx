"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { countByFolder } from "@/data/agent-files";

const ASCII_ART = `
██████╗   █████╗  ██████╗  ██╗  ██╗  █████╗  ███████╗ ██╗
██╔══██╗ ██╔══██╗ ██╔══██╗ ██║  ██║ ██╔══██╗ ██╔════╝ ██║
██████╔╝ ███████║ ██████╔╝ ███████║ ███████║ █████╗   ██║
██╔══██╗ ██╔══██║ ██╔═══╝  ██╔══██║ ██╔══██║ ██╔══╝   ██║
██║  ██║ ██║  ██║ ██║      ██║  ██║ ██║  ██║ ███████╗ ███████╗
╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝      ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚══════╝ ╚══════╝

          █████╗   ██████╗  ███████╗ ███╗   ██╗ ████████╗
         ██╔══██╗ ██╔════╝  ██╔════╝ ████╗  ██║ ╚══██╔══╝
         ███████║ ██║  ███╗ █████╗   ██╔██╗ ██║    ██║
         ██╔══██║ ██║   ██║ ██╔══╝   ██║╚██╗██║    ██║
    ██╗  ██║  ██║ ╚██████╔╝ ███████╗ ██║ ╚████║    ██║
    ╚═╝  ╚═╝  ╚═╝  ╚═════╝  ╚══════╝ ╚═╝  ╚═══╝    ╚═╝`.trimStart();

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
    <section className="w-full py-16 md:py-24 text-center overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="font-mono text-[5px] leading-[1.1] sm:text-[7px] md:text-[9px] lg:text-xs xl:text-sm whitespace-pre inline-block text-left"
          style={{ color: "var(--foreground)" }}
        >
          {ASCII_ART}
        </motion.pre>

        <div
          className="mt-8 font-mono text-sm md:text-base space-y-1"
          style={{ color: "var(--muted)" }}
        >
          <p>
            <span style={{ color: "var(--muted)" }}>{">"} </span>
            <TypingLine
              text="Research Engineer & LLM Developer"
              delay={800}
            />
          </p>
          <p>
            <span style={{ color: "var(--muted)" }}>{">"} </span>
            <TypingLine
              text={`Status: `}
              delay={2200}
            />
            <span style={{ color: "var(--accent)" }}>
              <TypingLine text="online" delay={2500} />
            </span>
            <TypingLine
              text={` | Skills: ${skillsCount} | Tools: ${toolsCount} | Projects: ${projectsCount}`}
              delay={2800}
            />
          </p>
        </div>
      </div>
    </section>
  );
}
