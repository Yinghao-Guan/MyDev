"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Wifi, Command } from "lucide-react";
import MemoizedMarkdown from "@/components/ui/MemoizedMarkdown";
import MatrixRain from "@/components/features/MatrixRain";
import { useTerminalSystem } from "@/hooks/useTerminalSystem";

// [修改 1]: 仅保留 Desktop 需要的快捷指令
const QUICK_COMMANDS = [
  { cmd: "help", desc: "Manual" },
  { cmd: "whoami", desc: "Profile"},
  { cmd: "ls", desc: "Directory" },
];

export default function TerminalHero() {
  const {
    history,
    processCommand,
    isLoading,
    isBooting,
    showMatrix,
    setShowMatrix
  } = useTerminalSystem();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isBooting, isLoading]);

  const handleFocus = () => {
    if (!isBooting && !isLoading && !showMatrix) {
      inputRef.current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await processCommand(input);
    setInput("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 font-mono">
      {showMatrix && <MatrixRain onExit={() => setShowMatrix(false)} />}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/90 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col min-h-[500px] h-[60vh]"
        onClick={handleFocus}
      >
        {/* Title Bar */}
        <div className="bg-gray-900/80 px-4 py-3 flex items-center justify-between border-b border-gray-800 shrink-0 select-none">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center text-gray-500 text-xs space-x-4">
             <div className="flex items-center"><Terminal size={12} className="mr-1"/> bash — interactive</div>
             <div className="flex items-center"><Cpu size={12} className="mr-1"/> Neural Core</div>
          </div>
          <div className="w-10 flex justify-end">
             <Wifi size={14} className={isLoading ? "text-yellow-500 animate-pulse" : "text-green-600"} />
          </div>
        </div>

        {/* Terminal Content */}
        <div
          className="p-6 text-sm md:text-base leading-relaxed flex-1 overflow-y-auto no-scrollbar font-mono"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {history.map((msg, idx) => (
            <div key={idx} className="mb-2 break-words">
              {msg.role === "system" && (
                // [修改 2]: 精确控制颜色。isLogo ? 绿色 : 灰色。
                // 彻底修复 cowsay 被误判为绿色的问题。
                <div className={`${msg.isLogo ? "text-green-500 font-bold leading-none tracking-tighter" : "text-gray-500"} whitespace-pre-wrap break-all`}>
                  {msg.content}
                </div>
              )}
              {msg.role === "user" && (
                <div>
                   <span className="text-blue-400">visitor@peterguan.dev</span>:<span className="text-blue-300">~</span>$ <span className="text-white ml-2">{msg.content}</span>
                </div>
              )}
              {msg.role === "assistant" && (
                // [修改 3]: LLM 输出改回 text-gray-300 (亮灰/白)，不再是绿色
                <div className="text-gray-300 leading-relaxed mt-1">
                  <MemoizedMarkdown content={msg.content} />
                  {isLoading && idx === history.length - 1 && (
                    <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse align-middle"/>
                  )}
                </div>
              )}

              {/* [修改 4]: 渲染 Navigation 按钮流 */}
              {msg.role === "navigation" && (
                <div className="my-3 flex gap-3 opacity-90 animate-in fade-in duration-300">
                  <div className="flex items-center text-gray-600 text-xs mr-2 select-none">
                    <Command size={12} className="mr-1" /> Available Actions:
                  </div>
                  {QUICK_COMMANDS.map((action) => (
                    <button
                      key={action.cmd}
                      onClick={(e) => {
                        e.stopPropagation();
                        processCommand(action.cmd);
                      }}
                      className="text-xs font-mono text-green-400/90 border border-green-900/40 bg-green-900/10 px-3 py-1.5 rounded hover:bg-green-900/30 hover:border-green-500/50 hover:text-green-300 transition-all text-left flex items-center group cursor-pointer"
                    >
                      <span className="font-bold mr-2 group-hover:underline">[{action.cmd}]</span>
                      <span className="text-gray-500 group-hover:text-gray-400"> // {action.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Input Area */}
          {!isBooting && !isLoading && (
            <form onSubmit={handleSubmit} className="flex items-center mt-2 group">
              <span className="text-blue-400 mr-2 shrink-0">visitor@peterguan.dev:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full font-mono caret-green-500 ml-1"
                autoFocus
                autoComplete="off"
              />
            </form>
          )}

          <div ref={messagesEndRef} />
        </div>
      </motion.div>
    </div>
  );
}