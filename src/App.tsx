
import React, { useState, useEffect } from 'react';
import { ViewState, User } from './types';
import { db } from './services/DatabaseService';
import { SchemaViewer } from './components/SchemaViewer';
import { ApiExplorer } from './components/ApiExplorer';
import { PromptGenerator } from './components/PromptGenerator';
import { ArchitectureView } from './components/ArchitectureView';
import { AuditComplianceModule } from './components/AuditComplianceModule';
import { RoleDashboardViewer } from './components/RoleDashboardViewer';
import { UserManagementModule } from './components/UserManagementModule';
import { TaskDefinitionModule } from './components/TaskDefinitionModule';
import { PublicListingView } from './components/PublicListingView';
import { AuthSelector, ClientLogin, CollaboratorLogin, OwnerLogin, AdminLogin, PartnerLogin } from './components/LoginModule';
import { Layers, Database, Server, Terminal, Menu, X, ShieldCheck, Lock, Globe, Users, Briefcase, UserCheck, User as UserIcon, LayoutDashboard, UserCog, LogIn, Key, Building2, Smartphone, Eye, LogOut, CheckSquare, FileCode, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('auth-select'); 
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tick, setTick] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await db.loadState();
        setIsDataLoaded(true);
        const user = db.getCurrentUser();
        if (user) setCurrentUser(user);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();

    // Expert 25: Subscribe to saving state
    const unsubscribe = db.subscribeToSavingState(setIsSaving);

    // Expert 6 & 47: Poll for updates every 10 seconds, but only if tab is visible
    const interval = setInterval(async () => {
      if (document.visibilityState === 'visible') {
        const updated = await db.loadState();
        if (updated) {
          setTick(t => t + 1);
        }
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#listing/')) {
        const id = hash.replace('#listing/', '');
        setActivePropertyId(id);
        setView('public-listing');
      } else if (!hash || hash === '#') {
        setActivePropertyId(null);
        if (currentUser) {
          const roleMap: Record<string, ViewState> = {
            'JUAN': 'dash-juan',
            'ADMIN': 'dash-juan',
            'GEO_MANAGER': 'dash-geo',
            'CLUSTER_MANAGER': 'dash-cluster',
            'OWNER': 'dash-owner',
            'COLLABORATOR': 'dash-collaborator',
            'PARTNER': 'dash-partner',
            'CLIENT': 'dash-client'
          };
          setView(roleMap[currentUser.role] || 'auth-select');
        } else {
          setView('auth-select');
        }
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentUser]);

  const handleLogin = (targetView: ViewState) => {
    const user = db.getCurrentUser();
    setCurrentUser(user);
    setView(targetView);
  };

  const handleLogout = () => {
    db.logout();
    setCurrentUser(null);
    setView('auth-select');
    window.location.hash = '';
    setIsMobileMenuOpen(false);
  };

  const isJuan = currentUser?.role === 'JUAN' || currentUser?.role === 'ADMIN';
  const isLoggedIn = !!currentUser;
  const isLightThemeRole = currentUser && ['JUAN', 'GEO_MANAGER', 'CLUSTER_MANAGER'].includes(currentUser.role);

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-500/50 font-bold uppercase tracking-[0.3em] text-[10px]">Initializing ReachHomes System...</p>
        </div>
      </div>
    );
  }

  const NavItem = ({ id, label, icon: Icon }: { id: ViewState; label: string; icon: any }) => (
    <button
      onClick={() => { setView(id); setIsMobileMenuOpen(false); }}
      aria-current={view === id ? 'page' : undefined}
      className={`group flex items-center justify-between px-6 py-4 w-full text-left transition-all duration-300 ${
        view === id 
          ? 'bg-gradient-to-r from-amber-500/10 to-transparent text-amber-500 border-l-2 border-amber-500 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]' 
          : 'text-white/40 hover:text-white/80 hover:bg-white/5 border-l-2 border-transparent'
      }`}
    >
      <div className="flex items-center gap-4">
        <Icon size={18} className={`transition-colors duration-300 ${view === id ? 'text-amber-500' : 'text-white/30 group-hover:text-amber-500/50'}`} />
        <span className="font-light tracking-widest text-xs uppercase">{label}</span>
      </div>
    </button>
  );

  if (view === 'public-listing' && activePropertyId) {
    return <PublicListingView propertyId={activePropertyId} onBack={() => { 
      window.location.hash = ''; 
      if (isLoggedIn && currentUser) {
        const roleMap: Record<string, ViewState> = {
          'JUAN': 'dash-juan',
          'ADMIN': 'dash-juan',
          'GEO_MANAGER': 'dash-geo',
          'CLUSTER_MANAGER': 'dash-cluster',
          'OWNER': 'dash-owner',
          'COLLABORATOR': 'dash-collaborator',
          'PARTNER': 'dash-partner',
          'CLIENT': 'dash-client'
        };
        setView(roleMap[currentUser.role] || 'auth-select');
      } else {
        setView('auth-select');
      }
    }} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-medium animate-pulse uppercase tracking-[0.2em] text-[10px]">Initializing ReachHomes...</p>
        </div>
      </div>
    );
  }

  return (
    <GlobalErrorBoundary>
      <div className="flex h-screen overflow-hidden font-sans bg-[#050505] text-white selection:bg-amber-500/30">
        
        {/* Mobile Menu Overlay */}
        {isLoggedIn && isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {isLoggedIn && (
          <aside 
            id="main-sidebar" 
            role="navigation"
            aria-label="Main Navigation"
            className={`fixed md:static inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col w-80 border-r border-white/5 bg-[#0a0a0a] z-50 md:z-20 shadow-2xl`}
          >
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h1 className="text-2xl font-light tracking-[0.3em] text-white" style={{ fontFamily: "'Playfair Display', serif" }}>REACH<span className="text-amber-500 font-serif italic">HOMES</span></h1>
            <button className="md:hidden text-white/50 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-6 space-y-2 custom-scrollbar">
            <div className="space-y-1">
              {isJuan && (
                <NavItem id="dash-juan" label="JUAN LIVE VIEW" icon={Eye} />
              )}
              
              {currentUser?.role === 'GEO_MANAGER' && (
                <NavItem id="dash-geo" label="Geo Dashboard" icon={Globe} />
              )}

              {currentUser?.role === 'CLUSTER_MANAGER' && (
                <NavItem id="dash-cluster" label="Cluster Dashboard" icon={Users} />
              )}
              
              {currentUser?.role === 'PARTNER' && (
                <NavItem id="dash-partner" label="Partner Hub" icon={Briefcase} />
              )}

              {/* Marketplace: ONLY shown for Clients and Juan. Explicitly hidden for Collaborator/Owner per screenshot edits. */}
              {(isJuan || currentUser?.role === 'CLIENT') && (
                <NavItem id="dash-client" label="Marketplace" icon={Globe} />
              )}

              {(isJuan || currentUser?.role === 'OWNER') && (
                <NavItem id="dash-owner" label="Owner Studio" icon={Briefcase} />
              )}

              {(isJuan || currentUser?.role === 'COLLABORATOR') && (
                <NavItem id="dash-collaborator" label="Trusted Collaborators" icon={UserCheck} />
              )}
            </div>

            {isJuan && (
              <div className="space-y-1 border-t border-white/5 pt-6 mt-6">
                <div className="px-6 pb-2 text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">System Controls</div>
                <NavItem id="architecture" label="System Architecture" icon={Layers} />
                <NavItem id="database" label="Database Schema" icon={Database} />
                <NavItem id="user-management" label="RBAC Control" icon={UserCog} />
                <NavItem id="tasks" label="Task Studio" icon={CheckSquare} />
                <NavItem id="api" label="System Registry" icon={Server} />
                <NavItem id="prompts" label="Backend Generators" icon={Terminal} />
                <NavItem id="tests" label="Audit & Compliance" icon={FileCode} />
              </div>
            )}
          </nav>

          <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-md">
             <button onClick={handleLogout} className="flex items-center gap-4 w-full px-6 py-4 text-xs font-bold text-white/40 hover:text-amber-500 hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest border border-transparent hover:border-amber-500/20">
                <LogOut size={16} /> Logout Session
             </button>
             <div className="mt-6 flex flex-col gap-3 text-[9px] text-white/30 uppercase tracking-[0.2em] px-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse"></div>
                  <span className="truncate">Session: {currentUser?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={10} className="text-white/20" />
                  <span className="truncate">Domain: {window.location.hostname}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Server size={10} className="text-white/20" />
                  <span>IP: {window.location.hostname === 'localhost' ? '127.0.0.1' : 'Dynamic'}</span>
                </div>
             </div>
          </div>
        </aside>
      )}

      <main id="main-content" className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Expert 25: Saving Indicator */}
        <AnimatePresence>
          {isSaving && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 right-4 z-[100] flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Syncing State...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoggedIn && (
          <header id="mobile-header" className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0a0a0a] z-30 relative">
            <h1 className="text-xl font-light tracking-[0.3em] text-white" style={{ fontFamily: "'Playfair Display', serif" }}>REACH<span className="text-amber-500 font-serif italic">HOMES</span></h1>
            <button id="mobile-menu-toggle" className="p-2 text-white/70 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </header>
        )}
        <div id="view-container" className="flex-1 overflow-y-auto relative z-10">
          {view === 'auth-select' && <AuthSelector onLogin={handleLogin} />}
          {view === 'auth-client' && <ClientLogin onLogin={handleLogin} />}
          {view === 'auth-collaborator' && <CollaboratorLogin onLogin={handleLogin} />}
          {view === 'auth-partner' && <PartnerLogin onLogin={handleLogin} />}
          {view === 'auth-owner' && <OwnerLogin onLogin={handleLogin} />}
          {view === 'auth-admin' && <AdminLogin onLogin={handleLogin} />}

          {isLoggedIn && (
            <div className="h-full">
              {view === 'architecture' && <ArchitectureView />}
              {view === 'database' && <SchemaViewer />}
              {view === 'api' && <ApiExplorer />}
              {view === 'prompts' && <PromptGenerator />}
              {view === 'tests' && <AuditComplianceModule />}
              {view.startsWith('dash-') && <RoleDashboardViewer view={view} />}
              {view === 'user-management' && <UserManagementModule />}
              {view === 'tasks' && <TaskDefinitionModule />}
            </div>
          )}
        </div>
      </main>
    </div>
    </GlobalErrorBoundary>
  );
};

export default App;
