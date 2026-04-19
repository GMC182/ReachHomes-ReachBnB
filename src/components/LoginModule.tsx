
import React, { useState } from 'react';
import { ViewState, UserRole } from '../types';
import { db } from '../services/DatabaseService';
import { ShieldCheck, ChevronDown, ArrowLeft, Smartphone, Building2, User as UserIcon, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps { onLogin: (targetView: ViewState) => void; }

export const AuthSelector: React.FC<LoginProps> = ({ onLogin }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-6 md:p-12 relative overflow-hidden font-sans">
    {/* Atmospheric Background */}
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-900/10 blur-[150px] rounded-full mix-blend-screen"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop')] opacity-[0.05] bg-cover bg-center mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]"></div>
    </div>

    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 text-center mb-12 md:mb-24 mt-12 md:mt-0"
    >
      <h1 className="text-5xl md:text-8xl font-light text-white tracking-[0.1em] mb-4 md:mb-6 drop-shadow-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
        REACH<span className="text-amber-500 italic font-serif">HOMES</span>
      </h1>
      <div className="flex items-center justify-center gap-2 md:gap-4">
        <div className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-amber-500/50"></div>
        <p className="text-amber-500/90 uppercase tracking-[0.2em] md:tracking-[0.4em] text-[8px] md:text-[10px] font-bold">The Pinnacle of Asset Management</p>
        <div className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-amber-500/50"></div>
      </div>
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Security Notice: Simulated Environment - Plain Text Passwords</span>
        </div>
      </div>
    </motion.div>

    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8 w-full max-w-[1400px]">
      {[
        { id: 'auth-client', label: 'Guest Portal', desc: 'Exclusive Stays', icon: UserIcon, color: 'from-pink-500/20 to-transparent', border: 'hover:border-pink-500/50', iconColor: 'text-pink-400', shadow: 'hover:shadow-[0_0_40px_rgba(244,114,182,0.15)]' },
        { id: 'auth-collaborator', label: 'Trusted Collaborators', desc: 'Trusted Collaborators', icon: Smartphone, color: 'from-emerald-500/20 to-transparent', border: 'hover:border-emerald-500/50', iconColor: 'text-emerald-400', shadow: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]' },
        { id: 'auth-partner', label: 'Partner Hub', desc: 'Vendor Access', icon: Briefcase, color: 'from-orange-500/20 to-transparent', border: 'hover:border-orange-500/50', iconColor: 'text-orange-400', shadow: 'hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]' },
        { id: 'auth-owner', label: 'Owner Studio', desc: 'Asset Portfolio', icon: Building2, color: 'from-blue-500/20 to-transparent', border: 'hover:border-blue-500/50', iconColor: 'text-blue-400', shadow: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]' },
        { id: 'auth-admin', label: 'Admin Root', desc: 'System Core', icon: ShieldCheck, color: 'from-amber-500/20 to-transparent', border: 'hover:border-amber-500/50', iconColor: 'text-amber-400', shadow: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]' }
      ].map((p, i) => (
        <motion.button 
          key={p.id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => onLogin(p.id as any)} 
          className={`group relative p-6 md:p-10 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl md:rounded-[2rem] transition-all duration-500 hover:-translate-y-2 ${p.border} ${p.shadow} overflow-hidden flex flex-col items-center justify-center text-center h-48 md:h-72`}
        >
          <div className={`absolute inset-0 bg-gradient-to-b ${p.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10 mb-4 md:mb-8 p-4 md:p-6 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-2xl">
            <p.icon size={24} strokeWidth={1.5} className={`${p.iconColor} opacity-70 group-hover:opacity-100 transition-opacity duration-500 md:w-8 md:h-8`} />
          </div>
          
          <h3 className="text-white font-light text-lg md:text-xl tracking-wide relative z-10 mb-2 md:mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{p.label}</h3>
          <p className="text-white/50 text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold relative z-10 group-hover:text-white/80 transition-colors duration-500">{p.desc}</p>
        </motion.button>
      ))}
    </div>
  </div>
);

export const AdminLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('JUAN');
  const [selectedEmail, setSelectedEmail] = useState('juan@reachhomes.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const geoManagers = db.getGeoManagers();
  const clusterManagers = db.getClusterManagers();
  const admins = db.getAdmins();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'JUAN') {
      setSelectedEmail('juan@reachhomes.com');
    } else if (newRole === 'ADMIN') {
      setSelectedEmail(admins[0]?.email || '');
    } else if (newRole === 'GEO_MANAGER') {
      setSelectedEmail(geoManagers[0]?.email || '');
    } else if (newRole === 'CLUSTER_MANAGER') {
      setSelectedEmail(clusterManagers[0]?.email || '');
    } else {
      setSelectedEmail('');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail) {
      setError('Please select a user');
      return;
    }
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      if (db.login(selectedEmail, role)) {
        onLogin(role === 'JUAN' || role === 'ADMIN' ? 'dash-juan' : role === 'GEO_MANAGER' ? 'dash-geo' : 'dash-cluster');
      } else {
        setError('Invalid credentials or user not found');
        setIsLoading(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-black"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-black/60 backdrop-blur-2xl p-6 md:p-10 rounded-3xl shadow-2xl border border-amber-500/20 z-10"
      >
        <button onClick={() => onLogin('auth-select')} className="text-amber-500/60 mb-8 flex items-center gap-2 font-bold uppercase tracking-widest text-xs hover:text-amber-400 transition-colors"><ArrowLeft size={16}/> Back</button>
        <div className="mb-10 text-center">
          <ShieldCheck size={32} className="text-amber-500 mx-auto mb-4 opacity-80" />
          <h1 className="font-light text-3xl tracking-[0.2em] text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>SYSTEM ROOT</h1>
          <div className="h-px w-12 bg-amber-500/50 mx-auto"></div>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="text-red-400 text-sm font-bold bg-red-950/50 p-3 rounded-xl border border-red-500/20 text-center">{error}</div>}
          <div className="space-y-2">
            <label htmlFor="identity-scope" className="text-[10px] text-amber-500/70 font-bold uppercase tracking-widest ml-2">Identity Scope</label>
            <select id="identity-scope" value={role} onChange={e => handleRoleChange(e.target.value as any)} className="w-full bg-black/40 border border-amber-500/20 p-4 rounded-xl text-white outline-none focus:border-amber-500/50 transition-colors backdrop-blur-sm appearance-none">
              <option value="JUAN">JUAN (Super Admin)</option>
              <option value="ADMIN">ADMIN (System Admin)</option>
              <option value="GEO_MANAGER">Geo Manager</option>
              <option value="CLUSTER_MANAGER">Cluster Manager</option>
            </select>
          </div>

          {role === 'ADMIN' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
              <label htmlFor="select-admin" className="text-[10px] text-amber-500/70 font-bold uppercase tracking-widest ml-2">Select Admin</label>
              <select id="select-admin" value={selectedEmail} onChange={e => setSelectedEmail(e.target.value)} className="w-full bg-black/40 border border-amber-500/20 p-4 rounded-xl text-white outline-none focus:border-amber-500/50 transition-colors backdrop-blur-sm appearance-none">
                <option value="">Choose User</option>
                {admins.map(u => <option key={u.id} value={u.email}>{u.name}</option>)}
              </select>
            </motion.div>
          )}

          {role === 'GEO_MANAGER' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
              <label htmlFor="select-geo" className="text-[10px] text-amber-500/70 font-bold uppercase tracking-widest ml-2">Select Geo Manager</label>
              <select id="select-geo" value={selectedEmail} onChange={e => setSelectedEmail(e.target.value)} className="w-full bg-black/40 border border-amber-500/20 p-4 rounded-xl text-white outline-none focus:border-amber-500/50 transition-colors backdrop-blur-sm appearance-none">
                <option value="">Choose User</option>
                {geoManagers.map(u => <option key={u.id} value={u.email}>{u.name}</option>)}
              </select>
            </motion.div>
          )}

          {role === 'CLUSTER_MANAGER' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
              <label htmlFor="select-cluster" className="text-[10px] text-amber-500/70 font-bold uppercase tracking-widest ml-2">Select Cluster Manager</label>
              <select id="select-cluster" value={selectedEmail} onChange={e => setSelectedEmail(e.target.value)} className="w-full bg-black/40 border border-amber-500/20 p-4 rounded-xl text-white outline-none focus:border-amber-500/50 transition-colors backdrop-blur-sm appearance-none">
                <option value="">Choose User</option>
                {clusterManagers.map(u => <option key={u.id} value={u.email}>{u.name}</option>)}
              </select>
            </motion.div>
          )}

          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-[10px] text-amber-500/70 font-bold uppercase tracking-widest ml-2">Password</label>
            <input id="admin-password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-amber-500/20 p-4 rounded-xl text-white outline-none focus:border-amber-500/50 transition-colors backdrop-blur-sm" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-4 mt-4 bg-amber-500/10 border border-amber-500/50 text-amber-400 font-bold tracking-widest uppercase text-sm rounded-xl hover:bg-amber-500 hover:text-black transition-all shadow-[0_0_20px_rgba(245,158,11,0.1)] disabled:opacity-70 flex items-center justify-center gap-2">
            {isLoading ? <span className="animate-spin text-xl">⟳</span> : 'ESTABLISH CONNECTION'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export const ClientLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('guest@gmail.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      if (db.login(email, 'CLIENT')) {
        onLogin('dash-client');
      } else {
        setError('Invalid credentials');
        setIsLoading(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <img src="https://picsum.photos/seed/luxury-villa/1920/1080" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-40" alt="Background" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl p-6 md:p-10 rounded-3xl shadow-2xl border border-white/20 z-10"
      >
        <button onClick={() => onLogin('auth-select')} className="text-white/60 mb-8 flex items-center gap-2 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"><ArrowLeft size={16}/> Back</button>
        <div className="mb-10 text-center">
          <h1 className="font-light text-4xl tracking-widest text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>GUEST</h1>
          <div className="h-px w-12 bg-white/30 mx-auto"></div>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="text-red-400 text-sm font-bold bg-red-950/50 p-3 rounded-xl border border-red-500/20 text-center">{error}</div>}
          <div className="space-y-2">
            <label htmlFor="client-email" className="text-[10px] text-white/50 font-bold uppercase tracking-widest ml-2">Email Address</label>
            <input id="client-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-white/50 transition-colors backdrop-blur-sm" />
          </div>
          <div className="space-y-2">
            <label htmlFor="client-password" className="text-[10px] text-white/50 font-bold uppercase tracking-widest ml-2">Password</label>
            <input id="client-password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-white/50 transition-colors backdrop-blur-sm" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-4 mt-4 bg-white text-black font-bold tracking-widest uppercase text-sm rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-70 flex items-center justify-center gap-2">
            {isLoading ? <span className="animate-spin text-xl">⟳</span> : 'SIGN IN'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export const CollaboratorLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('pepe@staff.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      if (db.login(email, 'COLLABORATOR')) {
        onLogin('dash-collaborator');
      } else {
        setError('Invalid credentials');
        setIsLoading(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-black"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-black/60 backdrop-blur-2xl p-6 md:p-10 rounded-3xl shadow-2xl border border-emerald-500/20 z-10"
      >
        <button onClick={() => onLogin('auth-collaborator')} className="text-emerald-500/60 mb-8 flex items-center gap-2 font-bold uppercase tracking-widest text-xs hover:text-emerald-400 transition-colors"><ArrowLeft size={16}/> Back</button>
        <div className="mb-10 text-center">
          <Smartphone size={32} className="text-emerald-500 mx-auto mb-4 opacity-80" />
          <h1 className="font-light text-3xl tracking-[0.2em] text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>TRUSTED COLLABORATORS</h1>
          <div className="h-px w-12 bg-emerald-500/50 mx-auto"></div>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="text-red-400 text-sm font-bold bg-red-950/50 p-3 rounded-xl border border-red-500/20 text-center">{error}</div>}
          <div className="space-y-2">
            <label htmlFor="staff-id" className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest ml-2">Staff ID / Email</label>
            <input id="staff-id" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/40 border border-emerald-500/20 p-4 rounded-xl text-white outline-none focus:border-emerald-500/50 transition-colors backdrop-blur-sm" />
          </div>
          <div className="space-y-2">
            <label htmlFor="staff-pin" className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest ml-2">PIN / Password</label>
            <input id="staff-pin" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-emerald-500/20 p-4 rounded-xl text-white outline-none focus:border-emerald-500/50 transition-colors backdrop-blur-sm" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-4 mt-4 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 font-bold tracking-widest uppercase text-sm rounded-xl hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)] disabled:opacity-70 flex items-center justify-center gap-2">
            {isLoading ? <span className="animate-spin text-xl">⟳</span> : 'AUTHENTICATE'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export const PartnerLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('partner@vendor.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      if (db.login(email, 'PARTNER')) {
        onLogin('dash-partner');
      } else {
        setError('Invalid credentials');
        setIsLoading(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-black"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-black/60 backdrop-blur-2xl p-6 md:p-10 rounded-3xl shadow-2xl border border-orange-500/20 z-10"
      >
        <button onClick={() => onLogin('auth-select')} className="text-orange-500/60 mb-8 flex items-center gap-2 font-bold uppercase tracking-widest text-xs hover:text-orange-400 transition-colors"><ArrowLeft size={16}/> Back</button>
        <div className="mb-10 text-center">
          <Briefcase size={32} className="text-orange-500 mx-auto mb-4 opacity-80" />
          <h1 className="font-light text-3xl tracking-[0.2em] text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>PARTNER</h1>
          <div className="h-px w-12 bg-orange-500/50 mx-auto"></div>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="text-red-400 text-sm font-bold bg-red-950/50 p-3 rounded-xl border border-red-500/20 text-center">{error}</div>}
          <div className="space-y-2">
            <label htmlFor="partner-email" className="text-[10px] text-orange-500/70 font-bold uppercase tracking-widest ml-2">Vendor Email</label>
            <input id="partner-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/40 border border-orange-500/20 p-4 rounded-xl text-white outline-none focus:border-orange-500/50 transition-colors backdrop-blur-sm" />
          </div>
          <div className="space-y-2">
            <label htmlFor="partner-password" className="text-[10px] text-orange-500/70 font-bold uppercase tracking-widest ml-2">Password</label>
            <input id="partner-password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-orange-500/20 p-4 rounded-xl text-white outline-none focus:border-orange-500/50 transition-colors backdrop-blur-sm" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-4 mt-4 bg-orange-500/10 border border-orange-500/50 text-orange-400 font-bold tracking-widest uppercase text-sm rounded-xl hover:bg-orange-500 hover:text-black transition-all shadow-[0_0_20px_rgba(249,115,22,0.1)] disabled:opacity-70 flex items-center justify-center gap-2">
            {isLoading ? <span className="animate-spin text-xl">⟳</span> : 'ACCESS PORTAL'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export const OwnerLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('owner@luxury.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      if (db.login(email, 'OWNER')) {
        onLogin('dash-owner');
      } else {
        setError('Invalid credentials');
        setIsLoading(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-black/60 backdrop-blur-2xl p-6 md:p-10 rounded-3xl shadow-2xl border border-purple-500/20 z-10"
      >
        <button onClick={() => onLogin('auth-select')} className="text-purple-500/60 mb-8 flex items-center gap-2 font-bold uppercase tracking-widest text-xs hover:text-purple-400 transition-colors"><ArrowLeft size={16}/> Back</button>
        <div className="mb-10 text-center">
          <Building2 size={32} className="text-purple-500 mx-auto mb-4 opacity-80" />
          <h1 className="font-light text-3xl tracking-[0.2em] text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>OWNER</h1>
          <div className="h-px w-12 bg-purple-500/50 mx-auto"></div>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="text-red-400 text-sm font-bold bg-red-950/50 p-3 rounded-xl border border-red-500/20 text-center">{error}</div>}
          <div className="space-y-2">
            <label htmlFor="owner-email" className="text-[10px] text-purple-500/70 font-bold uppercase tracking-widest ml-2">Owner Email</label>
            <input id="owner-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/40 border border-purple-500/20 p-4 rounded-xl text-white outline-none focus:border-purple-500/50 transition-colors backdrop-blur-sm" />
          </div>
          <div className="space-y-2">
            <label htmlFor="owner-password" className="text-[10px] text-purple-500/70 font-bold uppercase tracking-widest ml-2">Password</label>
            <input id="owner-password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-purple-500/20 p-4 rounded-xl text-white outline-none focus:border-purple-500/50 transition-colors backdrop-blur-sm" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-4 mt-4 bg-purple-500/10 border border-purple-500/50 text-purple-400 font-bold tracking-widest uppercase text-sm rounded-xl hover:bg-purple-500 hover:text-black transition-all shadow-[0_0_20px_rgba(168,85,247,0.1)] disabled:opacity-70 flex items-center justify-center gap-2">
            {isLoading ? <span className="animate-spin text-xl">⟳</span> : 'ACCESS STUDIO'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
