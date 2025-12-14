"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal, Code, Cpu } from "lucide-react";

interface MobileLandingHeroProps {
  onOpenTerminal: () => void;
}

export default function MobileLandingHero({ onOpenTerminal }: MobileLandingHeroProps) {
  return (
    // [修改点]: h-[100dvh] + overflow-hidden 确保单页不滚动
    // pt-20 是为了给顶部的 Navbar 留出视觉空间
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-transparent relative z-10 pt-20 pb-safe">

      {/* 中间主要内容区：使用 flex-1 占据剩余所有空间，并居中 */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 text-center">

        {/* 1. 名字与头衔 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-3 mb-8" // 减小一点间距防止小屏手机挤
        >
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Peter Guan
          </h1>
          <div className="flex items-center justify-center gap-2 text-green-400 font-mono text-sm bg-green-900/20 px-4 py-1.5 rounded-full border border-green-800/50 mx-auto w-fit">
            <Terminal size={14} />
            <span>Full Stack Quant</span>
          </div>
          <p className="text-gray-400 max-w-xs mx-auto leading-relaxed text-sm">
            Building high-frequency systems & exploring HCI boundaries.
          </p>
        </motion.div>

        {/* 2. 核心数据/标签 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-2 gap-3 w-full max-w-[280px]"
        >
          <div className="p-3 bg-gray-900/50 border border-gray-800 rounded-xl backdrop-blur-sm">
             <Cpu className="text-blue-400 mb-2 mx-auto" size={20} />
             <div className="text-[10px] text-gray-500 uppercase tracking-wider">Focus</div>
             <div className="text-white font-mono font-bold text-sm">FinTech</div>
          </div>
          <div className="p-3 bg-gray-900/50 border border-gray-800 rounded-xl backdrop-blur-sm">
             <Code className="text-purple-400 mb-2 mx-auto" size={20} />
             <div className="text-[10px] text-gray-500 uppercase tracking-wider">Stack</div>
             <div className="text-white font-mono font-bold text-sm">Python/TS</div>
          </div>
        </motion.div>

        {/* 3. 呼叫 AI 的主按钮 */}
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          onClick={onOpenTerminal}
          className="mt-10 group relative inline-flex items-center gap-3 px-8 py-3 bg-green-600 text-black font-bold rounded-full overflow-hidden transition-transform active:scale-95 shadow-[0_0_20px_rgba(22,163,74,0.4)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Terminal size={18} />
            <span>Connect via Terminal</span>
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </motion.button>
      </div>

      {/* 4. 底部 System Status：固定在容器底部，不需滚动 */}
      <div className="shrink-0 py-6 text-center">
        <div className="text-[10px] text-gray-600 font-mono">
          System Status: <span className="text-green-500 animate-pulse">ONLINE</span>
        </div>
      </div>

    </div>
  );
}