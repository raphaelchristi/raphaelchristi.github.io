import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

// TRPCReactProvider removido, pois a página atual do portfólio é estática
// import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Raphael Valdetaro - LLM Developer & Research Engineer",
  description: "Portfolio of Raphael Valdetaro, LLM Developer and Research Engineer specializing in creating innovative web applications and AI solutions.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <body>
        {children}
      </body>
    </html>
  );
}
