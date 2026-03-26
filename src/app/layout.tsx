import "@/styles/globals.css";

import { type Metadata } from "next";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "Raphael Valdetaro - AI Engineer | AI Architect | Gen AI | LLM",
  description:
    "Portfolio of Raphael Valdetaro, AI Engineer & Architect at the University of Porto. Specializing in LLMs, Generative AI, multi-agent systems, LangChain, and Python.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Raphael Valdetaro - AI Engineer | AI Architect | Gen AI | LLM",
    description:
      "AI Engineer & Architect specializing in LLMs, Generative AI, and multi-agent systems. Based in Porto, Portugal.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`} suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
