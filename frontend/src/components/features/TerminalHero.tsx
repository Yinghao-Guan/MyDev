"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Wifi } from "lucide-react";
import { useRouter } from "next/navigation";
import MemoizedMarkdown from "@/components/ui/MemoizedMarkdown";
import MatrixRain from "@/components/features/MatrixRain";

// --- [工具函数] Cowsay 逻辑 (放在组件外部) ---
const generateCowsay = (text: string) => {
  const len = text.length;
  const line = "-".repeat(len + 2);

  return `
 ${line}
< ${text} >
 ${line}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
  `;
};

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
  const [isLoading, setIsLoading] = useState(false);
  // 新增：控制黑客帝国特效显示
  const [showMatrix, setShowMatrix] = useState(false);

  // 引用
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始启动日志
  const bootSequence = [
    "> Initializing secure connection...",
    "> Loading user profile: Peter Guan",
    "> Stack: Next.js 15 / FastAPI / Python / Ollama",
    "> Access granted.",
    "> Welcome to peterguan.dev"
  ];

  // 1. 处理启动动画
  const hasBooted = useRef(false);

  useEffect(() => {
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
  }, []);

  // 2. 自动滚动
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isBooting, isLoading]);

  // 3. 聚焦处理
  const handleFocus = () => {
    if (!isBooting && !isLoading && !showMatrix) {
      inputRef.current?.focus();
    }
  };

  // 4. 提交逻辑
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const rawInput = input;
    const args = input.trim().split(" ");
    const mainCommand = args[0].toLowerCase();

    // --- [命令拦截器 Start] ---

    // 1. Clear (清屏)
    if (mainCommand === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    // 2. Help (帮助) - 已更新列表
    if (mainCommand === "help") {
      setHistory((prev) => [...prev, { role: "user", content: rawInput }]);
      const helpMessage = `
GNU bash, version 5.2.15(1)-release (peterguan-dev-os)
These shell commands are defined internally. Type 'help' to see this list.

  help     Display this help text
  clear    Clear the terminal screen
  ls       List directory contents (projects & pages)
  cd       Change directory (navigate to pages)
  cmatrix  Run Matrix screensaver (Press any key to exit)
  cowsay   Make the cow say something
  <text>   Send prompt to AI Assistant (LLM)
      `;
      setHistory((prev) => [...prev, { role: "system", content: helpMessage.trim() }]);
      setInput("");
      return;
    }

    // 3. Cmatrix (黑客帝国特效)
    if (mainCommand === "cmatrix") {
      setInput("");
      setShowMatrix(true);
      return;
    }

    // 4. Cowsay (会说话的牛)
    if (mainCommand === "cowsay") {
      setHistory((prev) => [...prev, { role: "user", content: rawInput }]);
      // 获取用户输入的内容，如果没有则使用默认文本
      const message = args.length > 1 ? args.slice(1).join(" ") : "Moo! I love Peter.";
      const cowOutput = generateCowsay(message);

      setHistory((prev) => [...prev, { role: "system", content: cowOutput }]);
      setInput("");
      return;
    }

    // 5. Sudo (彩蛋)
    if (mainCommand === "sudo") {
      setHistory((prev) => [...prev, { role: "user", content: rawInput }]);
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { role: "system", content: "Permission denied: You are not Peter Guan." }
        ]);
      }, 200);
      setInput("");
      return;
    }

    // 6. 受限命令
    const restrictedCommands = ["mkdir", "touch", "rm", "rmdir", "cp", "mv", "chmod", "chown", "ifconfig", "ping", "nano", "vim", "vi"];
    if (restrictedCommands.includes(mainCommand)) {
      setHistory((prev) => [...prev, { role: "user", content: rawInput }]);
      setHistory((prev) => [
        ...prev,
        { role: "system", content: `bash: ${mainCommand}: permission denied` }
      ]);
      setInput("");
      return;
    }

    // 7. ls
    if (mainCommand === "ls") {
      setHistory((prev) => [...prev, { role: "user", content: rawInput }]);
      const treeOutput = `
.
├── about/
└── projects/
    ├── Veru
    ├── MyMD
    ├── Emotional_Support_Agent
    └── peterguan.dev
      `;
      setHistory((prev) => [...prev, { role: "system", content: treeOutput.trim() }]);
      setInput("");
      return;
    }

    // 8. cd
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
        setHistory((prev) => [...prev, { role: "system", content: `bash: cd: ${target}: No such file or directory` }]);
        setInput("");
        return;
      }
    }

    // --- [命令拦截器 End] ---

    // Case 9: 普通对话 (流式 AI)
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
      {/* 1. 如果 showMatrix 为真，渲染全屏特效 */}
      {showMatrix && <MatrixRain onExit={() => setShowMatrix(false)} />}

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
             <Wifi size={14} className={isLoading ? "text-yellow-500 animate-pulse" : "text-green-600"} />
          </div>
        </div>

        {/* Terminal Content */}
        <div
          className="p-6 text-sm md:text-base leading-relaxed flex-1 overflow-y-auto max-h-[60vh] no-scrollbar font-mono"
          onClick={handleFocus}
          // 强制样式：
          // 1. consolas, monaco: 经典的程序员字体
          // 2. tabular-nums: 强制数字等宽
          style={{
            fontFamily: '"JetBrains Mono", "Fira Code", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {history.map((msg, idx) => (
            <div key={idx} className="mb-2 break-words">
              {msg.role === "system" && (
                <div className="text-gray-500 whitespace-pre-wrap break-all font-mono text-sm leading-snug">
                  {msg.content}
                </div>
              )}
              {msg.role === "user" && (
                <div>
                   <span className="text-blue-400">visitor@peterguan.dev</span>:<span className="text-blue-300">~</span>$ <span className="text-white ml-2">{msg.content}</span>
                </div>
              )}
              {msg.role === "assistant" && (
                <div className="text-green-400 leading-relaxed">
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
            <form onSubmit={handleSubmit} className="flex items-center mt-2">
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