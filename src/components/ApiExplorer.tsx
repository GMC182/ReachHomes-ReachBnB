import React, { useState } from 'react';
import { apiEndpoints } from '../data';
import { Server, ChevronDown, ChevronRight, Activity, Code, ShieldAlert, Lock, Database } from 'lucide-react';

export const ApiExplorer: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'POST': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PUT': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'DELETE': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'PATCH': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-slate-700 text-slate-200';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 border-b border-slate-800 pb-8 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center justify-center md:justify-start gap-4">
          <Server className="text-emerald-500 w-8 h-8 md:w-10 md:h-10" />
          System Registry
        </h2>
        <p className="text-slate-400 text-sm md:text-lg">
          Core Business Endpoints & Security Audit Logs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {apiEndpoints.map((ep, idx) => (
          <div key={idx} className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-lg backdrop-blur-sm group hover:border-slate-700 transition-colors">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-slate-800/50 transition-colors gap-4 sm:gap-0"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 overflow-hidden w-full">
                <span className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-black border uppercase tracking-wider w-16 sm:w-20 text-center shrink-0 ${getMethodColor(ep.method)}`}>
                  {ep.method}
                </span>
                <div className="flex flex-col items-start gap-1 overflow-hidden w-full">
                   <span className="font-mono text-xs sm:text-sm text-slate-200 font-bold tracking-tight truncate w-full">{ep.path}</span>
                   <span className="text-[10px] sm:text-xs text-slate-500 font-medium line-clamp-2 sm:line-clamp-1">{ep.summary}</span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 mt-4 sm:mt-0 w-full sm:w-auto">
                 {ep.auditNotes && ep.auditNotes.length > 0 && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-950/30 text-red-400 rounded-full text-[10px] font-bold border border-red-900/30">
                       <ShieldAlert size={12}/> AUDITED
                    </span>
                 )}
                 {openIndex === idx ? <ChevronDown size={20} className="text-slate-500 ml-auto sm:ml-0" /> : <ChevronRight size={20} className="text-slate-500 ml-auto sm:ml-0" />}
              </div>
            </button>
            
            {openIndex === idx && (
              <div className="p-6 bg-slate-950/50 border-t border-slate-800 space-y-8 animate-in slide-in-from-top-2">
                
                {/* Reasoning & Security Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col gap-3">
                      <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                         <Activity size={14} /> Architecture Decision
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed font-medium">{ep.reasoning}</p>
                   </div>

                   {ep.auditNotes && ep.auditNotes.length > 0 && (
                     <div className="bg-red-950/10 p-5 rounded-xl border border-red-900/30 flex flex-col gap-3">
                        <h4 className="text-xs font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                           <Lock size={14} /> Security & Audit
                        </h4>
                        <ul className="space-y-2">
                           {ep.auditNotes.map((note, i) => (
                              <li key={i} className="text-sm text-red-200/80 flex items-start gap-2">
                                 <span className="mt-1.5 w-1 h-1 bg-red-500 rounded-full shrink-0"></span>
                                 {note}
                              </li>
                           ))}
                        </ul>
                     </div>
                   )}
                </div>

                {/* Code Block */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Code size={14} /> Implementation Logic
                  </h4>
                  <div className="bg-black rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
                     <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                        <span className="text-[10px] font-mono text-slate-500">Java Spring Boot Controller</span>
                     </div>
                     <pre className="p-5 text-xs text-emerald-300 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                        {ep.implementationCode}
                     </pre>
                  </div>
                </div>

                {/* Data Flow */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ep.body && (
                    <div>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <Database size={14} /> Request Body
                      </h4>
                      <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-orange-200 font-mono overflow-x-auto">
                        {ep.body}
                      </pre>
                    </div>
                  )}
                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Server size={14} /> Response
                    </h4>
                    <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-blue-200 font-mono overflow-x-auto">
                      {ep.response}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};