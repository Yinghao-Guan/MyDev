"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Wifi } from "lucide-react";

// 定义消息类型
type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export default function TerminalHero() {
  // 状态管理
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isBooting, setIsBooting] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // 是否正在处理/接收流

  // 自动滚动到底部的引用
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始启动日志
  const bootSequence = [
    "> Initializing secure connection...",
    "> Loading user profile: Peter Guan",
    "> Stack: Next.js 15 / FastAPI / Python / Ollama",
    "> Access granted.",
    "> Welcome to myname.dev"
  ];

  // 1. 处理启动动画
  // 使用 useRef 来标记是否已经运行过
  const hasBooted = useRef(false);

  useEffect(() => {
    // 如果已经运行过，直接跳过
    if (hasBooted.current) return;
    hasBooted.current = true;

    let delay = 0;
    bootSequence.forEach((line, index) => {
      delay += 500;
      setTimeout(() => {
        setHistory((prev) => [...prev, { role: "system", content: line }]);
        if (index === bootSequence.length - 1) {
          setIsBooting(false);
        }
      }, delay);
    });
  }, []); // 依赖项保持为空数组

  // 2. 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isBooting, isLoading]);

  // 3. 聚焦处理
  const handleFocus = () => {
    if (!isBooting && !isLoading) {
      inputRef.current?.focus();
    }
  };

  // 4. 提交逻辑 (修复了重复字符问题)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();

    // 添加用户消息
    setHistory((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!res.ok) throw new Error("Network response was not ok");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // 先占位：添加一个空的 assistant 消息
      setHistory((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // 【关键修复】：使用不可变数据写法，防止 Strict Mode 下的双重渲染导致字符重复
        setHistory((prev) => {
          const newHistory = [...prev]; // 浅拷贝数组
          const lastIndex = newHistory.length - 1;
          const lastMsg = newHistory[lastIndex];

          // 确保我们要更新的是最后一条且是 AI 的消息
          if (lastMsg.role === "assistant") {
            // 创建一个新的消息对象，而不是修改旧的 (Immutable)
            newHistory[lastIndex] = {
              ...lastMsg,
              content: lastMsg.content + chunk
            };
          }
          return newHistory;
        });
      }

    } catch (error) {
      setHistory((prev) => [
        ...prev,
        { role: "system", content: "Error: Connection interrupted. Backend offline." }
      ]);
    } finally {
      setIsLoading(false); // 只有完全结束后，输入框才会再次出现
      // 稍微延迟一下聚焦，体验更好
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 font-mono">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/90 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col min-h-[400px]"
        onClick={handleFocus}
      >
        {/* Title Bar */}
        <div className="bg-gray-900/80 px-4 py-3 flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center text-gray-500 text-xs select-none space-x-4">
             <div className="flex items-center"><Terminal size={12} className="mr-1"/> bash — interactive</div>
             <div className="flex items-center"><Cpu size={12} className="mr-1"/> M4 Pro</div>
          </div>
          <div className="w-10 flex justify-end">
             {/* Wifi 图标在加载时闪烁 */}
             <Wifi size={14} className={isLoading ? "text-yellow-500 animate-pulse" : "text-green-600"} />
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-6 text-sm md:text-base leading-relaxed flex-1 overflow-y-auto max-h-[60vh] no-scrollbar" onClick={handleFocus}>
          {history.map((msg, idx) => (
            <div key={idx} className="mb-2 break-words">
              {msg.role === "system" && (
                <span className="text-gray-500">{msg.content}</span>
              )}
              {msg.role === "user" && (
                <div>
                   <span className="text-blue-400">visitor@myname.dev</span>:<span className="text-blue-300">~</span>$ <span className="text-white ml-2">{msg.content}</span>
                </div>
              )}
              {msg.role === "assistant" && (
                <div className="text-green-400 whitespace-pre-wrap">
                  {/* 这里为了视觉效果，AI回复不带 prompt，直接显示内容 */}
                  {msg.content}
                  {/* 如果这是最后一条消息且正在加载，显示一个光标跟随在文字后面 */}
                  {isLoading && idx === history.length - 1 && (
                    <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse align-middle"/>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Input Area: 只有在启动完成 且 不在加载时 才显示 */}
          {!isBooting && !isLoading && (
            <form onSubmit={handleSubmit} className="flex items-center mt-2">
              <span className="text-blue-400 mr-2 shrink-0">visitor@myname.dev:~$</span>
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