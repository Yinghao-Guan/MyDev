// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Folder, User, Mail } from "lucide-react";
import { clsx } from "clsx";

export default function Navbar() {
  const pathname = usePathname();

  // 定义导航链接
  const navItems = [
    { name: "~/home", path: "/", icon: <Terminal size={14} /> },
    { name: "~/projects", path: "/projects", icon: <Folder size={14} /> },
    { name: "~/about", path: "/about", icon: <User size={14} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#050505]/60">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between font-mono text-sm">

        {/* 左侧：Logo / 品牌区 */}
        <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-bold tracking-wider">PETER_GUAN.DEV</span>
        </div>

        {/* 中间：导航链接 */}
        <div className="flex items-center space-x-1 md:space-x-6">
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

        {/* 右侧：联系 / 状态 */}
        <a
          href="mailto:peter@peterguan.com"
          className="hidden md:flex items-center text-gray-500 hover:text-blue-400 transition-colors"
        >
          <Mail size={14} className="mr-2" />
          <span>contact_me</span>
        </a>

      </div>
    </nav>
  );
}