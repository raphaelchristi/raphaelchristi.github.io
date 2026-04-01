import "@/styles/globals.css";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Raphael Valdetaro · AI Engineer",
  description:
    "Raphael Valdetaro — AI Engineer especializado em multi-agent systems com LangGraph e Claude. Rio de Janeiro, Brazil.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#008080" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
