"use client";

import HeroSection from "@/components/HeroSection";
import FileExplorer from "@/components/FileExplorer";
import NoiseOverlay from "@/components/NoiseOverlay";
import { CopilotKit } from "@copilotkit/react-core";

export default function Page() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="min-h-screen relative" style={{ backgroundColor: "var(--background)" }}>
        {/* Ambient glow blobs */}
        <div className="ambient-glow glow-1" />
        <div className="ambient-glow glow-2" />

        {/* Noise texture overlay */}
        <NoiseOverlay />

        {/* Content */}
        <div className="relative z-10">
          <HeroSection />
          <FileExplorer />
        </div>
      </div>
    </CopilotKit>
  );
}
