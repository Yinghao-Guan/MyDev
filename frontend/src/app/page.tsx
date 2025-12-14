"use client";

import { useState } from "react";
import dynamic from "next/dynamic"; // 1. 引入 dynamic
import TerminalHero from "@/components/features/TerminalHero";
import MobileLandingHero from "@/components/features/MobileLandingHero";
import ParticleBackground from "@/components/layout/ParticleBackground";

// 2. 动态导入 MobileMessenger，并关闭 SSR
const MobileMessenger = dynamic(
  () => import("@/components/features/MobileMessenger"),
  { ssr: false } // 这就是魔法：彻底消除 Hydration Mismatch 和 setMounted 报错
);

export default function Home() {
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black overflow-hidden relative">
      <div className="fixed inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-center min-h-screen relative z-10">
        <TerminalHero />
      </div>

      {/* Mobile View */}
      <div className="block md:hidden relative z-10 h-[100dvh] w-full">
        <MobileLandingHero onOpenTerminal={() => setIsMobileChatOpen(true)} />

        {/* 这里直接使用动态加载的组件 */}
        <MobileMessenger
          isOpen={isMobileChatOpen}
          onClose={() => setIsMobileChatOpen(false)}
        />
      </div>
    </main>
  );
}