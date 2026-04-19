import React from 'react';
import { Globe, Users, Building, Home, User, MessageCircle, ShieldCheck, ShoppingBag, MapPin, UserPlus, Zap, UserCog, Lock, Server, CreditCard, Scale, Calendar, TrendingUp } from 'lucide-react';

const Node = ({ icon: Icon, title, sub, color, badge, glow = false }: { icon: any, title: string, sub: string, color: string, badge?: string, glow?: boolean }) => (
  <div className={`relative flex flex-col items-center p-5 bg-slate-900/90 backdrop-blur-md border ${color} rounded-2xl shadow-xl w-60 transition-all hover:-translate-y-1 hover:shadow-2xl z-10 group ${glow ? 'shadow-[0_0_20px_rgba(234,179,8,0.2)]' : ''}`}>
    {badge && (
      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
        {badge}
      </div>
    )}
    <div className={`p-3 rounded-xl bg-slate-800 mb-3 group-hover:scale-110 transition-transform duration-300 border border-slate-700 ${color.replace('border', 'shadow')}/20 shadow-lg`}>
       <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="font-bold text-sm text-center text-slate-100 mb-1">{title}</h3>
    <p className="text-xs text-slate-400 text-center leading-tight mb-3">{sub}</p>
    <div className="mt-auto flex items-center gap-1.5 bg-slate-950/50 px-2 py-1 rounded-full text-[10px] text-gray-400 border border-slate-800">
      <MessageCircle size={10} className="text-emerald-500" />
      <span>Chat Enabled</span>
    </div>
  </div>
);

const Connector = ({ height = "h-12" }: { height?: string }) => (
  <div className={`w-px ${height} bg-gradient-to-b from-slate-600 via-slate-500 to-slate-600 relative`}>
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-emerald-500 rounded-full animate-ping opacity-50"></div>
  </div>
);

