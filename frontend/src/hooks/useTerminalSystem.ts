import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

// [修改 1]: 扩展类型定义
export type Message = {
  role: "system" | "user" | "assistant" | "navigation";
  content: string;
  isLogo?: boolean; // 新增：专门用于标记 Logo，防止误伤 cowsay
};

// generateCowsay
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
    if (!isConnectionOpen || hasBooted.current) return;

    hasBooted.current = true;

    // [ASCII Logo]
    const asciiLogo = `
$$$$$$$\\             $$\\                         
$$  __$$\\            $$ |                        
$$ |  $$ | $$$$$$\\ $$$$$$\\    $$$$$$\\   $$$$$$\\  
$$$$$$$  |$$  __$$\\\\_$$  _|  $$  __$$\\ $$  __$$\\ 
$$  ____/ $$$$$$$$ | $$ |    $$$$$$$$ |$$ |  \\__|
$$ |      $$   ____| $$ |$$\\ $$   ____|$$ |      
$$ |      \\$$$$$$$\\  \\$$$$  |\\$$$$$$$\\ $$ |      
\\__|       \\_______|  \\____/  \\_______|\\__|      
                                                    
    `;

    const bootSequence = [
      // [修改 2]: 明确标记 Logo
      { text: asciiLogo, isLogo: true },
      { text: "> Initializing Neural Link...", isLogo: false },
      { text: "> Loading user profile: Peter Guan [Quant/Dev]", isLogo: false },
      { text: "> System Status: ONLINE", isLogo: false },
      { text: "> Connection secured.", isLogo: false }
    ];

    let delay = 0;
    bootSequence.forEach((item, index) => {
      delay += index === 0 ? 100 : 600;
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { role: "system", content: item.text, isLogo: item.isLogo }
        ]);

        if (index === bootSequence.length - 1) {
          setIsBooting(false);
          // [修改 3]: 启动完成后，添加导航按钮 (Available Actions)
          setTimeout(() => {
             setHistory((prev) => [...prev, { role: "navigation", content: "init" }]);
          }, 200);
        }
      }, delay);
    });
  }, [isConnectionOpen]);

  const processCommand = useCallback(async (inputRaw: string) => {
    const input = inputRaw.trim();
    if (!input || isLoading) return;

    const args = input.split(" ");
    const mainCommand = args[0].toLowerCase();

    // --- 1. Local Commands Handling ---

    if (mainCommand === "clear") {
      setHistory([]);
      return;
    }

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
  whoami   Display current user profile
  ls       List directory contents
  cd       Change directory (navigate to pages)
  clear    Clear the terminal screen
  cmatrix  Run Matrix screensaver
  cowsay   Make the cow say something
  <text>   Send prompt to AI Assistant (LLM)
      `;
      // [修改 4]: help 后跟随导航按钮
      setHistory((prev) => [
          ...prev,
          { role: "system", content: helpMessage.trim() },
          { role: "navigation", content: "help" }
      ]);
      return;
    }

    // [Whoami] - 身份卡
    if (mainCommand === "whoami") {
        setHistory((prev) => [...prev, { role: "user", content: input }]);
        const bio = `
User: Peter Guan
Role: Full Stack Developer & Quant Researcher
Location: Santa Monica, CA
Bio: A developer bridging the gap between high-performance tech and quantitative finance.
     Passionate about building 'Hardcore Tools' with modern aesthetics.
Stack: Python, Next.js, C++, Haskell, PyTorch
        `;
        setHistory((prev) => [...prev, { role: "system", content: bio.trim() }]);
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
    const restrictedCommands = ["mkdir", "touch", "rm", "rmdir", "cp", "mv", "chmod", "chown", "sudo", "nano", "vim", "ifconfig"];
    if (restrictedCommands.includes(mainCommand)) {
      setHistory((prev) => [...prev, { role: "user", content: input }]);
      const msg = mainCommand === "sudo"
        ? "Permission denied: You are not Peter Guan."
        : `bash: ${mainCommand}: permission denied`;

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
    ├── RealiBuddy
    ├── GradeCalc
    └── MyMD
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
        setTimeout(() => router.push("/about"), 500);
      } else if (["..", "~", "/"].includes(target)) {
         setHistory((prev) => [...prev, { role: "system", content: "Directory is already root." }]);
      } else {
        setHistory((prev) => [...prev, { role: "system", content: `bash: cd: ${target}: No such file or directory` }]);
      }
      return;
    }

    // --- 2. AI Processing (LLM) ---
    setHistory((prev) => [...prev, { role: "user", content: input }]);
    setIsLoading(true);

    try {
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
      console.error(error);
      setHistory((prev) => [...prev, { role: "system", content: "Error: Connection to Neural Link lost. Backend offline." }]);
    } finally {
      setIsLoading(false);
    }
  }, [router, isLoading]);

  return {
    history,
    isBooting,
    isLoading,
    showMatrix,
    setShowMatrix,
    processCommand,
  };
};