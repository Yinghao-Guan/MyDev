"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface MatrixRainProps {
  onExit: () => void;
}

export default function MatrixRain({ onExit }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  // 确保只在客户端执行，且挂载后才渲染 Portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 确保 Canvas 永远全屏且置顶
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const symbols = "$<>[]{}#*&@%";
    const alphabet = latin + nums + symbols;

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F0";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 30);

    const handleExit = () => onExit();
    window.addEventListener("keydown", handleExit);
    window.addEventListener("click", handleExit);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleExit);
      window.removeEventListener("click", handleExit);
    };
  }, [mounted, onExit]);

  if (!mounted) return null;

  // 使用 createPortal 将组件直接渲染到 document.body
  // 这样它就能无视任何父级 overflow: hidden 或 transform 限制，真正全屏
  return createPortal(
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] bg-black cursor-none"
      style={{ pointerEvents: 'auto' }}
    />,
    document.body
  );
}