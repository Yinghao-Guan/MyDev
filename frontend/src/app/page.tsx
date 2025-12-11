import TerminalHero from "@/components/features/TerminalHero";
// 1. 引入新的粒子组件
import ParticleBackground from "@/components/layout/ParticleBackground";

export default function Home() {
  return (
    <main className="h-[calc(100vh-3.5rem)] w-full bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">

      {/* 2. 使用粒子背景 */}
      <ParticleBackground />

      {/* 3. 内容区域 (保持不变) */}
      <div className="z-10 w-full px-4 max-w-4xl pointer-events-none">
         <div className="pointer-events-auto">
            <TerminalHero />
         </div>

         <div className="mt-8 text-center select-none">
            {/* 文字稍微改一下，配合星空主题 */}
            <p className="text-gray-500/50 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">
               [ Neural Cloud: Connected ] • [ Nodes: 5000+ ]
            </p>
         </div>
      </div>
    </main>
  );
}