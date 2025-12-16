"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Realibuddy.module.css";
import BackgroundCanvas from "./BackgroundCanvas";

declare global { interface Window { webkitSpeechRecognition: any; } }
type Verdict = "True" | "False" | "Unverifiable" | "Error" | null;
interface FactCheck {
  id: number; text: string; verdict: Verdict; evidence: string; source?: string; timestamp: string;
}

export default function RealibuddyDemo() {
  const [activeTab, setActiveTab] = useState<'main' | 'dashboard' | 'history'>('main');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");

  // [新增] 来源过滤器状态
  const [sourceFilter, setSourceFilter] = useState("all");

  const [status, setStatus] = useState<"disconnected" | "connected" | "processing">("disconnected");

  const [history, setHistory] = useState<FactCheck[]>([]);
  const [stats, setStats] = useState({ totalZaps: 0, totalClaims: 0, trueCount: 0, falseCount: 0, unverifCount: 0 });
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.webkitSpeechRecognition) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false; recognition.interimResults = true; recognition.lang = "en-US";
      recognition.onstart = () => { setIsListening(true); setStatus("connected"); };
      recognition.onend = () => { setIsListening(false); if(status!=="processing") setStatus("connected"); };
      recognition.onresult = (e: any) => {
          let final = "";
          for (let i = e.resultIndex; i < e.results.length; ++i) {
             if (e.results[i].isFinal) final += e.results[i][0].transcript;
             else setTranscript(e.results[i][0].transcript);
          }
          if (final) { setTranscript(final); handleFactCheck(final); }
      };
      recognitionRef.current = recognition;
    }
  }, [status]);

  const toggleMic = () => {
    if (isListening) recognitionRef.current?.stop();
    else { setTranscript(""); recognitionRef.current?.start(); }
  };

  const handleTextSubmit = () => {
      if (!textInput.trim()) return;
      handleFactCheck(textInput);
      setTextInput("");
  };

  const handleFactCheck = async (text: string) => {
      setStatus("processing");
      try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          // [修改] 发送 source_filter
          const res = await fetch(`${apiUrl}/api/realibuddy/audit`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  text,
                  source_filter: sourceFilter
              })
          });
          const data = await res.json();
          const newCheck: FactCheck = {
              id: Date.now(), text, verdict: data.verdict as Verdict, evidence: data.evidence, source: data.source, timestamp: new Date().toLocaleTimeString()
          };
          setHistory(prev => [newCheck, ...prev]);
          updateStats(data.verdict);
          const u = new SpeechSynthesisUtterance(`${data.verdict}. ${data.evidence}`);
          window.speechSynthesis.speak(u);
      } catch(e) { console.error(e); }
      finally { setStatus("connected"); }
  };

  const updateStats = (verdict: string) => {
      setStats(prev => {
          const isFalse = verdict === "False"; const isTrue = verdict === "True";
          return {
              totalClaims: prev.totalClaims + 1, totalZaps: prev.totalZaps + (isFalse ? 1 : 0),
              trueCount: prev.trueCount + (isTrue ? 1 : 0), falseCount: prev.falseCount + (isFalse ? 1 : 0),
              unverifCount: prev.unverifCount + (verdict === "Unverifiable" ? 1 : 0)
          };
      });
  };
  const getTruthRate = () => stats.totalClaims === 0 ? 0 : Math.round((stats.trueCount / stats.totalClaims) * 100);

  return (
    <div className={`relative h-full w-full text-gray-100 overflow-hidden font-sans bg-[#0f172a] ${styles.container}`}>
      <BackgroundCanvas />

      <div className="absolute inset-0 overflow-y-auto px-6 py-6 z-10">
        <div className="max-w-6xl mx-auto min-h-full">

          <header className="mb-8 text-center mt-4">
              <div className={styles.logoContainer}>
                  {['r','e','a','l','i'].map((char,i) => <span key={i} className={`${styles.logoChar} ${styles.logoReali}`}>{char}</span>)}
                  {['b','u','d','d','y'].map((char,i) => <span key={i} className={`${styles.logoChar} ${styles.logoBuddy}`}>{char}</span>)}
              </div>
          </header>

          <div className={`${styles.glassPanel} rounded-xl p-4 mb-6`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-3">
                      <div className={`${styles.statusDot} ${isListening ? styles.statusConnected : ''}`}></div>
                      <div><div className="text-xs text-gray-400 font-medium">Microphone</div><div className="text-sm font-semibold">{isListening ? "Listening" : "Idle"}</div></div>
                  </div>
                  <div className="flex items-center space-x-3">
                      <div className={`${styles.statusDot} ${styles.statusConnected}`}></div>
                      <div><div className="text-xs text-gray-400 font-medium">Backend API</div><div className="text-sm font-semibold">Online (Gemini 2.0)</div></div>
                  </div>
                  <div className="flex items-center space-x-3">
                      <div className={`${styles.statusDot} ${status === 'processing' ? styles.statusConnecting : ''}`}></div>
                      <div><div className="text-xs text-gray-400 font-medium">Fact Checking</div><div className="text-sm font-semibold">{status === 'processing' ? "Analyzing..." : "Ready"}</div></div>
                  </div>
                   <div className="flex items-center space-x-3">
                     <div className="text-xs text-gray-400">Mode:</div>
                     <div className="text-xs bg-blue-900/50 px-2 py-1 rounded text-blue-200 border border-blue-500/30">Prompt Driven</div>
                </div>
              </div>
          </div>

          <div className={`flex space-x-1 mb-6 ${styles.glassPanel} rounded-xl p-1`}>
              {['main', 'dashboard', 'history'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab as any)} className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''} capitalize`}>{tab}</button>
              ))}
          </div>

          {activeTab === 'main' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
                  <div className="lg:col-span-3 space-y-6">
                      <div className={`${styles.glassPanel} rounded-xl p-6`}>
                          <h2 className="text-lg font-bold mb-4">Controls</h2>
                          <button onClick={toggleMic} className={`w-full mb-3 ${isListening ? styles.btnWarning : styles.btnPrimary}`}>
                              {isListening ? <><span className="animate-pulse mr-2">●</span>Stop Listening</> : "Start Monitoring"}
                          </button>
                      </div>

                      <div className={`${styles.glassPanel} rounded-xl p-6`}>
                          <h2 className="text-lg font-bold mb-4">Text Input Mode</h2>
                          <div className="space-y-3">
                              <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Source Filter</label>
                                  {/* [修改] 绑定 Select */}
                                  <select
                                      className={styles.inputField}
                                      value={sourceFilter}
                                      onChange={(e) => setSourceFilter(e.target.value)}
                                  >
                                      <option value="all">All Sources (General)</option>
                                      <option value="academic">Academic / Research</option>
                                      <option value="news">News & Media</option>
                                      <option value="social">Social Media / Viral</option>
                                      <option value="authoritative">Gov / Authoritative</option>
                                  </select>
                              </div>
                              <textarea
                                  rows={3}
                                  placeholder="Enter statement to fact-check"
                                  className={`${styles.inputField} resize-none`}
                                  value={textInput}
                                  onChange={(e) => setTextInput(e.target.value)}
                                  onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextSubmit(); } }}
                              ></textarea>
                              <button
                                  onClick={handleTextSubmit}
                                  disabled={status === 'processing' || !textInput.trim()}
                                  className={`${styles.btnSecondary} w-full ${status === 'processing' || !textInput.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                  Check Statement
                              </button>
                          </div>
                      </div>

                      <div className={`${styles.glassPanel} rounded-xl p-6`}>
                         <div className="space-y-4">
                            <div className={styles.statCard}><div className="text-sm text-gray-400">Total Zaps (Simulated)</div><div className="text-3xl font-bold text-red-400">{stats.totalZaps}</div></div>
                            <div className={styles.statCard}><div className="text-sm text-gray-400">Claims</div><div className="text-2xl font-bold">{stats.totalClaims}</div></div>
                         </div>
                      </div>
                  </div>
                  <div className="lg:col-span-9 space-y-6">
                      <div className={`${styles.glassPanel} rounded-xl overflow-hidden`}>
                          <div className="border-b border-white/10 p-4 flex justify-between"><h2 className="text-lg font-bold">Live Transcript</h2><button onClick={() => setTranscript("")} className={styles.btnGhost}>Clear</button></div>
                          <div className="p-4 h-48 overflow-y-auto">{transcript ? <div className="text-xl leading-relaxed text-gray-200">"{transcript}"</div> : <div className="text-gray-500 text-sm text-center py-10 italic">Waiting for speech...</div>}</div>
                      </div>
                      <div className={`${styles.glassPanel} rounded-xl overflow-hidden`}>
                          <div className="border-b border-white/10 p-4 flex justify-between"><h2 className="text-lg font-bold">Fact Checks</h2><button onClick={() => setHistory([])} className={styles.btnGhost}>Clear</button></div>
                          <div className="p-4 h-96 overflow-y-auto space-y-4">
                              {history.length === 0 && <div className="text-gray-500 text-sm text-center py-20">Fact checks will appear here...</div>}
                              {history.map(item => (
                                  <div key={item.id} className={`${styles.factCard} ${item.verdict === 'True' ? styles.verdictTrue : item.verdict === 'False' ? styles.verdictFalse : styles.verdictUnverifiable}`}>
                                      <div className="flex justify-between items-start mb-2"><span className={styles.factVerdict}>{item.verdict}</span><span className="text-xs text-gray-500">{item.timestamp}</span></div>
                                      <div className="text-lg mb-2 text-gray-200">"{item.text}"</div>
                                      <div className="text-sm text-gray-400 pt-3 border-t border-white/5">{item.evidence}</div>
                                      {item.source && <div className="text-xs text-blue-400 mt-2">Source: {item.source}</div>}
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'dashboard' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-10">
                  <div className={`${styles.glassPanel} rounded-xl p-6`}><div className="text-sm text-gray-400 mb-2">Total Claims</div><div className="text-3xl font-bold text-blue-400">{stats.totalClaims}</div></div>
                  <div className={`${styles.glassPanel} rounded-xl p-6`}><div className="text-sm text-gray-400 mb-2">Truth Rate</div><div className="text-3xl font-bold text-green-400">{getTruthRate()}%</div></div>
                  <div className={`${styles.glassPanel} rounded-xl p-6`}><div className="text-sm text-gray-400 mb-2">False Claims</div><div className="text-3xl font-bold text-red-400">{stats.falseCount}</div></div>
                  <div className={`${styles.glassPanel} rounded-xl p-6`}><div className="text-sm text-gray-400 mb-2">Unverifiable</div><div className="text-3xl font-bold text-yellow-400">{stats.unverifCount}</div></div>
               </div>
          )}

          {activeTab === 'history' && (
               <div className={`${styles.glassPanel} rounded-xl p-6 pb-10`}>
                  <h2 className="text-2xl font-bold mb-4">Session History</h2>
                  <div className="space-y-2">
                       {history.map(item => (
                           <div key={item.id} className="p-3 bg-white/5 rounded flex justify-between items-center">
                               <div className="flex-1"><span className={`inline-block w-20 text-xs font-bold ${item.verdict==='True'?'text-green-400':item.verdict==='False'?'text-red-400':'text-yellow-400'}`}>{item.verdict}</span><span className="text-sm text-gray-300">"{item.text}"</span></div>
                               <span className="text-xs text-gray-500">{item.timestamp}</span>
                           </div>
                       ))}
                  </div>
               </div>
          )}
        </div>
      </div>
    </div>
  );
}