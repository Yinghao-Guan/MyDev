// src/app/projects/components/VeruDemo.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Activity, Cpu } from "lucide-react";

type AuditItem = {
    citation_text: string;
    status: "REAL" | "FAKE" | "MISMATCH" | "SUSPICIOUS" | "UNVERIFIED";
    confidence: number;
    message: string;
    source: string;
    metadata?: any;
};

export default function VeruDemo() {
  const [inputText, setInputText] = useState("Devlin et al., 2018 – “BERT: Pre-training of Deep Bidirectional Transformers”\n" +
      "Popularized transformer-based language models.\n" +
      "\n" +
      "'Deep Residual Learning for Image Recognition' by Kaiming He. This paper proposes a new method for cooking spaghetti using neural networks.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResults, setAuditResults] = useState<AuditItem[]>([]);
  const [progress, setProgress] = useState("");

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setAuditResults([]);
    setProgress("Initializing Neural Audit Engine...");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) throw new Error("Backend connection failed");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      setProgress("Scanning knowledge graphs...");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.info) { /* ignore info */ }
            else if (data.error) { console.error(data.error); }
            else { setAuditResults(prev => [...prev, data as AuditItem]); }
          } catch (e) { console.error(e); }
        }
      }
    } catch (error) {
      console.error(error);
      alert("Backend offline or unreachable.");
    } finally {
      setIsAnalyzing(false);
      setProgress("");
    }
  };

  const renderHighlightedText = () => {
    if (auditResults.length === 0) return <p className="text-gray-300 leading-relaxed">{inputText}</p>;
    let content = inputText;
    [...auditResults].sort((a, b) => b.citation_text.length - a.citation_text.length).forEach(item => {
        const colorClass = item.status === "REAL" ? "border-green-500/50 text-green-300" :
                           item.status === "FAKE" ? "bg-red-500/20 border-red-500 text-red-300" :
                           "bg-yellow-500/20 border-yellow-500 text-yellow-300";
        content = content.replace(item.citation_text, `<span class="border-b-2 ${colorClass} pb-0.5 cursor-help" title="${item.status}">${item.citation_text}</span>`);
    });
    return <p className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />;
  };

  const averageScore = auditResults.length > 0 ? Math.round(auditResults.reduce((acc, curr) => acc + (curr.status === "REAL" ? 100 : 0), 0) / auditResults.length) : 0;

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-6 overflow-y-auto">
      {/* Input */}
      <div className="flex-1 flex flex-col min-h-[300px]">
        <div className="flex justify-between items-center mb-2">
           <h3 className="text-green-400 font-bold flex items-center"><Search size={16} className="mr-2"/> Input Text / Abstract</h3>
        </div>
        <div className="flex-1 relative group">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-full bg-[#1e1e1e] border border-gray-700 rounded-lg p-4 text-gray-300 font-mono text-sm focus:outline-none focus:border-green-500 transition-colors resize-none"
            placeholder="Paste academic text here..."
          />
          <div className="absolute bottom-4 right-4">
             <button onClick={handleAnalyze} disabled={isAnalyzing} className={`flex items-center space-x-2 px-4 py-2 rounded font-bold transition-all ${isAnalyzing ? 'bg-gray-700 text-gray-400' : 'bg-green-600 hover:bg-green-500 text-black'}`}>
                {isAnalyzing ? <><Activity size={16} className="animate-spin"/><span>{progress || "Scanning..."}</span></> : <><Cpu size={16}/><span>Run Scan</span></>}
             </button>
          </div>
        </div>
      </div>
      {/* Output */}
      <div className="flex-1 flex flex-col min-h-[300px] border border-gray-800 bg-[#0a0a0a] rounded-lg overflow-hidden relative">
        <div className="bg-[#111] border-b border-gray-800 p-3 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 flex items-center"><Activity size={14} className="mr-2 text-blue-500"/> REPORT</span>
          {auditResults.length > 0 && <span className={`text-xs px-2 py-0.5 rounded ${averageScore > 80 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>Score: {averageScore}%</span>}
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
           {(auditResults.length > 0 || isAnalyzing) && (
             <div>
               <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-2">Verification</h4>
               <div className="text-sm font-mono border-l-2 border-gray-700 pl-4 py-2 bg-gray-900/30 rounded">{renderHighlightedText()}</div>
             </div>
           )}
           <div className="space-y-3 pb-4">
             {auditResults.map((item, idx) => (
                <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} key={idx} className={`p-3 rounded border text-sm ${item.status === "REAL" ? "border-green-900/50 bg-green-900/10" : item.status === "FAKE" ? "border-red-900/50 bg-red-900/10" : "border-yellow-900/50 bg-yellow-900/10"}`}>
                   <div className="flex justify-between items-start mb-1">
                      <span className={`font-bold text-xs px-1.5 py-0.5 rounded ${item.status === "REAL" ? "bg-green-900 text-green-400" : item.status === "FAKE" ? "bg-red-900 text-red-100" : "bg-yellow-900 text-yellow-100"}`}>{item.status}</span>
                      <span className="text-xs text-gray-500">via {item.source}</span>
                   </div>
                   <div className="font-bold text-gray-300 mb-1 line-clamp-1">"{item.citation_text}"</div>
                   <div className="text-xs text-gray-400 opacity-80">{item.message}</div>
                </motion.div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};