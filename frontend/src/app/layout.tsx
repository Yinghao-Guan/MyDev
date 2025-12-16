import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Analytics } from "@vercel/analytics/react";
import BackendAwakener from "@/components/features/BackendAwakener";

export const metadata: Metadata = {
  title: "Peter Guan | Digital Cortex",
  description: "Interactive Terminal Portfolio. Full Stack Quant & HCI Researcher. Exploring Next.js 15, FastAPI, and AI Agents.",
  openGraph: {
    title: "Peter Guan | Full Stack & Quant",
    description: "Initialize connection... Access Peter's digital cortex via command line.",
    url: "https://peterguan.dev",
    siteName: "Peter Guan",
    images: [
      {
        url: "/og-terminal.png",
        width: 1200,
        height: 630,
        alt: "Peter Guan's Terminal Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peter Guan | Digital Cortex",
    description: "Interactive Terminal Portfolio powered by Local LLMs.",
    images: ["/og-terminal.png"],
  },
};

// 字体配置
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mono.variable} antialiased bg-[#0d0d0d] text-gray-300`}>
        {/* 唤醒器 */}
        <BackendAwakener />

        <Navbar />

        {/* 页面内容 */}
        {children}

        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  );
}