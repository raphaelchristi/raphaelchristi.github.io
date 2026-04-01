import HeroSection from "@/components/HeroSection";
import FileExplorer from "@/components/FileExplorer";
import Win2000Taskbar from "@/components/Win2000Taskbar";

export default function Page() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--background)",
        paddingBottom: "30px",
        minHeight: "100vh",
      }}
    >
      {/* Desktop window */}
      <div className="win-window mx-auto" style={{ margin: "8px", marginBottom: "0" }}>
        <HeroSection />
        <FileExplorer />
      </div>

      {/* Windows XP/2000 Taskbar fixed at bottom */}
      <Win2000Taskbar />
    </div>
  );
}
