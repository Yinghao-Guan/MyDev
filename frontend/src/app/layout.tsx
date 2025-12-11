// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google"; // 引入更好看的代码字体
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

// 配置字体
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono" 
});

export const metadata: Metadata = {
  title: "Peter Guan | Full Stack & Quant",
  description: "Personal Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-black text-white`}>
        {/* 导航栏永远在最上面 */}
        <Navbar />
        
        {/* 页面内容，加一个上边距(pt-14)给导航栏留位置 */}
        <div className="pt-14 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}