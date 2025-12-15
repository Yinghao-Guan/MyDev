// frontend/src/app/about/page.tsx
import React from "react";
import { Terminal, Cpu, Shield, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    // [修复 Logic]:
    // 1. h-screen: 强制全屏
    // 2. pt-14: 避让顶部导航
    // 3. overflow-hidden: 避免出现双滚动条（内容区若溢出由卡片内部控制，或者保持卡片居中不滚动）
    <div className="h-screen pt-14 bg-[#0d0d0d] text-gray-300 font-mono p-8 flex items-center justify-center overflow-hidden">
      <div className="max-w-2xl w-full border border-gray-800 bg-[#050505] rounded-lg shadow-2xl overflow-hidden relative">

        {/* Header */}
        <div className="bg-gray-900/50 border-b border-gray-800 p-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            user_profile.json
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">

          {/* Section 1: Identity */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-900/20 rounded border border-blue-900/50">
               <Terminal className="text-blue-400" size={24} />
            </div>
            <div>
               <h2 className="text-xl font-bold text-white mb-1">Peter Guan</h2>
               <p className="text-blue-400 text-sm mb-2">@FullStack_Quant</p>
               <p className="text-sm text-gray-400 leading-relaxed">
                 Developer bridging the gap between high-performance tech and quantitative finance.
                 Building hardcore tools with modern aesthetics.
               </p>
            </div>
          </div>

          <div className="h-px bg-gray-800 w-full" />

          {/* Section 2: Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center">
                  <Cpu size={14} className="mr-2"/> Core Stack
                </h3>
                <ul className="space-y-2 text-sm">
                   <li className="flex justify-between"><span className="text-gray-400">Lang</span> <span className="text-green-400">Python, TypeScript, C++</span></li>
                   <li className="flex justify-between"><span className="text-gray-400">Framework</span> <span className="text-green-400">FastAPI, Next.js 15</span></li>
                   <li className="flex justify-between"><span className="text-gray-400">AI</span> <span className="text-green-400">LangChain, PyTorch</span></li>
                </ul>
             </div>
             <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center">
                  <Globe size={14} className="mr-2"/> Location
                </h3>
                <div className="text-sm text-gray-300">
                   Santa Monica, CA<br/>
                   <span className="text-xs text-gray-500 mt-1 block">Lat: 34.0195° N, Lon: 118.4912° W</span>
                </div>
             </div>
          </div>

          <div className="h-px bg-gray-800 w-full" />

          {/* Section 3: Call to Action */}
          <div className="bg-gray-900/30 p-4 rounded border border-gray-800 text-sm flex justify-between items-center">
             <span className="text-gray-400">Want to see the main portfolio?</span>
             <a
               href="https://peterguan.com"
               target="_blank"
               className="text-green-400 hover:underline hover:text-green-300 transition-colors flex items-center"
             >
               Access Mainframe <Shield size={12} className="ml-2"/>
             </a>
          </div>

        </div>
      </div>
    </div>
  );
}