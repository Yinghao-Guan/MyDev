import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

// --- [Type Definitions] ---
export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

// --- [Helper] Cowsay Logic (纯函数，移到 hook 外部) ---
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

export const useTerminalSystem = (isConnectionOpen = true) => {
  const router = useRouter();

  const [history, setHistory] = useState<Message[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  const hasBooted = useRef(false);

  useEffect(() => {
    // 如果连接没打开，或者已经启动过，就什么都不做
    if (!isConnectionOpen || hasBooted.current) return;

    hasBooted.current = true; // 标记为已启动

    const bootSequence = [
      "> Initializing secure connection...",
      "> Loading user profile: Peter Guan",
      "> Stack: Next.js 15 / FastAPI / Python / Ollama",
      "> Access granted.",
      "> Welcome to peterguan.dev"
    ];

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
  }, [isConnectionOpen]);

  // --- [Core: Command Processor] ---
  // 这是 Hook 的核心，UI 组件只需要把用户输入的字符串传进来即可
  const processCommand = useCallback(async (inputRaw: string) => {
    const input = inputRaw.trim();
    if (!input || isLoading) return;

    const args = input.split(" ");
    const mainCommand = args[0].toLowerCase();

    // --- 1. Local Commands Handling ---

    // [Clear]
    if (mainCommand === "clear") {
      setHistory([]);
      return;
    }

    // [Cmatrix]
    if (mainCommand === "cmatrix") {
      setShowMatrix(true);
      return;
    }

    // [Help]
    if (mainCommand === "help") {
      setHistory((prev) => [...prev, { role: "user", content: input }]);
      const helpMessage = `
GNU bash, version 5.2.15(1)-release (peterguan-dev-os)
These shell commands are defined internally. Type 'help' to see this list.

  help     Display this help text
  clear    Clear the terminal screen
  ls       List directory contents (projects & pages)
  cd       Change directory (navigate to pages)
  cmatrix  Run Matrix screensaver
  cowsay   Make the cow say something
  <text>   Send prompt to AI Assistant (LLM)
      `;
      setHistory((prev) => [...prev, { role: "system", content: helpMessage.trim() }]);
      return;
    }

    // [Cowsay]
    if (mainCommand === "cowsay") {
      setHistory((prev) => [...prev, { role: "user", content: input }]);
      const message = args.length > 1 ? args.slice(1).join(" ") : "Moo! I love Peter.";
      setHistory((prev) => [...prev, { role: "system", content: generateCowsay(message) }]);
      return;
    }

    // [Restricted]
    const restrictedCommands = ["mkdir", "touch", "rm", "rmdir", "cp", "mv", "chmod", "chown", "sudo", "nano", "vim"];
    if (restrictedCommands.includes(mainCommand)) {
      setHistory((prev) => [...prev, { role: "user", content: input }]);
      const msg = mainCommand === "sudo"
        ? "Permission denied: You are not Peter Guan."
        : `bash: ${mainCommand}: permission denied`;

      // 模拟一点延迟，增加真实感
      setTimeout(() => {
          setHistory((prev) => [...prev, { role: "system", content: msg }]);
      }, 200);
      return;
    }

    // [LS]
    if (mainCommand === "ls") {
      setHistory((prev) => [...prev, { role: "user", content: input }]);
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
      return;
    }

    // [CD]
    if (mainCommand === "cd") {
      setHistory((prev) => [...prev, { role: "user", content: input }]);
      const target = args[1] ? args[1].toLowerCase() : "~";

      if (["projects", "projects/", "./projects"].includes(target)) {
        setHistory((prev) => [...prev, { role: "system", content: "Navigating to ~/projects..." }]);
        setTimeout(() => router.push("/projects"), 500);
      } else if (["about", "about/"].includes(target)) {
        setHistory((prev) => [...prev, { role: "system", content: "Navigating to ~/about..." }]);
        setTimeout(() => router.push("/about"), 500); // 假设你有 about 页面，或者你可以改成跳去 .com
      } else if (["..", "~", "/"].includes(target)) {
         setHistory((prev) => [...prev, { role: "system", content: "Directory is already root." }]);
      } else {
        setHistory((prev) => [...prev, { role: "system", content: `bash: cd: ${target}: No such file or directory` }]);
      }
      return;
    }

    // --- 2. AI Processing (LLM) ---

    // 记录用户输入
    setHistory((prev) => [...prev, { role: "user", content: input }]);
    setIsLoading(true);

    try {
      // 这里的 URL 建议最好放到 .env 环境变量里，例如 process.env.NEXT_PUBLIC_API_URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const res = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error("Network response was not ok");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // 先添加一个空的 assistant 消息占位
      setHistory((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        // 更新最后一条消息（即 AI 的回复）
        setHistory((prev) => {
          const newHistory = [...prev];
          const lastIndex = newHistory.length - 1;
          const lastMsg = newHistory[lastIndex];
          // 确保只更新 assistant 的消息
          if (lastMsg.role === "assistant") {
            newHistory[lastIndex] = { ...lastMsg, content: lastMsg.content + chunk };
          }
          return newHistory;
        });
      }
    } catch (error) {
      console.error(error);
      setHistory((prev) => [...prev, { role: "system", content: "Error: Connection to Neural Link lost. Backend offline." }]);
    } finally {
      setIsLoading(false);
    }
  }, [router, isLoading]); // 依赖项

  return {
    history,
    isBooting,
    isLoading,
    showMatrix,
    setShowMatrix,
    processCommand,
  };
};