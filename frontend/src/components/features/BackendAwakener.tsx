"use client";

import { useEffect } from "react";

export default function BackendAwakener() {
  useEffect(() => {
    // 定义唤醒函数
    const wakeUpBackend = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        // 发送异步请求，使用 'no-cors' 模式或者是简单的 GET，不需要等待 await 结果阻塞页面
        fetch(`${apiUrl}/api/health`, { method: "GET" }).catch(() => {
          // 即使请求超时或失败也没关系，连接尝试本身就已经触发了 Render 的启动
          console.log("Backend wake-up signal sent.");
        });
      } catch (error) {
        // 忽略错误，以免影响用户体验
      }
    };

    wakeUpBackend();
  }, []); // 空依赖数组，确保只在页面首次加载时执行一次

  // 这个组件不需要渲染任何 UI
  return null;
}