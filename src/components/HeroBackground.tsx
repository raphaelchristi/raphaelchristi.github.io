"use client";

import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";

export function HeroBackground({ children }: { children: React.ReactNode }) {
  return (
    <StarsBackground
      speed={80}
      starColor="rgba(168, 162, 255, 0.8)"
      className="!bg-transparent"
    >
      <div className="relative z-10">{children}</div>
    </StarsBackground>
  );
}
