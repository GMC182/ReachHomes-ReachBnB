import React, { useState, useEffect } from 'react';
import { testSpecs } from '../data';
import { 
  ShieldCheck, Server, Monitor, Activity, CheckCircle, ChevronRight, Crown, AlertTriangle, 
  FileText, Lock, Terminal, Code, Search, Database, Fingerprint, ArrowRight, Gavel,
  Globe, Briefcase, User, DollarSign, Layout, Video, Users, MessageSquare, CreditCard, Map, Send
} from 'lucide-react';

interface AuditLog {
  id: string;
  time: string;
  actor: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'FAILURE' | 'DENIED';
  ip: string;
}

const JOURNEYS = {
  JUAN: {
    label: 'God Mode (Forensic)',
    icon: ShieldCheck,
    color: 'text-amber-500',
    steps: [
      { step: 1, title: 'Detection', desc: 'IDS triggers "RBAC Violation". Cluster Manager attempted to delete a Geo Manager.', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500', meta: 'ALERT_ID: SEC-992' },
      { step: 2, title: 'Trace', desc: 'Juan filters Audit Logs by IP & Actor ID to see the full session history.', icon: Search, color: 'text-blue-500', bg: 'bg-blue-500', meta: 'SELECT * FROM audits' },
      { step: 3, title: 'Verify Logic', desc: "Juan checks Source Inspector to confirm `RBACService` correctly denied the request.", icon: Code, color: 'text-emerald-500', bg: 'bg-emerald-500', meta: 'Result: ACCESS_DENIED' },
      { step: 4, title: 'Action', desc: 'Juan suspends the Cluster Manager and broadcasts a security notice.', icon: Gavel, color: 'text-amber-500', bg: 'bg-amber-500', meta: 'UPDATE users SET...' }
    ]
  },
  GEO: {
    label: 'Geo Manager',
    icon: Globe,
    color: 'text-blue-500',
    steps: [
      { step: 1, title: 'Regional Oversight', desc: 'Logs in to view aggregated tax and revenue data for the entire region.', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500', meta: 'GET /dashboard/geo' },
      { step: 2, title: 'Cluster Audit', desc: 'Identifies a cluster with dropping performance via the heatmap.', icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500', meta: 'Analyzing KPI...' },
      { step: 3, title: 'Compliance Check', desc: 'Verifies that all owners in the cluster have submitted tax forms.', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500', meta: 'Tax Status: PENDING' },
      { step: 4, title: 'Broadcast', desc: 'Sends a regional alert to all Cluster Managers regarding new regulations.', icon: Send, color: 'text-purple-400', bg: 'bg-purple-500', meta: 'Msg Sent: 12 Nodes' }
    ]
  },
  OWNER: {
    label: 'Owner (Enterprise)',
    icon: Briefcase,
    color: 'text-purple-500',
    steps: [
      { step: 1, title: 'Financial Pulse', desc: 'Checks Stripe Connect payouts and current month occupancy rates.', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500', meta: 'Stripe: Connected' },
      { step: 2, title: 'Asset Mgmt', desc: 'Updates the "Summer Special" profile for Villa A using the CMS.', icon: Layout, color: 'text-pink-400', bg: 'bg-pink-500', meta: 'CMS: Version 12' },
      { step: 3, title: 'Reputation', desc: 'Replies to a new 5-star review from the "Review Manager" widget.', icon: MessageSquare, color: 'text-yellow-400', bg: 'bg-yellow-500', meta: 'Reply: "Thanks!"' },
      { step: 4, title: 'Growth', desc: 'Generates a new AI Video ad for social media to boost leads.', icon: Video, color: 'text-violet-400', bg: 'bg-violet-500', meta: 'Rendering: 45%' }
    ]
  },
  CLIENT: {
    label: 'Client Journey',
    icon: User,
    color: 'text-pink-500',
    steps: [
      { step: 1, title: 'Search & Filter', desc: 'Filters properties by Location, Dates, and Guest count.', icon: Search, color: 'text-blue-400', bg: 'bg-blue-500', meta: 'GET /search?q=...' },
      { step: 2, title: 'Wishlist & Chat', desc: 'Saves favorites to Wishlist. Chats anonymously with host about amenities.', icon: MessageSquare, color: 'text-indigo-400', bg: 'bg-indigo-500', meta: 'Token: Guest_Temp' },
      { step: 3, title: 'Booking', desc: 'Completes secure payment via Stripe. Account auto-created.', icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-500', meta: 'Payment: Success' },
      { step: 4, title: 'Review', desc: 'After checkout, leaves a 5-star review for the property.', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500', meta: 'POST /reviews' }
    ]
  }
};

const generateLog = (): AuditLog => {
  const actions = ['CREATE_USER', 'DELETE_PROP', 'LOGIN', 'UPDATE_DNS', 'PAYOUT_STRIPE', 'ANON_CHAT_INIT'];
  const actors = ['juan@admin.com', 'maria@geo.eu', 'carlos@cluster.com', 'owner@luxury.com', 'guest@gmail.com', 'system_bot'];
  const resources = ['User: 123', 'Prop: Villa A', 'SystemSettings', 'Booking: #999', 'Chat: #888'];
  const statuses = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'FAILURE', 'DENIED'];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    time: new Date().toLocaleTimeString(),
    actor: actors[Math.floor(Math.random() * actors.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    resource: resources[Math.floor(Math.random() * resources.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`
  };
};

const JAVA_ASPECT_CODE = `
package com.reachbnb.core.audit;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditAspect {

    private final AuditRepository auditRepository;
    private final SecurityUtils securityUtils;

    @Around("@annotation(audit)")
    public Object logAction(ProceedingJoinPoint joinPoint, Audit audit) throws Throwable {
        // 1. Capture Pre-Execution State
        User actor = securityUtils.getCurrentUser();
        String ip = securityUtils.getClientIp();
        
        try {
            // 2. Execute the actual Method
            Object result = joinPoint.proceed();
            
            // 3. Log Success
            auditRepository.save(new AuditLog(
                actor, 
                audit.action(), 
                "SUCCESS", 
                extractResourceId(result)
            ));
            
            return result;
        } catch (Exception e) {
            // 4. Log Failure
            auditRepository.save(new AuditLog(
                actor, 
                audit.action(), 
                "FAILURE", 
                e.getMessage()
            ));
            throw e;
        }
    }
}`;

const UserJourneyExplorer = () => {
  const [selectedRole, setSelectedRole] = useState<'JUAN' | 'GEO' | 'OWNER' | 'CLIENT'>('JUAN');
  const journey = JOURNEYS[selectedRole];

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-8 animate-in fade-in slide-in-from-bottom-4 shadow-2xl backdrop-blur-md">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="w-full md:w-auto">
          <h3 className="text-2xl md:text-3xl font-black text-white mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 tracking-tight">
            <div className="flex items-center gap-3">
              <journey.icon className={journey.color} size={32} /> 
              User Journey: 
            </div>
            <span className="text-white border-b-4 border-slate-700 pb-1">{journey.label}</span>
          </h3>
          <p className="text-slate-400 font-medium text-sm md:text-base">Critical path analysis for this persona.</p>
        </div>
        
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-inner overflow-x-auto custom-scrollbar w-full md:w-auto">
          {(Object.keys(JOURNEYS) as Array<keyof typeof JOURNEYS>).map((role) => {
             const J = JOURNEYS[role];
             const isActive = selectedRole === role;
             return (
               <button
                 key={role}
                 onClick={() => setSelectedRole(role)}
                 className={`px-4 md:px-5 py-2 md:py-2.5 rounded-lg flex items-center gap-2 text-[10px] md:text-xs font-bold transition-all whitespace-nowrap uppercase tracking-wider ${
                   isActive ? 'bg-slate-800 text-white shadow-lg ring-1 ring-slate-700' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                 }`}
               >
                 <J.icon size={14} className={isActive ? J.color : ''} />
                 <span>{role}</span>
               </button>
             );
          })}
        </div>
      </div>

      {/* Steps Visualization */}
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 relative">
        {journey.steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className={`flex-1 w-full bg-slate-800/40 p-6 rounded-xl border ${step.bg.replace('bg-', 'border-').replace('500', '500/20')} relative group hover:-translate-y-1 transition-transform hover:bg-slate-800/60`}>
              <div className={`absolute -top-4 -left-4 ${step.bg} text-white w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-lg ring-4 ring-slate-900 text-sm`}>
                {step.step}
              </div>
              <div className="flex items-center gap-3 mb-3 pl-2">
                 <step.icon className={step.color} size={24} />
                 <h4 className="font-bold text-white text-base tracking-wide">{step.title}</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed min-h-[40px] font-medium">{step.desc}</p>
              {step.meta && (
                <div className={`mt-4 bg-black/40 p-2.5 rounded border ${step.bg.replace('bg-', 'border-').replace('500', '500/10')} text-[10px] font-mono ${step.color.replace('text-', 'text-').replace('500', '300')} flex items-center gap-2 shadow-inner`}>
                   <Terminal size={10} />
                   {step.meta}
                </div>
              )}
            </div>
            {idx < journey.steps.length - 1 && (
              <div className="hidden md:flex items-center justify-center text-slate-700">
                 <ArrowRight size={24} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const AuditComplianceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'journey' | 'matrix' | 'live-logs' | 'security' | 'source'>('journey');
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [generateLog(), ...prev].slice(0, 50));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const renderStatusBadge = (text: string) => {
    if (text.includes("[REAL BACKEND]")) return <span className="bg-emerald-950/80 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-500/30 ml-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] tracking-wide">REAL BACKEND</span>;
    if (text.includes("[SIMULATED FRONTEND]")) return <span className="bg-amber-950/80 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded border border-amber-500/30 ml-2">SIMULATION</span>;
    if (text.includes("[HYBRID]")) return <span className="bg-blue-950/80 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded border border-blue-500/30 ml-2">HYBRID</span>;
    if (text.includes("[AIRBNB COMPARISON]")) return <span className="bg-pink-950/80 text-pink-400 text-[10px] font-black px-2 py-0.5 rounded border border-pink-500/30 ml-2">VS AIRBNB</span>;
    return null;
  };

  const cleanText = (text: string) => {
    return text.replace(/\[REAL BACKEND\]|\[SIMULATED FRONTEND\]|\[HYBRID\]|\[AIRBNB COMPARISON\]/g, '');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col min-h-screen">
      <div className="mb-8 border-b border-slate-800 pb-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="w-full md:w-auto text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center justify-center md:justify-start gap-4">
            <ShieldCheck className="text-emerald-500 w-10 h-10 md:w-12 md:h-12" />
            Audit & Compliance
          </h2>
          <p className="text-slate-400 font-medium text-sm md:text-base">
            Forensic Logging, Security Events, and Compliance Expectation Verification.
          </p>
        </div>
        <div className="flex bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/50 shadow-2xl backdrop-blur w-full md:w-auto overflow-x-auto custom-scrollbar">
           {[
             { id: 'journey', label: 'User Journey', icon: Fingerprint },
             { id: 'matrix', label: 'Expectations', icon: FileText },
             { id: 'live-logs', label: 'Live Stream', icon: Terminal },
             { id: 'security', label: 'Alerts', icon: Lock },
             { id: 'source', label: 'Inspector', icon: Code },
           ].map((tab) => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`px-4 md:px-5 py-2 md:py-2.5 text-[10px] md:text-xs font-bold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap uppercase tracking-wider ${
                 activeTab === tab.id 
                   ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-lg border border-slate-600' 
                   : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
               }`}
             >
               <tab.icon size={14} className="md:w-4 md:h-4"/> {tab.label}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'journey' && <UserJourneyExplorer />}

      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 gap-12 animate-in fade-in">
          {testSpecs.map((spec) => (
            <div key={spec.id} className="bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl ring-1 ring-white/5 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-slate-900 to-slate-900/80 p-8 border-b border-slate-800">
                <div className="flex items-center gap-4 mb-3">
                  <span className={`font-black px-3 py-1 rounded-lg border text-xs tracking-widest flex items-center gap-2 uppercase ${
                     spec.id === 'ROLE_JUAN' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 
                     'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    {spec.id === 'ROLE_JUAN' && <Crown size={14} />}
                    {spec.id}
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {spec.title}
                  </h3>
                </div>
                <p className="text-slate-400 font-medium pl-1 leading-relaxed">
                  {spec.userStory}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
                <div className="lg:col-span-4 bg-slate-900/20 p-8 flex flex-col gap-8">
                  <div>
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Server size={12} /> Backend Validation
                    </h4>
                    <ul className="space-y-3">
                      {spec.backendTests.map((test, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs text-blue-200 font-mono bg-blue-950/20 p-3 rounded-lg border border-blue-900/30">
                          <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                          {test}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-8 bg-slate-950/30 p-8">
                  <div className="mb-6 flex items-center gap-2 text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px]">
                     <Activity size={12} /> Critical Success Factors
                  </div>
                  <div className="space-y-6">
                    {spec.productionExpectations.map((exp, i) => (
                      <div key={i} className="relative pl-6 border-l-2 border-slate-800 hover:border-emerald-500/50 transition-colors pb-2">
                        <div className="mb-2">{renderStatusBadge(exp)}</div>
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                          {cleanText(exp)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'live-logs' && (
        <div className="bg-black rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[600px] animate-in fade-in shadow-2xl ring-4 ring-slate-800/30">
           <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                 </div>
                 <div className="flex items-center gap-2 ml-4">
                    <Terminal size={14} className="text-emerald-500" />
                    <span className="font-mono text-xs font-bold text-slate-400">root@reachbnb-core:~# tail -f /var/log/audit.log</span>
                 </div>
              </div>
              <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest">
                 <span className="px-2 py-1 bg-emerald-950 text-emerald-500 animate-pulse border border-emerald-900/50 rounded">● LIVE STREAM</span>
              </div>
           </div>
           <div className="flex-1 overflow-y-auto p-4 md:p-6 font-mono text-[10px] md:text-[11px] space-y-1 custom-scrollbar bg-black/90">
              <div className="min-w-[800px]">
                {logs.map((log) => (
                   <div key={log.id} className="flex gap-4 opacity-80 hover:opacity-100 transition-opacity hover:bg-slate-900/30 p-0.5 rounded">
                      <span className="text-slate-600 w-16 md:w-20 shrink-0 select-none">{log.time}</span>
                      <span className={`font-bold w-16 shrink-0 ${
                         log.status === 'SUCCESS' ? 'text-emerald-500' : 
                         log.status === 'DENIED' ? 'text-red-500' : 'text-orange-500'
                      }`}>{log.status}</span>
                      <span className="text-blue-400 w-28 md:w-36 shrink-0 truncate">[{log.actor}]</span>
                      <span className="text-slate-300 w-28 md:w-32 shrink-0 font-bold truncate">{log.action}</span>
                      <span className="text-slate-500 flex-1 truncate">{log.resource}</span>
                      <span className="text-slate-700 w-20 md:w-24 text-right select-none shrink-0">{log.ip}</span>
                   </div>
                ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'security' && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
               <h3 className="font-black text-white mb-6 flex items-center gap-3 text-lg">
                  <Lock size={20} className="text-red-500"/> RBAC Anomalies (24h)
               </h3>
               <div className="h-64 flex items-end gap-3 border-b border-slate-700/50 pb-4 relative z-10">
                  <div className="w-1/6 bg-slate-800/50 h-[20%] rounded-t-lg mx-auto relative group border-t border-slate-700 hover:bg-slate-700 transition-all"><span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500">Juan</span></div>
                  <div className="w-1/6 bg-slate-800/50 h-[5%] rounded-t-lg mx-auto relative border-t border-slate-700"><span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500">Geo</span></div>
                  <div className="w-1/6 bg-red-500/20 h-[65%] rounded-t-lg mx-auto relative border-t border-red-500 animate-pulse"><span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-red-400">Cluster</span></div>
                  <div className="w-1/6 bg-orange-500/20 h-[40%] rounded-t-lg mx-auto relative border-t border-orange-500"><span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-orange-400">Owner</span></div>
                  <div className="w-1/6 bg-yellow-500/20 h-[80%] rounded-t-lg mx-auto relative border-t border-yellow-500"><span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-yellow-400">Emp</span></div>
                  <div className="w-1/6 bg-slate-800/50 h-[0%] rounded-t-lg mx-auto relative border-t border-slate-700"><span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500">Client</span></div>
               </div>
               <div className="mt-8 bg-red-950/30 border border-red-900/50 p-4 rounded-xl flex gap-3 items-start">
                  <AlertTriangle className="text-red-500 shrink-0" size={18} />
                  <div>
                     <h4 className="text-xs font-bold text-red-400 uppercase">Privilege Escalation Detected</h4>
                     <p className="text-xs text-red-200/70 mt-1">Cluster Managers attempting unauthorized Owner creation outside their designated Geographies.</p>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-2xl">
               <h3 className="font-black text-white mb-6 flex items-center gap-3 text-lg">
                  <AlertTriangle size={20} className="text-orange-500"/> Intrusion Detection
               </h3>
               <div className="space-y-4">
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center group hover:border-red-900/50 transition-colors">
                     <div className="flex gap-4 items-center">
                        <div className="p-3 bg-red-900/20 rounded-lg text-red-500 font-bold border border-red-900/30">SQL</div>
                        <div>
                           <div className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">Injection Attempt</div>
                           <div className="text-xs text-slate-500 font-mono">213.44.12.99 • /api/users/manage</div>
                        </div>
                     </div>
                     <span className="text-[10px] font-black bg-red-950 text-red-500 px-3 py-1.5 rounded-lg border border-red-900">BLOCKED</span>
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center group hover:border-orange-900/50 transition-colors">
                     <div className="flex gap-4 items-center">
                        <div className="p-3 bg-orange-900/20 rounded-lg text-orange-500 font-bold border border-orange-900/30">BF</div>
                        <div>
                           <div className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">Brute Force Login</div>
                           <div className="text-xs text-slate-500 font-mono">Target: juan@reachbnb.com</div>
                        </div>
                     </div>
                     <span className="text-[10px] font-black bg-orange-950 text-orange-500 px-3 py-1.5 rounded-lg border border-orange-900">MITIGATED</span>
                  </div>
               </div>
            </div>
         </div>
      )}

      {activeTab === 'source' && (
         <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 animate-in fade-in h-[600px] flex flex-col shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
               <div className="p-2 bg-blue-500 rounded-lg"><Code size={20} className="text-white"/></div>
               AuditAspect.java <span className="text-slate-600 font-normal text-sm ml-2 font-mono">src/main/java/com/reachbnb/core/audit</span>
            </h3>
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 overflow-auto shadow-inner flex-1 ring-1 ring-white/5">
               <pre className="text-xs font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap">
                  {JAVA_ASPECT_CODE}
               </pre>
            </div>
            <div className="mt-6 flex items-center gap-3 text-xs text-slate-400 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
               <CheckCircle size={14} className="text-emerald-500" />
               <p>
                  This Aspect intercepts all methods annotated with <code className="text-amber-400 bg-amber-950/30 px-1 rounded">@Audit</code> and persists the action, actor, and outcome to the immutable <code className="text-blue-400 bg-blue-950/30 px-1 rounded">audit_logs</code> table asynchronously.
               </p>
            </div>
         </div>
      )}
    </div>
  );
};