export const ArchitectureView: React.FC = () => {
  return (
    <div className="p-12 flex flex-col items-center justify-start min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Level 0: Juan / Super Admin */}
      <div className="mb-6 text-center flex flex-col items-center relative z-10">
        <h2 className="text-xs font-black tracking-[0.3em] text-amber-500 mb-6 uppercase">System Root Access</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <Node 
            icon={ShieldCheck} 
            title="Juan (Super Admin)" 
            sub="Global Config, DNS, IP, Master Override" 
            color="border-amber-500/50" 
            badge="GOD MODE"
            glow
          />
          <Node 
            icon={UserCog} 
            title="RBAC Controller" 
            sub="Strict Permission Matrix & Hierarchy" 
            color="border-blue-500/50" 
          />
        </div>
      </div>
      
      <Connector height="h-16" />

      {/* SECURITY LAYER INTERCEPTOR */}
      <div className="w-full max-w-5xl bg-red-950/10 border border-dashed border-red-500/30 rounded-3xl p-8 mb-12 relative backdrop-blur-sm z-10">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950 border border-red-500/50 px-6 py-1 rounded-full text-red-400 text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-900/20">
           <Lock size={12}/> SECURITY & AUDIT ASPECT LAYER (AOP)
        </div>
        <div className="text-center text-red-300/40 text-[10px] font-mono mb-8 uppercase tracking-widest">
           Intercepts ALL Requests → Authenticates JWT → Enforces RBAC → Logs to Audit DB
        </div>
        
        {/* Main Hierarchy */}
        <div className="flex flex-col md:flex-row gap-12 items-start justify-center">
          
          {/* Vertical Stack: Geo -> Property */}
          <div className="flex flex-col items-center">
            <Node icon={Globe} title="Geography" sub="Region (e.g., Costa del Sol)" color="border-blue-500/50" />
            <Connector />
            
            <Node icon={Users} title="Cluster" sub="Group of Owners (Comparison Chat)" color="border-indigo-500/50" />
            <Connector />
            
            <Node icon={Building} title="Owner / Company" sub="Manages Team & Assets" color="border-purple-500/50" />
            <Connector />

            {/* Properties & Staff Container */}
            <div className="flex flex-col items-center bg-slate-900/50 p-6 rounded-2xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
               <span className="text-[10px] font-bold text-emerald-500 mb-4 tracking-widest uppercase">Asset Layer</span>
               <Node icon={Home} title="Property" sub="Physical Unit (Staff Ops Chat)" color="border-emerald-500/50" />
               <Connector height="h-8" />
               
               {/* Polymorphic Profiles */}
               <div className="flex flex-col sm:flex-row gap-4 mt-2">
                 <div className="text-center">
                   <Node icon={User} title="Profile A (ES)" sub="Family Target" color="border-pink-500/50" />
                 </div>
                 <div className="text-center">
                   <Node icon={User} title="Profile B (EN)" sub="Digital Nomad" color="border-pink-500/50" />
                 </div>
               </div>
            </div>
          </div>

          {/* Ecosystem Branch (Right Side) */}
          <div className="flex flex-col gap-8 pt-8">
             
             {/* AIRBNB PARITY INTEGRATIONS */}
             <div className="bg-slate-800/50 p-6 rounded-3xl border border-orange-500/30 relative">
               <div className="absolute -top-3 left-6 px-3 py-1 bg-orange-950 border border-orange-500/50 text-orange-400 text-[10px] font-black rounded-full uppercase tracking-widest">
                  Market Parity Engine
               </div>
               <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                    <Calendar className="text-orange-500" size={20} />
                    <div>
                       <div className="text-xs font-bold text-slate-200">Channel Manager (iCal)</div>
                       <div className="text-[10px] text-slate-500">Syncs w/ Booking.com & VRBO</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                    <TrendingUp className="text-emerald-500" size={20} />
                    <div>
                       <div className="text-xs font-bold text-slate-200">Yield Management</div>
                       <div className="text-[10px] text-slate-500">Dynamic Pricing Rules Engine</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                    <Scale className="text-red-500" size={20} />
                    <div>
                       <div className="text-xs font-bold text-slate-200">Resolution Center</div>
                       <div className="text-[10px] text-slate-500">Dispute & Claims Workflow</div>
                    </div>
                 </div>
               </div>
             </div>

             {/* Partners */}
             <div className="flex flex-col items-center relative mt-4">
                <Node icon={ShoppingBag} title="Partner Ecosystem" sub="Invited Vendors (Tours, Cleaning)" color="border-orange-500/50" badge="INVITE ONLY" />
             </div>

             {/* Client Journey Flow */}
             <div className="flex flex-col items-center mt-4 bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50 w-full">
                <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-center">
                  <Zap size={16} /> Client Experience Journey
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                   <div className="flex flex-col items-center p-4 bg-slate-900 border border-slate-700 rounded-xl shadow-lg w-full sm:w-32 text-center">
                      <UserPlus className="text-slate-400 mb-2" size={20} />
                      <span className="text-xs font-bold text-white">Anonymous</span>
                      <span className="text-[10px] text-slate-500 leading-tight mt-1">Chat via Temp Token</span>
                   </div>
                   <div className="w-px h-8 sm:w-8 sm:h-px bg-slate-600"></div>
                   <div className="flex flex-col items-center p-4 bg-slate-900 border border-emerald-500/50 rounded-xl shadow-lg w-full sm:w-32 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500/20 rounded-bl-full"></div>
                      <CreditCard className="text-emerald-400 mb-2" size={20} />
                      <span className="text-xs font-bold text-white">Payment</span>
                      <span className="text-[10px] text-slate-500 leading-tight mt-1">Stripe -&gt; User Created</span>
                   </div>
                   <div className="w-px h-8 sm:w-8 sm:h-px bg-slate-600"></div>
                   <div className="flex flex-col items-center p-4 bg-slate-900 border border-blue-500/50 rounded-xl shadow-lg w-full sm:w-32 text-center">
                      <MapPin className="text-blue-400 mb-2" size={20} />
                      <span className="text-xs font-bold text-white">Dashboard</span>
                      <span className="text-[10px] text-slate-500 leading-tight mt-1">Deep Link & Unlock</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Legend / Details */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-5xl">
         {[
           { title: "Alert Propagation", desc: "Events bubble up: Client → Property → Owner → Cluster → Geo → Juan.", color: "bg-red-500" },
           { title: "Polymorphic Marketing", desc: "1 Physical Property = 10+ Unique Profiles (URLs) with different content.", color: "bg-pink-500" },
           { title: "God Mode (Juan)", desc: "Impersonate any user, update DNS/IP configs via DB, global broadcast.", color: "bg-amber-500" },
           { title: "Airbnb Parity", desc: "iCal Sync, Dynamic Pricing, Disputes, and Identity Verification modules active.", color: "bg-orange-500" }
         ].map((item, i) => (
           <div key={i} className="bg-slate-900/80 backdrop-blur p-4 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                 <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                 <strong className="text-slate-200 text-xs uppercase tracking-wider">{item.title}</strong>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
           </div>
         ))}
      </div>
    </div>
  );
};
