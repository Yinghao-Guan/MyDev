"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Folder, User, Mail, Menu, X, Github, Linkedin } from "lucide-react";
import { clsx } from "clsx";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // 定义导航链接 (包含图标)
  const navItems = [
    { name: "~/home", path: "/", icon: <Terminal size={14} /> },
    { name: "~/projects", path: "/projects", icon: <Folder size={14} /> },
    { name: "~/about", path: "/about", icon: <User size={14} /> }, // 也可以跳到 .com
  ];

  return (
    <>
      {/* [Main Navbar]
        保留了你喜欢的边框、背景色和毛玻璃效果
      */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#050505]/60">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between font-mono text-sm">

          {/* 1. 左侧：Logo (通用) */}
          <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-bold tracking-wider">PETER_GUAN.DEV</span>
          </Link>

          {/* 2. 中间：桌面端导航 (Desktop Only) - 使用你提供的代码 */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={clsx(
                    "flex items-center px-3 py-1.5 rounded-md transition-all duration-200 group",
                    isActive
                      ? "bg-white/10 text-green-400"
                      : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                  )}
                >
                  <span className={clsx("mr-2", isActive ? "text-green-400" : "text-gray-600 group-hover:text-gray-400")}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* 3. 右侧：桌面端联系方式 (Desktop Only) */}
          <a
            href="mailto:peter@peterguan.com"
            className="hidden md:flex items-center text-gray-500 hover:text-blue-400 transition-colors"
          >
            <Mail size={14} className="mr-2" />
            <span>contact_me</span>
          </a>

          {/* 4. 移动端：汉堡菜单按钮 (Mobile Only) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </nav>

      {/* [Mobile Fullscreen Menu]
        汉堡菜单展开层 (Portal 级别或高层级)
      */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden flex flex-col pt-20 px-6"
          >
            {/* 移动端菜单项 */}
            <div className="flex flex-col space-y-4">
              {navItems.map((item, idx) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center gap-4 py-4 border-b border-gray-800"
                >
                  <span className="text-green-900 group-hover:text-green-500 font-mono text-sm transition-colors">
                    0{idx + 1}.
                  </span>
                  <span className="text-2xl font-mono text-gray-300 group-hover:text-green-400 transition-colors">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* 移动端底部联系方式 */}
            <div className="mt-auto mb-10 border-t border-gray-800 pt-6">
               <div className="text-xs text-gray-500 font-mono mb-4 uppercase tracking-widest">Connect</div>
               <div className="flex gap-6">
                 <a href="https://github.com/yinghao-guan" className="text-gray-400 hover:text-white"><Github size={24} /></a>
                 <a href="https://linkedin.com/in/yinghaoguan" className="text-gray-400 hover:text-white"><Linkedin size={24} /></a>
                 <a href="mailto:peter@peterguan.com" className="text-gray-400 hover:text-white"><Mail size={24} /></a>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}