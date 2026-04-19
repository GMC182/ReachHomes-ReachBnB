
import React, { useState, useEffect } from 'react';
import { db } from '../services/DatabaseService';
import { Task, PropertyProfile, SystemHealth, Property, ServiceRequest, Audit } from '../types';
import { 
  CheckCircle, Play, Clock, MapPin, 
  Settings, Zap, ShieldCheck, ClipboardList, 
  Cpu, Database, Server, Terminal, TrendingUp,
  Box, Camera, Smartphone, AlertTriangle, ListTodo,
  ArrowUpRight, Target, Search, Heart, Star, ArrowRight, Briefcase, Users, Globe, Calendar, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationBell } from './NotificationBell';

// --- SHARED UI COMPONENTS ---

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  type?: 'info' | 'alert' | 'success';
}> = ({ isOpen, onClose, title, children, onConfirm, confirmText = 'Confirm', type = 'info' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
        </div>
        <div className="p-6 text-white/70">
          {children}
        </div>
        <div className="p-6 bg-white/5 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm?.(); onClose(); }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              type === 'alert' ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' :
              type === 'success' ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
              'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const PromptModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
}> = ({ isOpen, onClose, onConfirm, title, message, placeholder, defaultValue = '' }) => {
  const [value, setValue] = React.useState(defaultValue);
  if (!isOpen) return null;
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title} 
      onConfirm={() => onConfirm(value)}
      confirmText="Submit"
    >
      <div className="space-y-4">
        <p className="text-sm">{message}</p>
        <input 
          autoFocus
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>
    </Modal>
  );
};

// --- JUAN DASHBOARD (SUPREME ARCHITECT) ---

