
import React from 'react';
import { modulePrompts } from '../data';
import { LayoutDashboard, Terminal, CheckCircle, BarChart3, Map, MessageSquare, Briefcase, Users, Eye } from 'lucide-react';
import { ViewState } from '../types';
import { 
  GeoDashboard, 
  ClusterDashboard, 
  OwnerDashboard, 
  CollaboratorDashboard, 
  PartnerDashboard, 
  ClientDashboard,
  JuanDashboard
} from './SimulatedDashboards';

interface RoleDashboardViewerProps {
  view: ViewState;
}

const roleMap: Record<string, string> = {
  'dash-juan': 'p23',
  'dash-geo': 'p17',
  'dash-cluster': 'p18',
  'dash-owner': 'p19',
  'dash-collaborator': 'p20',
  'dash-partner': 'p21',
  'dash-client': 'p22',
};

const RoleIcon = ({ role }: { role: string }) => {
  if (role.includes('juan')) return <Eye className="w-8 h-8 text-amber-500" />;
  if (role.includes('geo')) return <Map className="w-8 h-8 text-blue-400" />;
  if (role.includes('cluster')) return <Users className="w-8 h-8 text-indigo-400" />;
  if (role.includes('owner')) return <BarChart3 className="w-8 h-8 text-purple-400" />;
  if (role.includes('collaborator')) return <CheckCircle className="w-8 h-8 text-green-400" />;
  if (role.includes('partner')) return <Briefcase className="w-8 h-8 text-orange-400" />;
  if (role.includes('client')) return <LayoutDashboard className="w-8 h-8 text-pink-400" />;
  return <LayoutDashboard className="w-8 h-8 text-slate-400" />;
};

const DashboardComponentMap: Record<string, React.FC> = {
  'dash-juan': JuanDashboard,
  'dash-geo': GeoDashboard,
  'dash-cluster': ClusterDashboard,
  'dash-owner': OwnerDashboard,
  'dash-collaborator': CollaboratorDashboard,
  'dash-partner': PartnerDashboard,
  'dash-client': ClientDashboard,
};

export const RoleDashboardViewer: React.FC<RoleDashboardViewerProps> = ({ view }) => {
  const promptId = roleMap[view];
  const prompt = modulePrompts.find(p => p.id === promptId);
  const DashboardComponent = DashboardComponentMap[view];
  
  const isMobileSim = view === 'dash-client' || view === 'dash-collaborator';

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col w-full">
      <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-6 shrink-0">
        <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
           <RoleIcon role={view} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
             <h2 className="text-2xl font-black text-white uppercase tracking-tight">{prompt?.title.split(': ')[1] || prompt?.title || 'System Dashboard'}</h2>
             <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-mono shadow-[0_0_10px_rgba(16,185,129,0.2)]">
               LIVE ENVIRONMENT
             </span>
          </div>
          <p className="text-slate-400 text-sm font-medium">{prompt?.description || 'Real-time operational dashboard.'}</p>
        </div>
        <div className="hidden md:block">
           <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 px-3 py-2 rounded-lg border border-emerald-900 uppercase">
             <Terminal size={12} />
             Active Module: {promptId || 'SYS_CORE'}
           </div>
        </div>
      </div>

      <div className={`flex-1 bg-slate-900 border border-slate-700 rounded-[2rem] shadow-2xl relative overflow-hidden`}>
         {DashboardComponent ? <DashboardComponent /> : <div className="p-20 text-center text-slate-500 font-mono uppercase tracking-widest">Interface Not Initialized</div>}
      </div>
    </div>
  );
};
