import React, { useState } from 'react';
import { modulePrompts } from '../data';
import { Copy, Check, Terminal, Play, LayoutDashboard, Rocket } from 'lucide-react';

export const PromptGenerator: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
      <div className="mb-8 md:mb-12 border-b border-slate-800 pb-6 md:pb-8 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3 flex items-center justify-center md:justify-start gap-4">
          <Terminal className="text-amber-500 w-10 h-10 md:w-12 md:h-12" />
          Backend Generators
        </h2>
        <p className="text-slate-400 text-sm md:text-lg max-w-3xl mx-auto md:mx-0">
          Execute these prompts in your AI Coding Assistant to instantiate the <strong className="text-white">ReachBnB Core System</strong>. Each module is self-contained and auditable.
        </p>
      </div>

      <div className="space-y-12 md:space-y-16">
        {/* God Mode Prompt Highlight */}
        {modulePrompts.filter(p => p.phase === 6).map((prompt) => (
           <div key={prompt.id} className="relative bg-slate-900 rounded-3xl border-2 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.1)] md:shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden ring-1 ring-amber-500/20 group">
              <div className="absolute top-0 right-0 p-2 md:p-4 bg-amber-500/10 rounded-bl-3xl border-b border-l border-amber-500/20 text-amber-500 font-black text-[10px] md:text-xs tracking-[0.2em] uppercase flex items-center gap-2">
                 <Rocket size={12} className="md:w-3.5 md:h-3.5" /> Supreme Architect
              </div>
              <div className="p-6 md:p-8 border-b border-slate-800/50 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg md:text-xl shadow-lg shadow-amber-500/20 shrink-0">
                       16
                    </div>
                    <div>
                       <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">{prompt.title}</h3>
                       <p className="text-slate-400 text-xs md:text-sm mt-1 font-medium">{prompt.description}</p>
                    </div>
                 </div>
              </div>
              <div className="relative">
                 <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
                    <button
                      onClick={() => handleCopy(prompt.id, prompt.promptContent)}
                      className={`flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold transition-all shadow-xl hover:-translate-y-1 text-[10px] md:text-xs ${
                        copiedId === prompt.id
                          ? 'bg-emerald-500 text-white ring-2 md:ring-4 ring-emerald-500/20'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-900 ring-2 md:ring-4 ring-amber-500/20'
                      }`}
                    >
                      {copiedId === prompt.id ? <Check size={16} className="md:w-5 md:h-5 stroke-[3]" /> : <Play size={16} className="md:w-5 md:h-5" fill="currentColor" />}
                      {copiedId === prompt.id ? 'COPIED' : 'EXECUTE'}
                    </button>
                 </div>
                 <pre className="p-6 md:p-8 pt-16 md:pt-8 bg-black text-[10px] md:text-xs font-mono text-slate-300 overflow-x-auto overflow-y-auto max-h-[400px] md:max-h-[600px] custom-scrollbar leading-relaxed">
                    <code>{prompt.promptContent}</code>
                 </pre>
              </div>
           </div>
        ))}

        {/* Phase 7: Role-Specific Independent Dashboards */}
        <div>
           <div className="flex items-center gap-4 mb-8">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                 <LayoutDashboard className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                 Role-Specific Modules <span className="text-slate-500 text-base font-normal ml-2">Independent Dashboards</span>
              </h3>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {modulePrompts.filter(p => p.phase === 7).map((prompt) => (
               <div key={prompt.id} className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-lg hover:border-emerald-500/30 transition-all hover:shadow-2xl hover:-translate-y-1 group">
                 <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-start justify-between">
                   <div>
                     <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-[10px] font-black text-emerald-900 bg-emerald-500 px-2 py-0.5 rounded uppercase tracking-wide">Module</span>
                        <h3 className="font-bold text-white text-sm">{prompt.title.replace(/^\d+\.\s/, '')}</h3>
                     </div>
                     <p className="text-xs text-slate-400 font-medium">{prompt.description}</p>
                   </div>
                   <button
                     onClick={() => handleCopy(prompt.id, prompt.promptContent)}
                     className={`p-2.5 rounded-lg transition-all ${
                       copiedId === prompt.id ? 'text-emerald-400 bg-emerald-900/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                     }`}
                     title="Copy Prompt"
                   >
                     {copiedId === prompt.id ? <Check size={18} /> : <Copy size={18} />}
                   </button>
                 </div>
                 <pre className="p-5 bg-black text-[10px] text-emerald-200/70 font-mono overflow-x-auto max-h-40 scrollbar-thin scrollbar-thumb-slate-800 group-hover:text-emerald-200 transition-colors">
                   {prompt.promptContent}
                 </pre>
               </div>
             ))}
           </div>
        </div>

        {/* Regular Infrastructure Prompts (Phase 1-5) */}
        <div>
           <div className="flex items-center gap-4 mb-8 pt-8 border-t border-slate-800">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                 <Terminal className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                 Core Infrastructure <span className="text-slate-500 text-base font-normal ml-2">Phases 1-5</span>
              </h3>
           </div>

           <div className="grid grid-cols-1 gap-6">
              {modulePrompts.filter(p => p.phase < 6).map((prompt) => (
               <div key={prompt.id} className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden shadow-sm hover:border-slate-700 transition-all hover:bg-slate-900/50 group">
                 <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                   <div className="flex items-start sm:items-center gap-4 w-full">
                     <span className="text-xs font-black text-slate-500 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0 mt-1 sm:mt-0">P{prompt.phase}</span>
                     <div className="flex-1">
                        <h3 className="font-bold text-white text-sm">{prompt.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{prompt.description}</p>
                     </div>
                   </div>
                   <button
                     onClick={() => handleCopy(prompt.id, prompt.promptContent)}
                     className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border w-full sm:w-auto shrink-0 ${
                       copiedId === prompt.id 
                       ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' 
                       : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-600'
                     }`}
                   >
                     {copiedId === prompt.id ? <Check size={14} /> : <Copy size={14} />}
                     {copiedId === prompt.id ? 'Copied' : 'Copy'}
                   </button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};