export const JuanDashboard: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth>(db.getSystemHealth());
  const [activeTab, setActiveTab] = useState<'INFRA' | 'FINANCE' | 'BUDGETS' | 'STRATEGY'>('INFRA');
  const [logs, setLogs] = useState<string[]>(db.getSystemLogs());
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'alert' | 'success';
    onConfirm?: () => void;
  }>({ isOpen: false, title: '', message: '', type: 'info' });

  const [promptConfig, setPromptConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    placeholder?: string;
    onConfirm: (value: string) => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const showAlert = (title: string, message: string, type: 'info' | 'alert' | 'success' = 'info') => {
    setModalConfig({ isOpen: true, title, message, type });
  };

  const showPrompt = (title: string, message: string, onConfirm: (value: string) => void, placeholder?: string) => {
    setPromptConfig({ isOpen: true, title, message, onConfirm, placeholder });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth({
        ...db.getSystemHealth(),
        cpu: 15 + Math.random() * 10,
        latency: 18 + Math.random() * 15
      });
      setLogs(db.getSystemLogs());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const budgetTasks = db.getAllTasks().filter(t => t.title.includes('Approve Budget') && t.status !== 'DONE');

  const handleIntegrityCheck = () => {
    const result = db.verifyDataIntegrity();
    if (result.status === 'OK') {
      showAlert('Integrity Check Passed', 'All system entities and relationships are valid. Data flow is verified.', 'success');
    } else {
      showAlert('Integrity Check Failed', `Issues found: ${result.issues.join(', ')}`, 'alert');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="h-full bg-[#050505] flex flex-col font-mono text-white/80 relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="p-6 bg-black/40 backdrop-blur-xl border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 z-10">
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10 overflow-x-auto custom-scrollbar w-full md:w-auto">
          <button onClick={() => setActiveTab('INFRA')} className={`px-6 py-2 rounded-md text-xs font-bold tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === 'INFRA' ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'text-white/40 hover:text-white/80'}`}>INFRASTRUCTURE</button>
          <button onClick={() => setActiveTab('FINANCE')} className={`px-6 py-2 rounded-md text-xs font-bold tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === 'FINANCE' ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'text-white/40 hover:text-white/80'}`}>FINANCE_LEDGER</button>
          <button onClick={() => setActiveTab('BUDGETS')} className={`px-6 py-2 rounded-md text-xs font-bold tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === 'BUDGETS' ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'text-white/40 hover:text-white/80'}`}>BUDGET_REQUESTS</button>
          <button onClick={() => setActiveTab('STRATEGY')} className={`px-6 py-2 rounded-md text-xs font-bold tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === 'STRATEGY' ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'text-white/40 hover:text-white/80'}`}>REGIONAL_STRATEGY</button>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleIntegrityCheck}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all"
          >
            <ShieldCheck size={14} /> Verify Integrity
          </button>
          <NotificationBell />
          <div className="flex items-center gap-3 text-[10px] text-amber-500 font-bold tracking-[0.3em] uppercase bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20 whitespace-nowrap">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
            SYSTEM_ONLINE
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 z-10 custom-scrollbar">
        {activeTab === 'INFRA' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center gap-3 mb-6 text-blue-400"><Cpu size={18}/> <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Compute</span></div>
                <div className="text-4xl font-light text-white tracking-wider">{health.cpu.toFixed(1)}<span className="text-xl text-white/30 ml-1">%</span></div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center gap-3 mb-6 text-emerald-400"><Database size={18}/> <span className="text-[10px] font-bold uppercase tracking-[0.2em]">DB_Status</span></div>
                <div className="text-2xl font-light text-emerald-400 uppercase tracking-widest mt-2">{health.dbStatus}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center gap-3 mb-6 text-orange-400"><Zap size={18}/> <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Latency</span></div>
                <div className="text-4xl font-light text-white tracking-wider">{health.latency.toFixed(0)}<span className="text-xl text-white/30 ml-1">ms</span></div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center gap-3 mb-6 text-purple-400"><Server size={18}/> <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Nodes</span></div>
                <div className="text-4xl font-light text-white tracking-wider">{health.activeNodes} <span className="text-sm text-white/30 uppercase tracking-widest ml-1">Active</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center gap-3 mb-6 text-indigo-400"><Globe size={18}/> <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Active Domain</span></div>
                <div className="text-xl font-light text-white tracking-wider truncate">{window.location.hostname}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center gap-3 mb-6 text-pink-400"><Server size={18}/> <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Server IP</span></div>
                <div className="text-xl font-light text-white tracking-wider truncate">{window.location.hostname === 'localhost' ? '127.0.0.1' : 'Dynamic (Traefik)'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <h3 className="text-sm font-bold text-white/70 flex items-center gap-3 uppercase tracking-[0.2em]"><Terminal size={16} className="text-amber-500" /> Kernel Logs</h3>
                  <button 
                    onClick={() => {
                      showPrompt('System Broadcast', 'Enter the message to broadcast to all users:', (msg) => {
                        if (msg) {
                          db.broadcastSystemAlert(msg);
                          showAlert('Success', 'System alert broadcasted to all users.', 'success');
                        }
                      });
                    }}
                    className="px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all"
                  >
                    Broadcast Alert
                  </button>
                </div>
                <div className="bg-black/60 p-6 rounded-xl h-72 overflow-y-auto text-xs space-y-3 font-mono custom-scrollbar border border-white/5 shadow-inner">
                  {logs.map((log, i) => {
                    const isInfo = log.includes('INFO') || log.includes('KERNEL');
                    const isSuccess = log.includes('SUCCESS') || log.includes('DB:');
                    const isWarn = log.includes('WARN') || log.includes('SYNC:');
                    return (
                      <div key={i} className={`${isSuccess ? 'text-emerald-400/80' : isWarn ? 'text-amber-500/80' : isInfo ? 'text-blue-400/80' : 'text-white/40'} flex gap-4`}>
                        <span className="text-white/20 shrink-0">{log.split('] ')[0].replace('[', '')}</span> 
                        <span>{log.split('] ')[1]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2rem] p-10 text-black shadow-[0_20px_50px_rgba(245,158,11,0.2)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/20 blur-3xl rounded-full group-hover:bg-white/30 transition-colors duration-700"></div>
                
                <div className="flex justify-between items-start mb-16 relative z-10">
                  <h3 className="font-black text-xs uppercase tracking-[0.3em] opacity-70">Revenue Stream (24h)</h3>
                  <TrendingUp size={28} className="opacity-50" />
                </div>
                <div className="text-7xl font-light mb-4 tracking-tight relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>${db.getRevenue24h().toLocaleString()}</div>
                <p className="text-sm font-bold opacity-70 uppercase tracking-widest relative z-10">{db.getRevenueGrowth() >= 0 ? '+' : ''}{db.getRevenueGrowth().toFixed(1)}% Growth Period-over-Period</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-2xl">
              <h3 className="text-sm font-bold text-white/70 mb-8 flex items-center gap-3 uppercase tracking-[0.2em]"><Users size={16} className="text-amber-500" /> User Verification Queue</h3>
              <div className="space-y-4">
                {db.getUsers().filter(u => !u.isVerified).map(u => (
                  <div key={u.id} className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-white/5">
                    <div>
                      <p className="text-white font-medium">{u.name}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{u.role} | {u.email}</p>
                    </div>
                    <button 
                      onClick={() => {
                        db.verifyUser(u.id);
                        showAlert('User Verified', `${u.name} has been successfully verified.`, 'success');
                      }}
                      className="px-4 py-2 bg-amber-500 text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 transition-all"
                    >
                      Verify Access
                    </button>
                  </div>
                ))}
                {db.getUsers().filter(u => !u.isVerified).length === 0 && (
                  <p className="text-center py-8 text-white/30 text-xs uppercase tracking-[0.2em]">All users verified.</p>
                )}
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'FINANCE' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-2xl"
          >
            <h3 className="text-sm font-bold text-white/70 mb-8 flex items-center gap-3 uppercase tracking-[0.2em]"><Database size={16} className="text-amber-500" /> Financial Ledger</h3>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm text-slate-400 min-w-[600px]">
                <thead className="text-xs text-slate-500 uppercase bg-slate-950/50 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {db.getAllReservations().slice(0, 15).map(res => (
                    <tr key={res.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-[10px] text-white/60">{res.id}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                          res.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 
                          res.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-400' : 
                          'bg-orange-500/10 text-orange-400'
                        }`}>
                          {res.status === 'COMPLETED' ? 'Settled' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white font-bold tracking-wider">${res.totalPrice.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="text-white/60 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                          <Clock size={12} className="text-amber-500"/> {res.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-mono text-white/40">{res.startDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : activeTab === 'BUDGETS' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-2xl"
          >
            <h3 className="text-sm font-bold text-white/70 mb-8 flex items-center gap-3 uppercase tracking-[0.2em]"><ShieldCheck size={16} className="text-amber-500" /> Budget Approval Queue</h3>
            <div className="space-y-4">
              {budgetTasks.map(t => (
                <div key={t.id} className="flex justify-between items-center p-6 bg-black/40 rounded-xl border border-white/5">
                  <div>
                    <p className="text-white font-medium">{t.title}</p>
                    <p className="text-xs text-white/40 mt-1">{t.description}</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        db.updateTaskStatus(t.id, 'DONE');
                        showAlert('Budget Approved', 'Budget approved and payout task generated for partner.', 'success');
                      }}
                      className="px-4 py-2 bg-emerald-500 text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => {
                        db.updateTaskStatus(t.id, 'DONE'); // Simplified for demo
                        showAlert('Budget Rejected', 'The budget request has been rejected.', 'alert');
                      }}
                      className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {budgetTasks.length === 0 && (
                <p className="text-center py-8 text-white/30 text-xs uppercase tracking-[0.2em]">No pending budget requests.</p>
              )}
            </div>
          </motion.div>
        ) : activeTab === 'STRATEGY' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-2xl"
          >
            <h3 className="text-sm font-bold text-white/70 mb-8 flex items-center gap-3 uppercase tracking-[0.2em]"><Target size={16} className="text-amber-500" /> Regional Strategy & Goals</h3>
            <div className="space-y-4">
              {db.getAllTasks().filter(t => t.title.includes('Achieve Regional Goal')).map(t => (
                <div key={t.id} className="p-6 bg-black/40 rounded-xl border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-white font-medium">{t.title}</p>
                      <p className="text-xs text-white/40 mt-1">{t.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${t.status === 'DONE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>{t.status}</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${db.getRegionalGoalProgress(t.id)}%` }}></div>
                  </div>
                </div>
              ))}
              {db.getAllTasks().filter(t => t.title.includes('Achieve Regional Goal')).length === 0 && (
                <p className="text-center py-8 text-white/30 text-xs uppercase tracking-[0.2em]">No regional goals set yet.</p>
              )}
            </div>
          </motion.div>
        ) : null}
      </div>

      <Modal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
      >
        <p>{modalConfig.message}</p>
      </Modal>

      <PromptModal 
        isOpen={promptConfig.isOpen}
        onClose={() => setPromptConfig({ ...promptConfig, isOpen: false })}
        onConfirm={promptConfig.onConfirm}
        title={promptConfig.title}
        message={promptConfig.message}
        placeholder={promptConfig.placeholder}
      />
    </motion.div>
  );
};

// --- COLLABORATOR DASHBOARD (SHIFT TERMINAL) ---

export const CollaboratorDashboard: React.FC = () => {
  const user = db.getCurrentUser()!;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'SHIFT' | 'INVENTORY' | 'SUPPORT'>('SHIFT');

  // Modal states
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'alert' | 'success';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const [promptConfig, setPromptConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    placeholder: string;
    onConfirm: (value: string) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    placeholder: '',
    onConfirm: () => {}
  });

  const showAlert = (title: string, message: string, type: 'info' | 'alert' | 'success' = 'info', onConfirm?: () => void) => {
    setModalConfig({ isOpen: true, title, message, type, onConfirm });
  };

  const showPrompt = (title: string, message: string, onConfirm: (value: string) => void, placeholder: string = '') => {
    setPromptConfig({ isOpen: true, title, message, placeholder, onConfirm });
  };

  useEffect(() => {
    setTasks(db.getTasks(user.id));
    const interval = setInterval(() => setTasks(db.getTasks(user.id)), 2000);
    return () => clearInterval(interval);
  }, [user.id]);

  const handleStatusUpdate = (tid: string, status: Task['status']) => {
    db.updateTaskStatus(tid, status);
    setTasks([...db.getTasks(user.id)]);
  };

  const handleToggleChecklist = (tid: string, cid: string) => {
    db.toggleChecklistItem(tid, cid);
    setTasks([...db.getTasks(user.id)]);
  };

  const pendingTasks = tasks.filter(t => t.status !== 'DONE');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="h-full bg-[#050505] flex flex-col font-sans text-white/80 relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="p-6 bg-black/40 backdrop-blur-xl border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0 z-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 rounded-2xl flex items-center justify-center border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <ClipboardList size={28} />
          </div>
          <div>
            <h2 className="text-white font-light text-2xl tracking-[0.1em]" style={{ fontFamily: "'Playfair Display', serif" }}>Trusted Collaborators <span className="text-emerald-500 italic">Hub</span></h2>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Worker: {user.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <NotificationBell />
          <div className="flex bg-white/5 p-1.5 rounded-xl border border-white/10 overflow-x-auto custom-scrollbar">
            {['SHIFT', 'INVENTORY', 'SUPPORT'].map(t => (
              <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-2.5 rounded-lg text-[10px] font-bold tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${activeTab === t ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-white/40 hover:text-white/80'}`}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 z-10 custom-scrollbar">
        {activeTab === 'SHIFT' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto space-y-12"
          >
            {/* Shift Status Control */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <div>
                  <h3 className="text-white font-light text-2xl mb-2 tracking-wide">Shift Control</h3>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Current Status: <span className="text-emerald-400">{user.shiftStatus?.replace('_', ' ') || 'OFF SHIFT'}</span></p>
                </div>
                <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 overflow-x-auto w-full md:w-auto">
                  {(['ON_SHIFT', 'AVAILABLE', 'BUSY', 'OFF_SHIFT'] as const).map(s => (
                    <button 
                      key={s}
                      onClick={() => {
                        db.updateUserShiftStatus(user.id, s);
                        showAlert('Status Updated', `Your status has been updated to ${s.replace('_', ' ')}.`, 'success');
                      }}
                      className={`px-4 py-2.5 rounded-xl text-[8px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap ${user.shiftStatus === s ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-white/40 hover:text-white/80'}`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="py-32 text-center bg-white/5 backdrop-blur-md rounded-[2rem] border border-dashed border-white/20 shadow-2xl">
                <CheckCircle size={64} className="text-emerald-500/50 mx-auto mb-6" />
                <p className="text-white/60 font-bold uppercase tracking-[0.3em] text-xs">All assignments finalized.</p>
              </div>
            ) : (
              pendingTasks.map((task, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  key={task.id} 
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="p-8 md:p-10 space-y-8 relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${task.type === 'CLEANING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]'}`}>
                          {task.type === 'CLEANING' ? <Zap size={24} /> : <Settings size={24} />}
                        </div>
                        <div>
                          <h4 className="text-white font-light text-2xl tracking-wide">{task.title}</h4>
                          <p className="text-xs text-white/40 font-bold uppercase tracking-[0.2em] flex items-center gap-2 mt-2"><MapPin size={12} className="text-emerald-500"/> {task.propertyName || 'Villa Rosa'}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border ${task.status === 'IN_PROGRESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse' : 'bg-white/5 text-white/40 border-white/10'}`}>{task.status}</span>
                    </div>
                    
                    <p className="text-sm text-white/60 leading-relaxed bg-black/40 p-6 rounded-2xl border border-white/5 font-light tracking-wide">{task.description}</p>

                    {task.status === 'TODO' ? (
                      <button onClick={() => handleStatusUpdate(task.id, 'IN_PROGRESS')} className="w-full py-5 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
                        <Play size={18} fill="currentColor" /> Start Work Order
                      </button>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-3">
                           {task.checklist?.map(item => (
                             <button key={item.id} onClick={() => handleToggleChecklist(task.id, item.id)} className={`p-5 rounded-2xl border flex items-center gap-5 transition-all duration-300 text-left ${item.completed ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/5'}`}>
                               <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${item.completed ? 'bg-emerald-500 text-black scale-110 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'border border-white/20 text-transparent'}`}><ShieldCheck size={16} /></div>
                               <span className={`text-sm font-light tracking-wide ${item.completed ? 'text-emerald-400' : 'text-white/60'}`}>{item.text}</span>
                             </button>
                           ))}
                        </div>
                        <button 
                          onClick={() => handleStatusUpdate(task.id, 'DONE')} 
                          disabled={!task.checklist?.every(i => i.completed)}
                          className="w-full py-5 bg-emerald-500 text-black rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(16,185,129,0.2)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_10px_30px_rgba(16,185,129,0.4)]"
                        >
                          Submit Final Sign-off
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'INVENTORY' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
            <h3 className="text-white font-light text-2xl mb-8 flex items-center gap-4 tracking-wide relative z-10"><Box size={28} className="text-blue-400" /> Supply Registry</h3>
            <div className="space-y-4 relative z-10">
               {db.getPropertyInventory(db.getOwnerProperties(user.parentId || '')[0]?.id || 'p1').map((inv, i) => (
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.4, delay: i * 0.1 }}
                   key={inv.item} 
                   className="flex justify-between items-center p-5 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                 >
                   <span className="text-sm font-light text-white/80 tracking-wide">{inv.item}</span>
                   <div className="flex items-center gap-4">
                     <span className="text-xs font-mono text-white/40">{inv.qty}</span>
                     <span className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] border ${inv.status === 'OK' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : inv.status === 'LOW' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{inv.status}</span>
                   </div>
                 </motion.div>
               ))}
            </div>
            <button 
              onClick={() => {
                const pid = db.getOwnerProperties(user.parentId || '')[0]?.id || 'p1';
                showPrompt('Replenishment Request', 'What item needs replenishment?', (item) => {
                  if (item) {
                    db.requestReplenishment(user.id, item, pid);
                    showAlert('Request Sent', `Request for ${item} sent to Cluster Manager.`, 'success');
                  }
                });
              }}
              className="w-full mt-4 py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300 relative z-10"
            >
              Request Replenishment
            </button>
            <button 
              onClick={() => {
                const pid = db.getOwnerProperties(user.parentId || '')[0]?.id || 'p1';
                showPrompt('Resource Request', 'What resources do you need?', (items) => {
                  if (items) {
                    showPrompt('Urgency', 'Urgency (LOW, MEDIUM, HIGH):', (urgency) => {
                      const finalUrgency = (urgency || 'MEDIUM').toUpperCase() as any;
                      db.requestResources(user.id, pid, items, finalUrgency);
                      showAlert('Request Sent', `Resource request for "${items}" sent to Cluster Manager.`, 'success');
                    }, 'MEDIUM');
                  }
                });
              }}
              className="w-full mt-4 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 relative z-10"
            >
              Request Resources
            </button>
          </motion.div>
        )}

        {activeTab === 'SUPPORT' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
              <h3 className="text-2xl font-light text-white mb-8 tracking-wide relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>Report <span className="text-emerald-500 italic">Maintenance Issue</span></h3>
              <div className="space-y-6 relative z-10">
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] block mb-3">Property</label>
                  <select id="sr-property" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 outline-none transition-colors">
                    {db.getProperties().map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] block mb-3">Priority</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => (
                      <button key={p} onClick={(e) => {
                        const btns = e.currentTarget.parentElement?.querySelectorAll('button');
                        btns?.forEach(b => b.classList.remove('bg-emerald-500', 'text-black'));
                        btns?.forEach(b => b.classList.add('bg-white/5', 'text-white/40'));
                        e.currentTarget.classList.remove('bg-white/5', 'text-white/40');
                        e.currentTarget.classList.add('bg-emerald-500', 'text-black');
                        e.currentTarget.setAttribute('data-priority', p);
                      }} className={`py-3 rounded-xl text-[10px] font-bold tracking-widest transition-all ${p === 'MEDIUM' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/40'}`} data-priority={p === 'MEDIUM' ? 'MEDIUM' : ''}>{p}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] block mb-3">Description</label>
                  <textarea id="sr-desc" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 outline-none transition-colors h-32 resize-none" placeholder="Describe the issue in detail..."></textarea>
                </div>
                <button onClick={() => {
                  const pid = (document.getElementById('sr-property') as HTMLSelectElement).value;
                  const desc = (document.getElementById('sr-desc') as HTMLTextAreaElement).value;
                  const priority = (document.querySelector('[data-priority]:not([data-priority=""])') as HTMLElement)?.getAttribute('data-priority') as any || 'MEDIUM';
                  const prop = db.getProperties().find(p => p.id === pid);
                  const partner = db.getUsers().find(u => u.role === 'PARTNER');
                  
                  if (prop && partner && desc) {
                    db.createServiceRequest({
                      propertyId: pid,
                      propertyName: prop.title,
                      partnerId: partner.id,
                      title: 'Maintenance Alert',
                      description: desc,
                      priority: priority
                    });
                    showAlert('Request Sent', 'Maintenance request dispatched to vendor.', 'success');
                    (document.getElementById('sr-desc') as HTMLTextAreaElement).value = '';
                  }
                }} className="w-full py-5 bg-emerald-500 text-black rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:bg-emerald-400 transition-all">Dispatch Vendor</button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-6 bg-black/40 backdrop-blur-xl border-t border-white/5 text-[10px] font-mono text-white/30 flex justify-between z-10">
        <span className="tracking-[0.2em]">TERM: COLLAB_V3.1</span>
        <span className="text-emerald-500/70 tracking-[0.2em] flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> SECURE_LINK_ACTIVE</span>
      </div>

      <Modal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
      >
        <p>{modalConfig.message}</p>
      </Modal>

      <PromptModal 
        isOpen={promptConfig.isOpen}
        onClose={() => setPromptConfig({ ...promptConfig, isOpen: false })}
        onConfirm={promptConfig.onConfirm}
        title={promptConfig.title}
        message={promptConfig.message}
        placeholder={promptConfig.placeholder}
      />
    </motion.div>
  );
};

// --- OWNER DASHBOARD ---

const ProfileCard: React.FC<{ profile: PropertyProfile }> = ({ profile }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-2xl group hover:border-blue-500/50 transition-all duration-500 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    <div className="flex justify-between items-start mb-8 relative z-10">
      <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]"><Target size={24} /></div>
      <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-white/60 text-[9px] font-bold rounded-full uppercase tracking-[0.2em]">{profile.language}</span>
    </div>
    <h4 className="text-white font-light text-2xl tracking-wide mb-2 relative z-10">{profile.name}</h4>
    <p className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-6 relative z-10">Focus: {profile.targetAudience}</p>
    <p className="text-white/50 text-sm leading-relaxed font-light relative z-10 line-clamp-3">{profile.description}</p>
  </div>
);

export const OwnerDashboard: React.FC = () => {
  const [subView, setSubView] = useState<'OPS' | 'PROFILES' | 'PROPERTIES' | 'RESERVATIONS' | 'REVIEWS'>('OPS');
  const user = db.getCurrentUser()!;
  const [profiles, setProfiles] = useState<PropertyProfile[]>([]);
  const [props, setProps] = useState<Property[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // Modal states
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'alert' | 'success';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const [promptConfig, setPromptConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    placeholder: string;
    onConfirm: (value: string) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    placeholder: '',
    onConfirm: () => {}
  });

  const showAlert = (title: string, message: string, type: 'info' | 'alert' | 'success' = 'info', onConfirm?: () => void) => {
    setModalConfig({ isOpen: true, title, message, type, onConfirm });
  };

  const showPrompt = (title: string, message: string, onConfirm: (value: string) => void, placeholder: string = '') => {
    setPromptConfig({ isOpen: true, title, message, placeholder, onConfirm });
  };

  useEffect(() => {
    setProfiles(db.getOwnerProfiles(user.id));
    const ownerProps = db.getOwnerProperties(user.id);
    setProps(ownerProps);
    
    // Get all reservations for owner's properties
    const allReservations = ownerProps.flatMap(p => 
      db.getPropertyReservations(p.id)
    );
    setReservations(allReservations);

    // Get all reviews for owner's properties
    const allReviews = db.getProperties().filter(p => p.ownerId === user.id).flatMap(p => 
      db.getListingData(p.id).reviews
    );
    setReviews(allReviews);
  }, [user.id]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="h-full bg-[#050505] flex flex-col overflow-hidden font-sans text-white/80 relative"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="p-8 md:px-12 bg-black/40 backdrop-blur-xl border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-20 shrink-0">
        <div className="w-full md:w-auto text-center md:text-left">
          <h1 className="text-3xl font-light tracking-[0.1em] text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Owner <span className="text-blue-500 italic">Studio</span></h1>
          <p className="text-white/40 text-[10px] mt-2 font-bold uppercase tracking-[0.3em]">Asset Management Protocol</p>
        </div>
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <NotificationBell />
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner overflow-x-auto custom-scrollbar">
            {[
              { id: 'OPS', icon: TrendingUp, label: 'Real-time' },
              { id: 'PROFILES', icon: Target, label: 'Profiles' },
              { id: 'PROPERTIES', icon: Briefcase, label: 'Assets' },
              { id: 'RESERVATIONS', icon: Calendar, label: 'Reservations' },
              { id: 'REVIEWS', icon: Star, label: 'Reviews' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setSubView(tab.id as any)} className={`px-6 py-3 rounded-xl text-[10px] font-bold transition-all duration-300 flex items-center gap-3 uppercase tracking-[0.2em] whitespace-nowrap ${subView === tab.id ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}>
                <tab.icon size={16}/> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 md:p-12 z-10 custom-scrollbar">
        {subView === 'OPS' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                   <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Total Net Income</div>
                   <div className="text-5xl font-light text-white tracking-tight relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>${props.reduce((acc, p) => acc + (p.netIncome || 0), 0).toLocaleString()}<span className="text-2xl text-white/30">.00</span></div>
                   <div className="mt-8 flex items-center gap-3 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><ArrowUpRight size={16}/> Real-time ledger</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                   <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Total Expenses</div>
                   <div className="text-5xl font-light text-red-400 tracking-tight relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>${props.reduce((acc, p) => acc + (p.expenses || 0), 0).toLocaleString()}<span className="text-2xl text-white/30">.00</span></div>
                   <div className="mt-8 flex items-center gap-3 text-red-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><TrendingUp size={16}/> Maintenance & Fees</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                   <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Live Occupancy</div>
                   <div className="text-5xl font-light text-blue-400 tracking-tight relative z-10">{db.getOwnerOccupancy(user.id).toFixed(0)}<span className="text-3xl text-blue-400/50">%</span></div>
                   <div className="mt-8 flex items-center gap-3 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><Users size={16}/> {reservations.filter(r => r.status === 'CHECKED_IN').length} active guests</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                   <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Staff Alerts</div>
                   <div className="text-5xl font-light text-orange-400 tracking-tight relative z-10">{db.getAllTasks().filter(t => t.status !== 'DONE' && props.some(p => p.id === t.propertyId)).length} <span className="text-2xl text-orange-400/50 uppercase tracking-widest">Actions</span></div>
                   <div className="mt-8 flex items-center gap-3 text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><Clock size={16}/> Pending maintenance</div>
                </div>
             </div>
          </motion.div>
        )}
        
        {subView === 'PROFILES' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {profiles.map((p, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                key={p.id}
              >
                <ProfileCard profile={p} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {subView === 'PROPERTIES' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            {props.map((p, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                key={p.id} 
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 items-center shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative w-full md:w-64 h-48 shrink-0 rounded-2xl overflow-hidden shadow-2xl">
                  <img src={p.image} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="flex-1 relative z-10">
                  <h4 className="text-3xl font-light text-white tracking-wide mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{p.title}</h4>
                  <p className="text-white/30 text-[10px] font-mono uppercase tracking-[0.2em] mb-6">PHYS_UUID: {p.id}</p>
                  <div className="flex flex-wrap gap-3">
                    {p.assignedProfileIds.map(pid => {
                      const profile = db.getOwnerProfiles(user.id).find(prof => prof.id === pid);
                      return (
                        <span key={pid} className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 rounded-full uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                          {profile?.name || 'Active Profile'}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="shrink-0 relative z-10 flex flex-col gap-4">
                  <span className="px-6 py-3 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-2xl border border-emerald-500/20 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(16,185,129,0.1)] text-center">{p.status}</span>
                  <button 
                    onClick={() => {
                      db.requestPerformanceReport(user.id, p.id);
                      showAlert('Report Requested', `Performance inquiry sent for ${p.title}. Cluster Manager will generate a report.`, 'success');
                    }}
                    className="px-6 py-3 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-2xl border border-blue-500/20 uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all"
                  >
                    Request Report
                  </button>
                  <button 
                    onClick={() => {
                      showPrompt('Open Dispute', 'Reason for dispute:', (reason) => {
                        if (reason) {
                          showPrompt('Dispute Type', 'Dispute Type (REVIEW, DAMAGE, FINANCIAL):', (type) => {
                            const finalType = (type || 'FINANCIAL').toUpperCase() as any;
                            db.openDispute(user.id, p.id, reason, finalType);
                            showAlert('Dispute Opened', `Dispute opened for ${p.title}. Cluster Manager notified.`, 'success');
                          }, 'FINANCIAL');
                        }
                      });
                    }}
                    className="px-6 py-3 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-2xl border border-red-500/20 uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all"
                  >
                    Open Dispute
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {subView === 'RESERVATIONS' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            {reservations.length === 0 ? (
              <div className="text-center py-20 text-white/40">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl font-light tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>No Reservations Yet</p>
              </div>
            ) : (
              reservations.map((r, i) => {
                const prop = props.find(p => p.id === r.propertyId);
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    key={r.id} 
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 items-center shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div className="flex-1 relative z-10">
                      <h4 className="text-2xl font-light text-white tracking-wide mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{prop?.title || 'Unknown Property'}</h4>
                      <p className="text-white/30 text-[10px] font-mono uppercase tracking-[0.2em] mb-6">RES_ID: {r.id}</p>
                      <div className="flex flex-wrap gap-6 mb-4">
                        <div>
                          <p className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-1">Check-in</p>
                          <p className="text-white font-medium">{new Date(r.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-1">Check-out</p>
                          <p className="text-white font-medium">{new Date(r.endDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-1">Guests</p>
                          <p className="text-white font-medium">{r.guests}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-1">Total</p>
                          <p className="text-white font-medium">${r.totalPrice}</p>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 relative z-10">
                      <span className="px-6 py-3 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-2xl border border-emerald-500/20 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(16,185,129,0.1)]">{r.status}</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

        {subView === 'REVIEWS' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            {reviews.map((rev, i) => {
              const prop = props.find(p => p.id === rev.propertyId);
              return (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  key={rev.id} 
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                      <h4 className="text-xl font-light text-white tracking-wide mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{prop?.title}</h4>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Guest: {rev.clientName} | Date: {rev.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-white/70 text-sm italic mb-8 relative z-10">"{rev.comment}"</p>
                  <button 
                    onClick={() => {
                      showPrompt('Respond to Review', 'Enter your response to the guest:', (response) => {
                        if (response) {
                          db.respondToReview(user.id, rev.id, response);
                          showAlert('Response Sent', 'Your response has been sent to the guest.', 'success');
                        }
                      });
                    }}
                    className="px-6 py-3 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-2xl border border-blue-500/20 uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all relative z-10"
                  >
                    Respond to Review
                  </button>
                </motion.div>
              );
            })}
            {reviews.length === 0 && (
              <p className="text-center py-20 text-white/30 text-xs uppercase tracking-[0.2em]">No reviews yet.</p>
            )}
          </motion.div>
        )}
      </div>

      <Modal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
      >
        <p>{modalConfig.message}</p>
      </Modal>

      <PromptModal 
        isOpen={promptConfig.isOpen}
        onClose={() => setPromptConfig({ ...promptConfig, isOpen: false })}
        onConfirm={promptConfig.onConfirm}
        title={promptConfig.title}
        message={promptConfig.message}
        placeholder={promptConfig.placeholder}
      />
    </motion.div>
  );
};

// --- CLIENT MARKETPLACE ---

export const ClientDashboard: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'TRIPS'>('EXPLORE');
  const user = db.getCurrentUser()!;
  const reservations = db.getClientReservations(user.id);

  // Modal states
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'alert' | 'success';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const [promptConfig, setPromptConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    placeholder: string;
    onConfirm: (value: string) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    placeholder: '',
    onConfirm: () => {}
  });

  const showAlert = (title: string, message: string, type: 'info' | 'alert' | 'success' = 'info', onConfirm?: () => void) => {
    setModalConfig({ isOpen: true, title, message, type, onConfirm });
  };

  const showPrompt = (title: string, message: string, onConfirm: (value: string) => void, placeholder: string = '') => {
    setPromptConfig({ isOpen: true, title, message, placeholder, onConfirm });
  };

  useEffect(() => {
    setProperties(db.getProperties(query));
  }, [query]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="h-full bg-[#0a0a0a] flex flex-col overflow-hidden font-sans text-white relative"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="https://cdn.pixabay.com/video/2020/05/25/40130-425027885_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#0a0a0a]"></div>
      </div>

      <div className="px-6 md:px-10 py-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0 bg-black/40 backdrop-blur-2xl z-30 w-full">
        <h1 className="text-3xl font-light tracking-[0.2em] shrink-0 text-center md:text-left w-full md:w-auto" style={{ fontFamily: "'Playfair Display', serif" }}>REACH<span className="text-amber-500 font-serif italic">HOMES</span></h1>
        
        <div className="flex items-center gap-6">
          <NotificationBell />
          <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10 shrink-0 overflow-x-auto custom-scrollbar w-full md:w-auto">
            <button onClick={() => setActiveTab('EXPLORE')} className={`px-6 py-2 rounded-md text-xs font-bold tracking-[0.2em] transition-all whitespace-nowrap flex-1 md:flex-none ${activeTab === 'EXPLORE' ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'text-white/40 hover:text-white/80'}`}>EXPLORE</button>
            <button onClick={() => setActiveTab('TRIPS')} className={`px-6 py-2 rounded-md text-xs font-bold tracking-[0.2em] transition-all whitespace-nowrap flex-1 md:flex-none ${activeTab === 'TRIPS' ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'text-white/40 hover:text-white/80'}`}>MY TRIPS</button>
          </div>
        </div>

        {activeTab === 'EXPLORE' && (
          <div className="w-full max-w-xl relative group mt-4 md:mt-0">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="text-amber-500/50 group-focus-within:text-amber-500 transition-colors" size={20}/>
            </div>
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder="Search exclusive destinations..." 
              className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-full py-4 pl-16 pr-6 text-sm font-medium text-white shadow-sm outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all placeholder:text-white/30 placeholder:tracking-widest"
            />
          </div>
        )}

        <div className="hidden md:flex items-center gap-4 shrink-0 ml-auto">
           <div className="text-right">
              <div className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest">Welcome back</div>
              <div className="text-sm font-medium text-white tracking-wide">{user.name}</div>
           </div>
           <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] border border-amber-300/50">
             {user.name.charAt(0)}
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-10 z-10 relative">
        {activeTab === 'EXPLORE' ? (
          properties.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4"
            >
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                <Search size={40} className="text-amber-500/50" />
              </div>
              <h3 className="text-2xl font-light tracking-widest text-white" style={{ fontFamily: "'Playfair Display', serif" }}>No properties found</h3>
              <p className="text-white/50 font-medium tracking-wide">Refine your search to discover exclusive stays.</p>
              <button onClick={() => setQuery('')} className="mt-4 px-8 py-3 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-amber-500 hover:text-black transition-all">Clear Search</button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {properties.map((p, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                  key={p.id} 
                  className="group cursor-pointer flex flex-col h-full" 
                  onClick={() => window.location.hash = `#listing/${p.id}`}
                >
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 shadow-2xl group-hover:shadow-amber-500/10 transition-all duration-500 border border-white/5">
                    <img src={p.image} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" alt={p.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                    <button className="absolute top-4 right-4 p-3 bg-black/40 hover:bg-amber-500 backdrop-blur-md rounded-full text-white hover:text-black transition-all duration-300 z-10 border border-white/10" onClick={(e) => { e.stopPropagation(); /* Add to favorites logic */ }}>
                      <Heart size={18} className="transition-colors"/>
                    </button>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="flex items-center gap-1 text-sm font-bold text-white bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <Star size={12} className="fill-amber-500 text-amber-500"/> 
                        {p.rating}
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-light text-white tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>${p.pricePerNight}</span>
                        <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest ml-1">/ night</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1 px-2">
                    <h4 className="text-xl font-light text-white leading-tight line-clamp-1 mb-2 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>{p.title}</h4>
                    <p className="text-amber-500/70 text-xs font-bold uppercase tracking-widest line-clamp-1">{p.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-light mb-10 text-white tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Upcoming Trips</h2>
            {reservations.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                <Calendar size={48} className="text-white/20 mx-auto mb-6" />
                <h3 className="text-2xl font-light text-white tracking-widest mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>No upcoming trips</h3>
                <p className="text-white/50 font-medium mb-8">Time to dust off your bags and start planning your next adventure.</p>
                <button onClick={() => setActiveTab('EXPLORE')} className="px-8 py-3 bg-amber-500 text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.2)]">Start Exploring</button>
              </div>
            ) : (
              <div className="grid gap-8">
                {reservations.map((res, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={res.id}
                    className="flex flex-col md:flex-row gap-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl hover:border-amber-500/30 transition-colors cursor-pointer"
                    onClick={() => window.location.hash = `#listing/${res.propertyId}`}
                  >
                    <div className="w-full md:w-72 h-48 rounded-2xl overflow-hidden shrink-0">
                      <img src={res.property?.image} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt={res.property?.title} />
                    </div>
                    <div className="flex flex-col justify-between flex-1 py-2">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-light text-white tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>{res.property?.title}</h3>
                          <div className="flex gap-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                              res.status === 'CHECKED_IN' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              res.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                              res.status === 'COMPLETED' ? 'bg-white/10 text-white/40 border-white/20' :
                              'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}>{res.status}</span>
                            
                            {res.status === 'CONFIRMED' && (
                              <>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    db.checkInReservation(res.id);
                                    showAlert('Check-in Successful', 'Check-in successful! Enjoy your stay.', 'success');
                                  }}
                                  className="px-3 py-1 bg-emerald-500 text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                >
                                  Check-in
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    showAlert('Cancel Trip', 'Are you sure you want to cancel this trip?', 'alert', () => {
                                      db.cancelReservation(res.id);
                                      showAlert('Trip Cancelled', 'Trip cancelled. Staff and Owner have been notified.', 'success');
                                    });
                                  }}
                                  className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                >
                                  Cancel Trip
                                </button>
                              </>
                            )}

                            {res.status === 'CHECKED_IN' && (
                              <div className="flex gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    showPrompt('Concierge Request', 'What service do you need? (e.g., Extra towels, Late check-out, Taxi)', (request) => {
                                      if (request) {
                                        db.requestConcierge(user.id, res.propertyId, request);
                                        showAlert('Request Sent', 'Request sent to our staff. We will assist you shortly.', 'success');
                                      }
                                    });
                                  }}
                                  className="px-3 py-1 bg-blue-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-blue-400 transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                >
                                  Concierge
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    db.checkOutReservation(res.id);
                                    showAlert('Check-out Successful', 'Check-out successful! We hope to see you again soon.', 'success');
                                  }}
                                  className="px-3 py-1 bg-amber-500 text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 transition-all shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                                >
                                  Check-out
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    showPrompt('Report Issue', 'Describe the issue:', (desc) => {
                                      if (desc) {
                                        showPrompt('Priority', 'Priority (LOW, MEDIUM, HIGH, CRITICAL):', (priority) => {
                                          const finalPriority = (priority || 'MEDIUM').toUpperCase() as any;
                                          db.reportGuestIssue(user.id, res.propertyId, desc, finalPriority);
                                          showAlert('Issue Reported', 'Issue reported. Our team has been notified.', 'success');
                                        }, 'MEDIUM');
                                      }
                                    });
                                  }}
                                  className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                >
                                  Report Issue
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-white/50 text-sm font-medium flex items-center gap-2 mb-6"><MapPin size={14} className="text-amber-500"/> {res.property.location}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div>
                            <div className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest mb-1">Check-in</div>
                            <div className="text-white font-medium">{new Date(res.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest mb-1">Check-out</div>
                            <div className="text-white font-medium">{new Date(res.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest mb-1">Guests</div>
                            <div className="text-white font-medium">{res.guests}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest mb-1">Total</div>
                            <div className="text-white font-medium">${res.totalPrice}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- DASHBOARDS ---
export const GeoDashboard: React.FC = () => {
  const user = db.getCurrentUser()!;
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'RESERVATIONS'>('OVERVIEW');

  // Modal states
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'alert' | 'success';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const [promptConfig, setPromptConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    placeholder: string;
    onConfirm: (value: string) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    placeholder: '',
    onConfirm: () => {}
  });

  const showAlert = (title: string, message: string, type: 'info' | 'alert' | 'success' = 'info', onConfirm?: () => void) => {
    setModalConfig({ isOpen: true, title, message, type, onConfirm });
  };

  const showPrompt = (title: string, message: string, onConfirm: (value: string) => void, placeholder: string = '') => {
    setPromptConfig({ isOpen: true, title, message, placeholder, onConfirm });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="h-full bg-[#050505] flex flex-col font-sans text-white/80 relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="p-8 md:px-12 bg-black/40 backdrop-blur-xl border-b border-white/5 flex flex-col md:flex-row justify-between items-center z-20 shrink-0 gap-4 text-center md:text-left">
        <div>
          <h1 className="text-3xl font-light tracking-[0.1em] text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Geo <span className="text-blue-500 italic">Command</span></h1>
          <p className="text-white/40 text-[10px] mt-2 font-bold uppercase tracking-[0.3em]">Regional Overview: {user.name}</p>
        </div>
        <div className="flex items-center gap-6">
          <NotificationBell />
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            <button onClick={() => setActiveTab('OVERVIEW')} className={`px-4 py-2 rounded-md text-[10px] font-bold tracking-widest transition-all ${activeTab === 'OVERVIEW' ? 'bg-blue-500 text-white' : 'text-white/40 hover:text-white/80'}`}>OVERVIEW</button>
            <button onClick={() => setActiveTab('RESERVATIONS')} className={`px-4 py-2 rounded-md text-[10px] font-bold tracking-widest transition-all ${activeTab === 'RESERVATIONS' ? 'bg-blue-500 text-white' : 'text-white/40 hover:text-white/80'}`}>RESERVATIONS</button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 z-10 custom-scrollbar">
        {activeTab === 'OVERVIEW' ? (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Total Regional Revenue</div>
                <div className="text-5xl font-light text-white tracking-tight relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>${db.getAllReservations().reduce((acc, r) => acc + r.totalPrice, 0).toLocaleString()}</div>
                <div className="mt-8 flex items-center gap-3 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><TrendingUp size={16}/> +8% this month</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Active Clusters</div>
                <div className="text-5xl font-light text-blue-400 tracking-tight relative z-10">{db.getClusterManagers().length}</div>
                <div className="mt-8 flex items-center gap-3 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><MapPin size={16}/> Regional coverage</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Critical Alerts</div>
                <div className="text-5xl font-light text-orange-400 tracking-tight relative z-10">{db.getNotifications(user.id).filter(n => n.type === 'ALERT').length}</div>
                <div className="mt-8 flex items-center gap-3 text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><AlertTriangle size={16}/> Requires attention</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
              <h3 className="text-white font-light text-2xl mb-8 flex items-center gap-4 tracking-wide relative z-10"><Globe size={28} className="text-blue-400" /> Cluster Performance</h3>
              <div className="space-y-4 relative z-10">
                 {db.getClusterManagers().map((cm, i) => {
                   const metrics = db.getClusterMetrics(cm.id);
                   return (
                     <motion.div 
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                       key={cm.id} 
                       className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                     >
                       <div>
                         <span className="text-lg font-light text-white tracking-wide block mb-1">{cm.name}'s Cluster</span>
                         <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Revenue: <span className="text-white/80">${Math.round(metrics.revenue).toLocaleString()}</span> | Occupancy: <span className="text-white/80">{metrics.occupancy.toFixed(1)}%</span></span>
                       </div>
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border ${metrics.occupancy > 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]'}`}>OPTIMAL</span>
                     </motion.div>
                   );
                 })}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-white font-light text-2xl flex items-center gap-4 tracking-wide"><Terminal size={28} className="text-blue-400" /> Regional SOPs</h3>
                <button 
                  onClick={() => {
                    showPrompt('Publish SOP', 'Enter SOP Title:', (title) => {
                      if (title) {
                        showPrompt('SOP Description', `Enter description for "${title}":`, (desc) => {
                          if (desc) {
                            db.createTemplate({
                              title,
                              description: desc,
                              type: 'CLEANING',
                              standardDurationMinutes: 60,
                              createdBy: user.id
                            });
                            showAlert('SOP Published', `SOP "${title}" published. All Cluster Managers have been assigned a review task.`, 'success');
                          }
                        });
                      }
                    });
                  }}
                  className="px-6 py-3 bg-blue-500 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-400 transition-all"
                >
                  Publish New SOP
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {db.getTemplates().map(t => (
                  <div key={t.id} className="p-6 bg-black/40 rounded-2xl border border-white/5">
                    <h4 className="text-white font-light text-lg mb-2">{t.title}</h4>
                    <p className="text-white/40 text-xs line-clamp-2">{t.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 shadow-2xl"
          >
            <h3 className="text-white font-light text-2xl mb-8 flex items-center gap-4 tracking-wide"><Calendar size={28} className="text-blue-400" /> Regional Reservations</h3>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm text-slate-400 min-w-[600px]">
                <thead className="text-xs text-slate-500 uppercase bg-slate-950/50 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Property</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {db.getAllReservations().map(res => {
                    const prop = db.getProperties().find(p => p.id === res.propertyId);
                    const guest = db.getUsers().find(u => u.id === res.clientId);
                    return (
                      <tr key={res.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{prop?.title || 'Unknown'}</td>
                        <td className="px-6 py-4 text-white/60">{guest?.name || 'Guest'}</td>
                        <td className="px-6 py-4 text-[10px] font-mono text-white/40">{res.startDate} to {res.endDate}</td>
                        <td className="px-6 py-4 text-white font-bold">${res.totalPrice}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                            res.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 
                            res.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-400' : 
                            'bg-orange-500/10 text-orange-400'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export const ClusterDashboard: React.FC = () => {
  const user = db.getCurrentUser()!;
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'RESERVATIONS'>('OVERVIEW');

  // Modal states
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'alert' | 'success';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const [promptConfig, setPromptConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    placeholder: string;
    onConfirm: (value: string) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    placeholder: '',
    onConfirm: () => {}
  });

  const showAlert = (title: string, message: string, type: 'info' | 'alert' | 'success' = 'info', onConfirm?: () => void) => {
    setModalConfig({ isOpen: true, title, message, type, onConfirm });
  };

  const showPrompt = (title: string, message: string, onConfirm: (value: string) => void, placeholder: string = '') => {
    setPromptConfig({ isOpen: true, title, message, placeholder, onConfirm });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="h-full bg-[#050505] flex flex-col font-sans text-white/80 relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="p-8 md:px-12 bg-black/40 backdrop-blur-xl border-b border-white/5 flex flex-col md:flex-row justify-between items-center z-20 shrink-0 gap-4 text-center md:text-left">
        <div>
          <h1 className="text-3xl font-light tracking-[0.1em] text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Cluster <span className="text-indigo-500 italic">Trusted Collaborators</span></h1>
          <p className="text-white/40 text-[10px] mt-2 font-bold uppercase tracking-[0.3em]">Local Node: {user.name}</p>
        </div>
        <div className="flex items-center gap-6">
          <NotificationBell />
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            <button onClick={() => setActiveTab('OVERVIEW')} className={`px-4 py-2 rounded-md text-[10px] font-bold tracking-widest transition-all ${activeTab === 'OVERVIEW' ? 'bg-indigo-500 text-white' : 'text-white/40 hover:text-white/80'}`}>OVERVIEW</button>
            <button onClick={() => setActiveTab('RESERVATIONS')} className={`px-4 py-2 rounded-md text-[10px] font-bold tracking-widest transition-all ${activeTab === 'RESERVATIONS' ? 'bg-indigo-500 text-white' : 'text-white/40 hover:text-white/80'}`}>RESERVATIONS</button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 z-10 custom-scrollbar">
        {activeTab === 'OVERVIEW' ? (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Total Reservations</div>
                <div className="text-5xl font-light text-indigo-400 tracking-tight relative z-10">{db.getAllReservations().length}</div>
                <div className="mt-8 flex items-center gap-3 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><Calendar size={16}/> System-wide</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Properties Under Management</div>
                <div className="text-5xl font-light text-white tracking-tight relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>{db.getProperties().length}</div>
                <div className="mt-8 flex items-center gap-3 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><Briefcase size={16}/> 100% Online</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Active Staff</div>
                <div className="text-5xl font-light text-indigo-400 tracking-tight relative z-10">{db.getUsers().filter(u => u.role === 'COLLABORATOR').length}</div>
                <div className="mt-8 flex items-center gap-3 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><Users size={16}/> {db.getUsers().filter(u => u.role === 'COLLABORATOR' && u.shiftStatus === 'ON_SHIFT').length} currently on shift</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Pending Tasks</div>
                <div className="text-5xl font-light text-orange-400 tracking-tight relative z-10">{db.getAllTasks().filter(t => t.status !== 'DONE').length}</div>
                <div className="mt-8 flex items-center gap-3 text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><ListTodo size={16}/> {db.getAllTasks().filter(t => t.status !== 'DONE' && t.type === 'ADMIN').length} priority tasks</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
              <h3 className="text-white font-light text-2xl mb-8 flex items-center gap-4 tracking-wide relative z-10"><Briefcase size={28} className="text-indigo-400" /> Partner Network</h3>
              <div className="space-y-4 relative z-10">
                 {db.getUsers().filter(u => u.role === 'PARTNER').map((p, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                     key={p.id} 
                     className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                   >
                     <div>
                       <span className="text-lg font-light text-white tracking-wide block mb-1">{p.name}</span>
                       <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Reliability: <span className="text-emerald-400">{p.reliabilityScore || 85}%</span> | Status: <span className="text-white/80">VERIFIED</span></span>
                     </div>
                     <div className="flex gap-2">
                       <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                         <div className="h-full bg-emerald-500" style={{ width: `${p.reliabilityScore || 85}%` }}></div>
                       </div>
                     </div>
                   </motion.div>
                 ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
              <h3 className="text-white font-light text-2xl mb-8 flex items-center gap-4 tracking-wide relative z-10"><Users size={28} className="text-indigo-400" /> Staff Activity</h3>
              <div className="space-y-4 relative z-10">
                 {db.getUsers().filter(u => u.role === 'COLLABORATOR').map((s, i) => {
                   const activeTask = db.getAllTasks().find(t => t.assigneeId === s.id && t.status === 'IN_PROGRESS');
                   return (
                     <motion.div 
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                       key={s.id} 
                       className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                     >
                       <div>
                         <span className="text-lg font-light text-white tracking-wide block mb-1">{s.name} <span className="text-white/40 font-bold text-[10px] uppercase tracking-[0.2em] ml-3">({s.department || 'Trusted Collaborators'})</span></span>
                         <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Current Task: <span className="text-white/80">{activeTask?.title || 'None'}</span></span>
                       </div>
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border ${s.shiftStatus === 'ON_SHIFT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'}`}>{s.shiftStatus || 'OFF_SHIFT'}</span>
                     </motion.div>
                   );
                 })}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-white font-light text-2xl flex items-center gap-4 tracking-wide"><ShieldCheck size={28} className="text-emerald-400" /> Quality Audits</h3>
                <button 
                  onClick={() => {
                    showPrompt('Request Budget', 'Enter Property ID (e.g., p1):', (pid) => {
                      if (pid) {
                        showPrompt('Budget Amount', 'Enter Budget Amount ($):', (amount) => {
                          if (amount) {
                            showPrompt('Reason', 'Reason for budget request:', (reason) => {
                              if (reason) {
                                db.requestBudget(user.id, pid, parseInt(amount), reason);
                                showAlert('Budget Requested', 'Budget request sent to Juan (SuperAdmin).', 'success');
                              }
                            });
                          }
                        });
                      }
                    });
                  }}
                  className="px-6 py-3 bg-indigo-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-400 transition-all"
                >
                  Request Budget
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                 {db.getProperties().map((p, i) => (
                   <div key={p.id} className="p-6 bg-black/40 rounded-2xl border border-white/5 flex justify-between items-center">
                     <div>
                       <span className="text-lg font-light text-white block mb-1">{p.title}</span>
                       <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Last Audit: 10 days ago</span>
                     </div>
                     <div className="flex gap-3">
                       <button onClick={() => {
                         db.createAudit({
                           propertyId: p.id,
                           propertyName: p.title,
                           auditorId: user.id,
                           score: 95,
                           status: 'PASSED',
                           notes: 'Property in excellent condition.'
                         });
                          showAlert('Audit Passed', `Audit PASSED for ${p.title}`, 'success');
                       }} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all">Pass</button>
                        <button onClick={() => {
                          showPrompt('Audit Score', 'Enter audit score (0-100):', (scoreStr) => {
                            const score = parseInt(scoreStr || '0');
                            showPrompt('Failure Notes', 'Enter failure notes:', (notes) => {
                              db.createAudit({
                                propertyId: p.id,
                                propertyName: p.title,
                                auditorId: user.id,
                                score: score,
                                status: 'FAILED',
                                notes: notes || 'General quality failure'
                              });
                              showAlert('Audit Failed', `Audit FAILED for ${p.title}. Owner and staff notified.`, 'alert');
                            }, 'General quality failure');
                          }, '0');
                        }} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Fail</button>
                     </div>
                   </div>
                 ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
              <h3 className="text-white font-light text-2xl mb-8 flex items-center gap-4 tracking-wide relative z-10"><AlertTriangle size={28} className="text-red-400" /> Dispute Mediation</h3>
              <div className="space-y-4 relative z-10">
                {db.getAllTasks().filter(t => t.title.includes('Mediate Dispute')).map((t, i) => {
                  const owner = db.getUsers().find(u => u.name === t.title.split(': ')[1]);
                  return (
                    <div key={t.id} className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-white/5">
                      <div>
                        <span className="text-lg font-light text-white block mb-1">{t.title}</span>
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Property: <span className="text-white/80">{t.propertyName}</span> | Status: <span className="text-white/80">{t.status}</span></span>
                        <p className="text-xs text-white/60 mt-2">{t.description}</p>
                      </div>
                      <div className="flex gap-3">
                        {t.status !== 'DONE' && (
                          <button 
                            onClick={() => {
                              db.updateTaskStatus(t.id, 'DONE');
                              showAlert('Dispute Resolved', 'Dispute resolved. Owner and Geo Manager notified.', 'success');
                            }}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-400 transition-all"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {db.getAllTasks().filter(t => t.title.includes('Mediate Dispute')).length === 0 && (
                  <p className="text-center py-8 text-white/30 text-xs uppercase tracking-[0.2em]">No active disputes.</p>
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
              <h3 className="text-white font-light text-2xl mb-8 flex items-center gap-4 tracking-wide relative z-10"><ListTodo size={28} className="text-indigo-400" /> Task Management</h3>
              <div className="space-y-4 relative z-10">
                {db.getAllTasks().filter(t => !t.title.includes('Mediate Dispute')).map((t, i) => {
                  const assignee = db.getUsers().find(u => u.id === t.assigneeId);
                  return (
                    <div key={t.id} className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-white/5">
                      <div>
                        <span className="text-lg font-light text-white block mb-1">{t.title}</span>
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Assignee: <span className="text-white/80">{assignee?.name || 'Unassigned'}</span> | Property: <span className="text-white/80">{t.propertyName}</span></span>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            showPrompt('Reassign Task', 'Enter New Assignee ID (e.g., u5):', (newId) => {
                              if (newId) {
                                db.reassignTask(t.id, newId);
                                showAlert('Task Reassigned', 'Task reassigned successfully.', 'success');
                              }
                            });
                          }}
                          className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all"
                        >
                          Reassign
                        </button>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border ${t.status === 'DONE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>{t.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 shadow-2xl"
          >
            <h3 className="text-white font-light text-2xl mb-8 flex items-center gap-4 tracking-wide"><Calendar size={28} className="text-indigo-400" /> Cluster Reservations</h3>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm text-slate-400 min-w-[600px]">
                <thead className="text-xs text-slate-500 uppercase bg-slate-950/50 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Property</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {db.getAllReservations().map(res => {
                    const prop = db.getProperties().find(p => p.id === res.propertyId);
                    const guest = db.getUsers().find(u => u.id === res.clientId);
                    return (
                      <tr key={res.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{prop?.title || 'Unknown'}</td>
                        <td className="px-6 py-4 text-white/60">{guest?.name || 'Guest'}</td>
                        <td className="px-6 py-4 text-[10px] font-mono text-white/40">{res.startDate} to {res.endDate}</td>
                        <td className="px-6 py-4 text-white font-bold">${res.totalPrice}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                            res.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 
                            res.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-400' : 
                            'bg-orange-500/10 text-orange-400'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
export const PartnerDashboard: React.FC = () => {
  const user = db.getCurrentUser()!;
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  // Modal states
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'alert' | 'success';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const [promptConfig, setPromptConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    placeholder: string;
    onConfirm: (value: string) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    placeholder: '',
    onConfirm: () => {}
  });

  const showAlert = (title: string, message: string, type: 'info' | 'alert' | 'success' = 'info', onConfirm?: () => void) => {
    setModalConfig({ isOpen: true, title, message, type, onConfirm });
  };

  const showPrompt = (title: string, message: string, onConfirm: (value: string) => void, placeholder: string = '') => {
    setPromptConfig({ isOpen: true, title, message, placeholder, onConfirm });
  };

  useEffect(() => {
    setRequests(db.getServiceRequests(user.id));
    const interval = setInterval(() => setRequests(db.getServiceRequests(user.id)), 2000);
    return () => clearInterval(interval);
  }, [user.id]);

  const handleStatusUpdate = (srid: string, status: ServiceRequest['status']) => {
    db.updateServiceRequestStatus(srid, status);
    setRequests([...db.getServiceRequests(user.id)]);
  };

  const activeRequests = requests.filter(r => r.status !== 'COMPLETED');
  const completedRequests = requests.filter(r => r.status === 'COMPLETED');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="h-full bg-[#050505] flex flex-col font-sans text-white/80 relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="p-8 md:px-12 bg-black/40 backdrop-blur-xl border-b border-white/5 flex flex-col md:flex-row justify-between items-center z-20 shrink-0 gap-4 text-center md:text-left">
        <div>
          <h1 className="text-3xl font-light tracking-[0.1em] text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Partner <span className="text-orange-500 italic">Hub</span></h1>
          <p className="text-white/40 text-[10px] mt-2 font-bold uppercase tracking-[0.3em]">Vendor: {user.name}</p>
        </div>
        <NotificationBell />
      </div>
      <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 z-10 custom-scrollbar">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Active Jobs</div>
            <div className="text-5xl font-light text-white tracking-tight relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>{activeRequests.length}</div>
            <div className="mt-8 flex items-center gap-3 text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><Briefcase size={16}/> {activeRequests.filter(r => r.priority === 'HIGH' || r.priority === 'CRITICAL').length} urgent</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Completed (MTD)</div>
            <div className="text-5xl font-light text-blue-400 tracking-tight relative z-10">{completedRequests.length}</div>
            <div className="mt-8 flex items-center gap-3 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><ListTodo size={16}/> All standards met</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Reliability Score</div>
            <div className="text-5xl font-light text-emerald-400 tracking-tight relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>{user.reliabilityScore || 85}<span className="text-2xl text-emerald-400/30">%</span></div>
            <div className="mt-8 flex items-center gap-3 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><ShieldCheck size={16}/> Top Tier Status</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Total Earnings (YTD)</div>
            <div className="text-5xl font-light text-emerald-400 tracking-tight relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>${db.getPartnerEarnings(user.id).toLocaleString()}</div>
            <div className="mt-8 flex items-center gap-3 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"><TrendingUp size={16}/> +15% vs last year</div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none"></div>
          <h3 className="text-white font-light text-2xl mb-8 flex items-center gap-4 tracking-wide relative z-10"><Settings size={28} className="text-orange-400" /> Active Service Requests</h3>
          <div className="space-y-4 relative z-10">
             {activeRequests.length === 0 ? (
               <div className="text-center py-12 text-white/40 font-bold uppercase tracking-widest">No active requests</div>
             ) : (
               activeRequests.map((r, i) => (
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                   key={r.id} 
                   className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                 >
                   <div>
                     <div className="flex items-center gap-3 mb-1">
                       <span className="text-lg font-light text-white tracking-wide">{r.title}</span>
                       <span className="text-white/40 font-bold text-[10px] uppercase tracking-[0.2em]">({r.propertyName})</span>
                       {r.priority === 'CRITICAL' && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[8px] font-bold animate-pulse">CRITICAL</span>}
                     </div>
                     <p className="text-xs text-white/60 mb-2">{r.description}</p>
                     <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">ID: <span className="text-white/80">{r.id}</span> | Date: <span className="text-white/80">{r.date}</span></span>
                   </div>
                   <div className="flex items-center gap-4">
                     {r.status === 'PENDING' && (
                       <div className="flex gap-2">
                         <button onClick={() => handleStatusUpdate(r.id, 'ACCEPTED')} className="px-4 py-2 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-colors">Accept Job</button>
                         <button onClick={() => handleStatusUpdate(r.id, 'REJECTED')} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors">Reject</button>
                       </div>
                     )}
                     {r.status === 'ACCEPTED' && (
                       <button onClick={() => handleStatusUpdate(r.id, 'IN_PROGRESS')} className="px-4 py-2 bg-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-400 transition-colors">Start Work</button>
                     )}
                     {r.status === 'IN_PROGRESS' && (
                       <button onClick={() => handleStatusUpdate(r.id, 'COMPLETED')} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-400 transition-colors">Mark Completed</button>
                     )}
                     <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border ${
                       r.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 
                       r.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 
                       'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]'
                     }`}>{r.status.replace('_', ' ')}</span>
                   </div>
                 </motion.div>
               ))
             )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
          <h3 className="text-white font-light text-2xl mb-8 flex items-center gap-4 tracking-wide relative z-10"><CheckCircle size={28} className="text-emerald-400" /> Completed Jobs & Invoicing</h3>
          <div className="space-y-4 relative z-10">
             {completedRequests.length === 0 ? (
               <div className="text-center py-12 text-white/40 font-bold uppercase tracking-widest">No completed jobs yet</div>
             ) : (
               completedRequests.map((r, i) => (
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                   key={r.id} 
                   className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-white/5"
                 >
                   <div>
                     <h4 className="text-lg font-light text-white mb-1">{r.title}</h4>
                     <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Completed on: {r.date}</p>
                   </div>
                   <button 
                     onClick={() => {
                        showPrompt('Submit Invoice', 'Enter Invoice Amount ($):', (amountStr) => {
                          const amount = parseInt(amountStr || '0');
                          if (amount > 0) {
                            db.submitInvoice(user.id, r.id, amount);
                            showAlert('Invoice Submitted', `Invoice for $${amount} submitted.`, 'success');
                          }
                        }, '0');
                      }}
                     className="px-6 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                   >
                     Submit Invoice
                   </button>
                 </motion.div>
               ))
             )}
          </div>
        </motion.div>
      </div>

      <Modal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
      >
        <p>{modalConfig.message}</p>
      </Modal>

      <PromptModal 
        isOpen={promptConfig.isOpen}
        onClose={() => setPromptConfig({ ...promptConfig, isOpen: false })}
        onConfirm={promptConfig.onConfirm}
        title={promptConfig.title}
        message={promptConfig.message}
        placeholder={promptConfig.placeholder}
      />
    </motion.div>
  );
};

export const SimulatedDashboards = { JuanDashboard, GeoDashboard, ClusterDashboard, OwnerDashboard, CollaboratorDashboard, PartnerDashboard, ClientDashboard };
