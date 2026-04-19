import React from 'react';
import { testSpecs } from '../data';
import { ShieldCheck, Server, Monitor, Activity, CheckCircle, ChevronRight, Crown } from 'lucide-react';

export const TestSpecs: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-10 border-b border-slate-800 pb-8">
        <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
          <ShieldCheck className="text-emerald-500 w-10 h-10" />
          Production Expectations (God View)
        </h2>
        <p className="text-slate-400 text-lg max-w-4xl leading-relaxed">
          These are the definitive, 101% detailed expectations for every role in the system. 
          This is the "Truth Source" for Juan (Super Admin) to audit the system's compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {testSpecs.map((spec) => (
          <div key={spec.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl ring-1 ring-white/5">
            {/* Header Section */}
            <div className="bg-slate-900/80 p-6 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-4 mb-3">
                <span className={`font-mono px-3 py-1 rounded-lg border text-sm font-bold flex items-center gap-2 ${
                   spec.id === 'ROLE_JUAN' ? 'bg-amber-950/50 border-amber-900 text-amber-500' : 
                   'bg-emerald-950/50 border-emerald-900 text-emerald-400'
                }`}>
                  {spec.id === 'ROLE_JUAN' && <Crown size={14} />}
                  {spec.id}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {spec.title}
                </h3>
              </div>
              <p className="text-base text-slate-300 font-medium pl-1">
                {spec.userStory}
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-700">
              
              {/* Tests Column (Left) */}
              <div className="lg:col-span-4 bg-slate-800/50 p-6 flex flex-col gap-8">
                <div>
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Server className="w-3 h-3" /> Backend Validation
                  </h4>
                  <ul className="space-y-3">
                    {spec.backendTests.map((test, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-blue-200 font-mono bg-blue-950/40 p-2 rounded border border-blue-900/30">
                        <CheckCircle className="w-3 h-3 text-blue-500 shrink-0" />
                        {test}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Monitor className="w-3 h-3" /> Frontend Verification
                  </h4>
                  <ul className="space-y-3">
                    {spec.frontendTests.map((test, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-purple-200 font-mono bg-purple-950/40 p-2 rounded border border-purple-900/30">
                        <CheckCircle className="w-3 h-3 text-purple-500 shrink-0" />
                        {test}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Expectations Column (Right - Main Content) */}
              <div className="lg:col-span-8 bg-slate-900/30 p-8">
                <div className="mb-4 flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-xs">
                   <Activity size={14} /> Critical Success Factors
                </div>
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-inner relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
                   <ul className="space-y-4">
                    {spec.productionExpectations.map((exp, i) => (
                      <li key={i} className="text-sm md:text-base text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                        {exp}
                      </li>
                    ))}
                   </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};