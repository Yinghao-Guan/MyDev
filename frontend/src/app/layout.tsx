import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google"; // 假设你用了这个字体，或者是 Inter
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"; // [新增] 引入 Analytics

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
        {children}
        <Analytics /> {/* [新增] 插入组件，建议放在 body 最后 */}
      </body>
    </html>
  );
}