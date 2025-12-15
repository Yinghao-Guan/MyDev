// frontend/src/app/page.tsx

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import TerminalHero from "@/components/features/TerminalHero";
import MobileLandingHero from "@/components/features/MobileLandingHero";

const ParticleBackground = dynamic(
  () => import("@/components/layout/ParticleBackground"),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#050505] -z-10" />
  }
);

const MobileMessenger = dynamic(
  () => import("@/components/features/MobileMessenger"),
  { ssr: false }
);

export default function Home() {
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  return (
    // [修复 Logic]:
    // 1. h-screen: 强制容器高度为 100vh (铺满视口)
    // 2. pt-14: 增加顶部内边距 3.5rem (56px)，正好避开 Fixed Navbar
    // 3. overflow-hidden: 保证没有滚动条
    <main className="h-screen pt-14 bg-black overflow-hidden relative">

      {/* 背景层：fixed inset-0 会忽略父级 padding，完美铺满全屏背景 */}
      <div className="fixed inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Desktop View */}
      {/* h-full 现在指的是 (100vh - 3.5rem)，即 Navbar 下方的剩余空间 */}
      <div className="hidden md:flex items-center justify-center h-full relative z-10">
        <TerminalHero />
      </div>

      {/* Mobile View */}
      <div className="block md:hidden relative z-10 h-full w-full">
        <MobileLandingHero onOpenTerminal={() => setIsMobileChatOpen(true)} />

        <MobileMessenger
          isOpen={isMobileChatOpen}
          onClose={() => setIsMobileChatOpen(false)}
        />
      </div>
    </main>
  );
}