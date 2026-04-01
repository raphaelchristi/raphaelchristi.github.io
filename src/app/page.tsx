"use client";

import HeroSection from "@/components/HeroSection";
import FileExplorer from "@/components/FileExplorer";
import NoiseOverlay from "@/components/NoiseOverlay";
import { CopilotKit } from "@copilotkit/react-core";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_API_URL ?? "";

export default function Page() {
  return (
    <CopilotKit runtimeUrl={`${AGENT_URL}/copilotkit`} agent="raphael_agent">
      <div className="min-h-screen relative" style={{ backgroundColor: "var(--background)" }}>
        <div className="ambient-glow glow-1" />
        <div className="ambient-glow glow-2" />
        <NoiseOverlay />
        <div className="relative z-10">
          <HeroSection />
          <FileExplorer />
        </div>
      </div>
    </CopilotKit>
  );
}
