import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "RAPHAEL.AGENT — Research Engineer & LLM Developer",
  description:
    "Raphael Valdetaro — Research Engineer & LLM Developer. AI agent-themed portfolio.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
