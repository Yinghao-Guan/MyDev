"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTerminalSystem } from "@/hooks/useTerminalSystem";
import { Send, Terminal, Cpu, Wifi, User, Sparkles, ChevronDown } from "lucide-react";
import MemoizedMarkdown from "@/components/ui/MemoizedMarkdown";
import MatrixRain from "@/components/features/MatrixRain";

const QUICK_ACTIONS = [
  { label: "My Projects", cmd: "ls" },
  { label: "About Me", cmd: "whoami" },
  { label: "Ask AI", cmd: "help" },
  { label: "Matrix Mode", cmd: "cmatrix" },
];

interface MobileMessengerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMessenger({ isOpen, onClose }: MobileMessengerProps) {
  // [修改 1]: 将 isOpen 传入 hook，控制启动时机
  const {
    history,
    processCommand,
    isLoading,
    isBooting,
    showMatrix,
    setShowMatrix
  } = useTerminalSystem(isOpen);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [history, isLoading, isBooting, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    processCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[999] flex flex-col h-[100dvh] bg-black text-green-500 font-mono text-sm overflow-hidden"
        >

          {/* --- [A. 全屏特效层 (Matrix)] --- */}
          {/* [修改 2 - 关键修复]:
             我们不再使用多层 absolute 嵌套，而是简化结构。
             1. 最外层 motion.div 负责淡入淡出。
             2. 内部直接放 MatrixRain (假设它内部有 canvas)。
             3. 强制背景色为黑色 (bg-black)，防止透视。
          */}
          <AnimatePresence>
            {showMatrix && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                // z-[200] 确保盖住所有内容
                // bg-black 确保如果不显示 Rain 时也是黑的，但通常 Canvas 就在这里
                className="absolute inset-0 z-[200] bg-black flex items-center justify-center cursor-pointer"
                onClick={() => setShowMatrix(false)}
              >
                 {/* 强制 MatrixRain 容器撑满，并给予极高层级 */}
                 <div className="w-full h-full relative z-[201]">
                    <MatrixRain onExit={() => setShowMatrix(false)} />
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- [B. Header] --- */}
          <div className="shrink-0 p-3 border-b border-gray-800 bg-gray-900/80 backdrop-blur flex justify-between items-center z-10">
            {/* Header 内容保持不变 */}
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"}`}></div>
                <span className="font-bold tracking-wider text-xs">UPLINK_SECURE</span>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex gap-2 text-gray-600">
                    <Cpu size={14} />
                    <Wifi size={14} />
                </div>
                <button
                  onClick={onClose}
                  className="ml-2 bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white p-1.5 rounded-md transition-colors"
                >
                  <ChevronDown size={18} />
                </button>
            </div>
          </div>

          {/* --- [C. Chat Area] --- */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 scroll-smooth">
             {/* 聊天记录渲染逻辑保持不变 */}
            {isBooting && (
               <div className="text-xs text-gray-600 mb-4 space-y-1 font-mono border-l-2 border-gray-800 pl-2">
                  <div>&gt; Initializing mobile protocol...</div>
                  <div>&gt; Connection established.</div>
               </div>
            )}

            {history.map((msg, idx) => {
                const isUser = msg.role === "user";
                const isSystem = msg.role === "system";
                return (
                  <div key={idx} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1 mb-1 text-[10px] uppercase tracking-widest text-gray-500">
                              {isUser ? <><span>Visitor</span><User size={10}/></> : <>{isSystem ? <Terminal size={10}/> : <Sparkles size={10}/>}<span>{isSystem ? "System" : "AI_Core"}</span></>}
                          </div>
                          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm break-words relative transition-all duration-300
                              ${isUser 
                                  ? 'bg-green-900/20 border border-green-500/30 text-green-100 rounded-tr-sm' 
                                  : 'bg-gray-900 border border-gray-800 text-gray-300 rounded-tl-sm'
                              }
                          `}>
                              {msg.role === "assistant" ? (
                                  <div className="prose prose-invert prose-sm max-w-none">
                                      <MemoizedMarkdown content={msg.content} />
                                  </div>
                              ) : (
                                  <div className="whitespace-pre-wrap font-mono">{msg.content}</div>
                              )}
                          </div>
                      </div>
                  </div>
                );
            })}

            {isLoading && (
                <div className="flex justify-start w-full">
                   <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-800">
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></span>
                   </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* --- [D. Input Area] --- */}
          <div className="shrink-0 bg-black border-t border-gray-800 pb-[env(safe-area-inset-bottom)] z-20">
             {/* Input 区域逻辑保持不变 */}
            <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar mask-linear-fade">
              {QUICK_ACTIONS.map(action => (
                <button
                  key={action.cmd}
                  onClick={() => processCommand(action.cmd)}
                  className="flex-shrink-0 px-3 py-1.5 text-xs bg-gray-900 border border-green-900/50 text-green-400 rounded-full hover:bg-green-900/20 active:bg-green-500 active:text-black transition-all font-mono whitespace-nowrap"
                >
                  {`> ${action.label}`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 px-4 pb-4">
              <div className="flex-1 relative group">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-gray-900/80 border border-gray-700 rounded-xl pl-4 pr-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all font-sans"
                  placeholder="Message Peter's AI..."
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-xl transition-all duration-200 ${input.trim() && !isLoading ? "bg-green-600 text-black active:scale-95" : "bg-gray-800 text-gray-500"}`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}