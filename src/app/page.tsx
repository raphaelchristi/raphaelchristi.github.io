import HeroSection from "@/components/HeroSection";
import FileExplorer from "@/components/FileExplorer";

export default function Page() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <HeroSection />
      <FileExplorer />
    </div>
  );
}
