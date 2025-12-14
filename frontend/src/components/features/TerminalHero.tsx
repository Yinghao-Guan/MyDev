"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Wifi } from "lucide-react";
import MemoizedMarkdown from "@/components/ui/MemoizedMarkdown";
import MatrixRain from "@/components/features/MatrixRain";
import { useTerminalSystem } from "@/hooks/useTerminalSystem"; // 引入大脑

export default function TerminalHero() {
  // 使用我们刚写的 Hook
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

  // 自动滚动
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isBooting, isLoading]);

  // 聚焦输入框
  const handleFocus = () => {
    if (!isBooting && !isLoading && !showMatrix) {
      inputRef.current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // 调用 Hook 里的逻辑
    await processCommand(input);
    setInput("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 font-mono">
      {showMatrix && <MatrixRain onExit={() => setShowMatrix(false)} />}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/90 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col min-h-[500px] h-[60vh]" // 增加了高度
        onClick={handleFocus}
      >
        {/* Title Bar - 保持原样 */}
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
                <div className="text-gray-500 whitespace-pre-wrap break-all">{msg.content}</div>
              )}
              {msg.role === "user" && (
                <div>
                   <span className="text-blue-400">visitor@peterguan.dev</span>:<span className="text-blue-300">~</span>$ <span className="text-white ml-2">{msg.content}</span>
                </div>
              )}
              {msg.role === "assistant" && (
                <div className="text-green-400 leading-relaxed mt-1">
                  <MemoizedMarkdown content={msg.content} />
                  {isLoading && idx === history.length - 1 && (
                    <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse align-middle"/>
                  )}
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