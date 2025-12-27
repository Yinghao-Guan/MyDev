"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder, FileCode, FileText, ChevronRight, ChevronDown, Play,
  Terminal, X, BookOpen, MousePointerClick, Github, ExternalLink
} from "lucide-react";
import MemoizedMarkdown from "@/components/ui/MemoizedMarkdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { PROJECTS, Project, ProjectFile } from "./data";
import VeruDemo from "./components/VeruDemo";
import RealibuddyDemo from "./components/RealibuddyDemo";

type OpenedTab = {
  projectId: string;
  file: ProjectFile;
};

function ProjectsContent() {
  const [activeTab, setActiveTab] = useState<OpenedTab | null>(null);
  const [openTabs, setOpenTabs] = useState<OpenedTab[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
      "veru": true,
      "realibuddy": true,
      "gradecalc": false,
      "mymd": false
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const pId = searchParams.get("project");
    const fName = searchParams.get("file");

    if (pId && fName) {
      const project = PROJECTS.find((p) => p.id === pId);
      const file = project?.files.find((f) => f.name === fName);

      if (project && file) {
        setExpandedFolders((prev) => { // eslint-disable-line
            if (prev[pId]) return prev;
            return { ...prev, [pId]: true };
        });

        setOpenTabs((prev) => {
            const exists = prev.some(t => t.projectId === pId && t.file.name === fName);
            if (exists) return prev;
            return [...prev, { projectId: pId, file }];
        });

        setActiveTab((prev) => {
            if (prev?.projectId === pId && prev?.file.name === fName) return prev;
            return { projectId: pId, file };
        });
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (activeTab) {
      if (searchParams.get("project") !== activeTab.projectId || searchParams.get("file") !== activeTab.file.name) {
          params.set("project", activeTab.projectId);
          params.set("file", activeTab.file.name);
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    } else {
      if (searchParams.has("project") || searchParams.has("file")) {
        router.replace(pathname, { scroll: false });
      }
    }
  }, [activeTab, router, pathname, searchParams]);

  const toggleFolder = (projectId: string) => setExpandedFolders(prev => ({ ...prev, [projectId]: !prev[projectId] }));

  // 打开文件逻辑
  const openFile = (projectId: string, file: ProjectFile) => {
    const existingTab = openTabs.find(t => t.projectId === projectId && t.file.name === file.name);
    if (existingTab) {
      setActiveTab(existingTab);
    } else {
      const newTab = { projectId, file };
      setOpenTabs(prev => [...prev, newTab]);
      setActiveTab(newTab);
    }
  };

  // 关闭文件逻辑
  const closeTab = (e: React.MouseEvent, tabToClose: OpenedTab) => {
    e.stopPropagation();
    const updatedTabs = openTabs.filter(t => t !== tabToClose);
    setOpenTabs(updatedTabs);
    if (activeTab === tabToClose) {
      setActiveTab(updatedTabs.length > 0 ? updatedTabs[updatedTabs.length - 1] : null);
    }
  };

  const getFileIcon = (type: string, name: string) => {
    if (type === "readme") return <BookOpen size={14} className="text-blue-400" />;
    if (type === "markdown") return <FileText size={14} className="text-purple-400" />;
    if (type === "demo") return <Play size={14} className="text-green-500" />;
    if (name.endsWith(".py")) return <FileCode size={14} className="text-yellow-400" />;
    if (name.endsWith(".js") || name.endsWith(".ts")) return <FileCode size={14} className="text-yellow-400" />;
    return <FileCode size={14} className="text-gray-400" />;
  };

  const currentProject = activeTab ? PROJECTS.find(p => p.id === activeTab.projectId) : null;

  // --- [Render Logic] ---
  const renderContent = () => {
      if (!activeTab) {
          return (
             <div className="flex flex-col items-center justify-center h-full text-gray-600 select-none">
               <div className="relative mb-6">
                 <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                 <Terminal size={64} className="relative z-10 text-gray-500" />
               </div>
               <h3 className="text-lg font-bold text-gray-400 mb-2">No File Selected</h3>
               <div className="flex items-center text-sm text-gray-500 bg-gray-900/50 px-4 py-2 rounded border border-gray-800">
                  <MousePointerClick size={16} className="mr-2 animate-bounce" />
                  <span>Select a file from the <strong className="text-gray-300">EXPLORER</strong> to view details.</span>
               </div>
             </div>
          );
      }

      const { projectId, file } = activeTab;

      // 1. Handle Demos (通过 projectId 和 file.type === 'demo' 路由)
      if (file.type === "demo") {
          switch (projectId) {
              case "veru":
                  return <VeruDemo />;
              case "realibuddy":
                  return <RealibuddyDemo />;
              case "gradecalc":
                  return (
                    <div className="w-full h-full bg-[#F5F5F7]">
                        <iframe src="https://grade.peterguan.com" className="w-full h-full border-none" title="GradeCalc Live Preview" />
                    </div>
                  );
              // Future: case "realibuddy": return <RealibuddyDemo />;
              default:
                  return <div className="p-10 text-gray-500">Demo not connected yet.</div>;
          }
      }

      // 2. Handle Code
      if (file.type === "code") {
          return (
             <div className="h-full overflow-y-auto p-0">
                <div className="p-6">
                    <div className="text-xs text-gray-500 mb-2 font-mono flex justify-between">
                        <span>{file.name}</span>
                        <span>ReadOnly</span>
                    </div>
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={file.language || 'text'}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: '8px', background: '#1e1e1e', border: '1px solid #333', fontSize: '0.9em', padding: '1rem', lineHeight: '1.4' }}
                    >
                        {file.content ? String(file.content).replace(/\n$/, '') : ''}
                    </SyntaxHighlighter>
                </div>
             </div>
          );
      }

      // 3. Handle Markdown / Readme
      if (file.type === "readme" || file.type === "markdown") {
           return (
             <div className="h-full overflow-y-auto p-0">
               <div className="max-w-3xl mx-auto p-8 prose prose-invert prose-sm">
                  <MemoizedMarkdown content={file.content || ""} />
               </div>
             </div>
           );
      }

      return <div>Unknown file type</div>;
  };

  return (
    <div className="flex h-screen pt-14 text-sm font-mono overflow-hidden bg-[#0d0d0d] text-gray-300">
      {/* Sidebar (Explorer) */}
      <aside className="w-64 border-r border-gray-800 bg-[#050505] flex flex-col shrink-0">
        <div className="p-3 text-xs font-bold text-gray-500 tracking-wider flex items-center justify-between select-none">
          <span>EXPLORER</span>
          <Terminal size={12} />
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-1">
            <div className="flex items-center text-blue-400 font-bold mb-1 px-1 text-xs select-none">
              <ChevronDown size={14} className="mr-1" />
              PETER_GUAN_PORTFOLIO
            </div>
            {PROJECTS.map((project) => (
              <div key={project.id} className="mb-1">
                {/* Project Title Row */}
                <div className="group flex items-center justify-between pr-2 rounded hover:bg-gray-800/50 cursor-pointer select-none">
                    <div onClick={() => toggleFolder(project.id)} className={`flex-1 flex items-center px-2 py-1.5 ${expandedFolders[project.id] ? 'text-gray-200' : 'text-gray-500'}`}>
                      {expandedFolders[project.id] ? <ChevronDown size={14} className="mr-1.5" /> : <ChevronRight size={14} className="mr-1.5" />}
                      <Folder size={14} className={`mr-2 ${expandedFolders[project.id] ? "text-yellow-500" : "text-yellow-500/60"}`} />
                      <span className="truncate">{project.name}</span>
                    </div>
                    {/* Github/Live Links on Hover */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-500 hover:text-green-400"><ExternalLink size={13} /></a>}
                        <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-500 hover:text-white"><Github size={13} /></a>
                    </div>
                </div>
                {/* Files List */}
                <AnimatePresence>
                  {expandedFolders[project.id] && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="ml-4 border-l border-gray-800 pl-1 overflow-hidden">
                      {project.files.map((file) => {
                        const isActive = activeTab?.projectId === project.id && activeTab?.file.name === file.name;
                        return (
                          <div key={file.name} onClick={() => openFile(project.id, file)} className={`flex items-center px-2 py-1.5 cursor-pointer rounded mb-0.5 transition-colors select-none ${isActive ? "bg-green-900/20 text-green-400" : "hover:bg-gray-800 text-gray-400 hover:text-gray-200"}`}>
                            <span className="mr-2 opacity-80">{getFileIcon(file.type, file.name)}</span>
                            <span>{file.name}</span>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
        </div>
      </aside>

      {/* Main Stage */}
      <main className="flex-1 flex flex-col bg-[#0d0d0d] min-w-0">
        {/* Tabs Bar */}
        <div className="h-9 bg-[#050505] border-b border-gray-800 flex items-center px-0 gap-0 overflow-x-auto no-scrollbar select-none">
          {openTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <div key={`${tab.projectId}-${tab.file.name}`} onClick={() => setActiveTab(tab)} className={`group relative flex items-center min-w-fit px-3 py-2 text-xs border-r border-gray-800 cursor-pointer transition-colors h-full mt-1 ${isActive ? "bg-[#1e1e1e] text-gray-200 border-t border-t-green-500" : "bg-[#050505] text-gray-500 hover:bg-[#111] hover:text-gray-300"}`}>
                <span className="mr-2">{getFileIcon(tab.file.type, tab.file.name)}</span>
                <span>{tab.file.name}</span>
                <span onClick={(e) => closeTab(e, tab)} className={`ml-2 p-0.5 rounded-sm hover:bg-gray-700 hover:text-white ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}><X size={12} /></span>
              </div>
            );
          })}
          {/* Spacer & Context Links */}
          <div className="flex-1 border-b border-gray-800 h-full" />
          {currentProject && (
              <div className="flex items-center gap-3 px-3 h-full border-l border-gray-800/50 bg-[#050505]">
                 <span className="hidden md:inline text-xs text-gray-600 mr-1">{currentProject.name}</span>
                 {currentProject.live && <a href={currentProject.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-green-500 hover:text-green-300 bg-green-900/20 px-2 py-1 rounded border border-green-900/50"><ExternalLink size={12} /><span className="font-bold">Live</span></a>}
                 <a href={currentProject.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-800 px-2 py-1 rounded"><Github size={12} /><span>Repo</span></a>
              </div>
          )}
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-hidden relative">
            {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen pt-14 bg-[#0d0d0d] items-center justify-center text-gray-500 font-mono">
         <div className="flex flex-col items-center gap-2">
            <Terminal size={24} className="animate-pulse" />
            <span>Loading Workspace...</span>
         </div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}