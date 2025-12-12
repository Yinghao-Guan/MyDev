"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Wifi } from "lucide-react";
import { useRouter } from "next/navigation";

// 定义消息类型
type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export default function TerminalHero() {
  const router = useRouter();
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

  // 4. 提交逻辑
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const rawInput = input;
    const command = input.trim().toLowerCase(); // 转小写
    const args = input.trim().split(" "); // 分割参数，例如 ["cd", "projects"]
    // ... 前面的代码不变 ...
    const mainCommand = args[0].toLowerCase();

    // --- [核心修改] 增强版命令拦截器 ---

    // 1. Clear (清屏)
    if (mainCommand === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    // 2. Help (帮助)
    if (mainCommand === "help") {
      setHistory((prev) => [...prev, { role: "user", content: rawInput }]);
      const helpMessage = `
GNU bash, version 5.2.15(1)-release (myname-dev-os)
These shell commands are defined internally. Type 'help' to see this list.

  help     Display this help text
  clear    Clear the terminal screen
  ls       List directory contents (projects & pages)
  cd       Change directory (navigate to pages)
  <text>   Send prompt to AI Assistant (LLM)
      `;
      setHistory((prev) => [...prev, { role: "system", content: helpMessage.trim() }]);
      setInput("");
      return;
    }

    // 3. Sudo (彩蛋：权限拒绝)
    if (mainCommand === "sudo") {
      setHistory((prev) => [...prev, { role: "user", content: rawInput }]);
      // 模拟短暂的停顿，像是在校验权限
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { role: "system", content: "Permission denied: You are not Peter Guan." }
        ]);
      }, 200);
      setInput("");
      return;
    }

    // 4. 受限命令 (模拟没有写权限)
    const restrictedCommands = ["mkdir", "touch", "rm", "rmdir", "cp", "mv", "chmod", "chown", "ifconfig", "ping", "nano", "vim", "vi"];
    if (restrictedCommands.includes(mainCommand)) {
      setHistory((prev) => [...prev, { role: "user", content: rawInput }]);
      // 模仿 Linux 标准权限报错
      setHistory((prev) => [
        ...prev,
        { role: "system", content: `bash: ${mainCommand}: permission denied` }
      ]);
      setInput("");
      return;
    }

    // 5. ls (列出目录)
    if (mainCommand === "ls") {
      setHistory((prev) => [...prev, { role: "user", content: rawInput }]);
      const treeOutput = `
.
├── about/
└── projects/
    ├── Veru
    ├── MyMD
    ├── Emotional_Support_Agent
    └── myname.dev
      `;
      setHistory((prev) => [...prev, { role: "system", content: treeOutput.trim() }]);
      setInput("");
      return;
    }

    // 6. cd (跳转页面)
    if (mainCommand === "cd") {
      setHistory((prev) => [...prev, { role: "user", content: rawInput }]);
      const target = args[1] ? args[1].toLowerCase() : "~";

      if (target === "projects" || target === "projects/" || target === "./projects") {
        setHistory((prev) => [...prev, { role: "system", content: "Navigating to ~/projects..." }]);
        setTimeout(() => router.push("/projects"), 500);
        return;
      }
      else if (target === "about" || target === "about/") {
        setHistory((prev) => [...prev, { role: "system", content: "Navigating to ~/about..." }]);
        setTimeout(() => router.push("/about"), 500);
        return;
      }
      else if (target === ".." || target === "~" || target === "/") {
         setHistory((prev) => [...prev, { role: "system", content: "Directory is already root." }]);
         setInput("");
         return;
      }
      else {
        // 保持 GNU Bash 风格报错
        setHistory((prev) => [...prev, { role: "system", content: `bash: cd: ${target}: No such file or directory` }]);
        setInput("");
        return;
      }
    }

    // --- 命令拦截器结束 ---

    // Case 5: 普通对话 (流式 AI)
    // ... (保持原来的 fetch 逻辑不变，直接粘贴之前的代码即可) ...
    // 为了节省篇幅，这里我简写了，请保留你原来的 fetch 逻辑
    setHistory((prev) => [...prev, { role: "user", content: rawInput }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: rawInput }),
      });

      if (!res.ok) throw new Error("Network response was not ok");
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      setHistory((prev) => [...prev, { role: "assistant", content: "" }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setHistory((prev) => {
          const newHistory = [...prev];
          const lastIndex = newHistory.length - 1;
          const lastMsg = newHistory[lastIndex];
          if (lastMsg.role === "assistant") {
            newHistory[lastIndex] = { ...lastMsg, content: lastMsg.content + chunk };
          }
          return newHistory;
        });
      }
    } catch (error) {
      setHistory((prev) => [...prev, { role: "system", content: "Error: Backend offline." }]);
    } finally {
      setIsLoading(false);
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
                <div className="text-gray-500 whitespace-pre-wrap font-mono text-sm">{msg.content}</div>
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