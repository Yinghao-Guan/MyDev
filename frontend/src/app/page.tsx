"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import TerminalHero from "@/components/features/TerminalHero";
import MobileLandingHero from "@/components/features/MobileLandingHero";


const ParticleBackground = dynamic(
  () => import("@/components/layout/ParticleBackground"),
  {
    ssr: false, // 3D 背景不需要服务器端渲染
    loading: () => <div className="absolute inset-0 bg-[#050505] -z-10" /> // 加载时显示纯黑背景占位，防止闪烁
  }
);

const MobileMessenger = dynamic(
  () => import("@/components/features/MobileMessenger"),
  { ssr: false }
);

export default function Home() {
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  return (
    // [修改 1]: 将 min-h-screen 改为 h-[calc(100vh-3.5rem)]
    // 解释: 100vh (视口) - 3.5rem (Layout中的 pt-14) = 完美填满剩余空间，无滚动
    <main className="h-[calc(100vh-3.5rem)] bg-black overflow-hidden relative">
      <div className="fixed inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Desktop View */}
      {/* [修改 2]: 将 min-h-screen 改为 h-full，跟随父容器高度 */}
      <div className="hidden md:flex items-center justify-center h-full relative z-10">
        <TerminalHero />
      </div>

      {/* Mobile View */}
      {/* [修改 3]: 将 h-[100dvh] 改为 h-full */}
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