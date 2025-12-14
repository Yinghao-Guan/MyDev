import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar"; // [修复] 重新引入 Navbar
import { Analytics } from "@vercel/analytics/react";

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peter Guan | Full Stack & Quant",
  description: "Personal portfolio of Peter Guan. A digital playground for hardcore tools and aesthetic code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mono.variable} antialiased bg-[#0d0d0d] text-gray-300`}>
        <Navbar />

        {/* 页面内容 */}
        {children}

        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  );
}