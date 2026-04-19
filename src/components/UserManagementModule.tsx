import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, UserCog, ShieldAlert, Check, X, Lock, Trash2, Edit, Plus, ChevronDown, KeyRound, Save, Ban, ShieldCheck, UserCheck, Eye, EyeOff, Crown, Search, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { db } from '../services/DatabaseService';
import { User, UserRole } from '../types';

const GlassCard = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl ${className}`}>
    {children}
  </div>
);

export const UserManagementModule: React.FC = () => {
  const currentUser = db.getCurrentUser();
  const [simulatorRole, setSimulatorRole] = useState<UserRole>(currentUser?.role || 'JUAN');
  const [users, setUsers] = useState<User[]>([]);
  
  // Filtering and Pagination State
  const [filterText, setFilterText] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 500;

  // Load real users from DB
  useEffect(() => {
      setUsers(db.getUsers());
      const interval = setInterval(() => setUsers([...db.getUsers()]), 2000);
      return () => clearInterval(interval);
  }, []);

  // Compute processed users list
  const filteredAndSortedUsers = useMemo(() => {
      let result = [...users];

      // 1. Filter by text (name or email)
      if (filterText) {
          const lowerText = filterText.toLowerCase();
          result = result.filter(u => 
              u.name.toLowerCase().includes(lowerText) || 
              u.email.toLowerCase().includes(lowerText)
          );
      }

      // 2. Filter by role
      if (filterRole !== 'ALL') {
          result = result.filter(u => u.role === filterRole);
      }

      // 3. Sort by last login (descending)
      result.sort((a, b) => {
          const dateA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
          const dateB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
          return dateB - dateA;
      });

      return result;
  }, [users, filterText, filterRole]);

  // Paginated users
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return filteredAndSortedUsers.slice(start, start + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'CLIENT' as UserRole, password: '' });
  const [passwordChangeTarget, setPasswordChangeTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // --- RBAC LOGIC ---
  const canCreate = (actor: UserRole, targetType: UserRole): boolean => {
    if (actor === 'JUAN') return true;
    if (actor === 'ADMIN') return ['GEO_MANAGER', 'CLUSTER_MANAGER', 'OWNER', 'COLLABORATOR', 'CLIENT', 'PARTNER'].includes(targetType);
    if (actor === 'GEO_MANAGER') return ['CLUSTER_MANAGER', 'OWNER', 'COLLABORATOR', 'CLIENT'].includes(targetType);
    if (actor === 'CLUSTER_MANAGER') return ['OWNER', 'COLLABORATOR', 'CLIENT'].includes(targetType);
    if (actor === 'OWNER') return ['COLLABORATOR', 'CLIENT'].includes(targetType);
    return false;
  };

  const getCreatableRoles = (actor: UserRole): UserRole[] => {
    const allRoles: UserRole[] = ['JUAN', 'ADMIN', 'GEO_MANAGER', 'CLUSTER_MANAGER', 'OWNER', 'COLLABORATOR', 'CLIENT', 'PARTNER'];
    return allRoles.filter(r => canCreate(actor, r));
  };

  const canEdit = (actor: UserRole, target: User): boolean => {
    if (actor === 'JUAN') return true; 
    if (actor === 'COLLABORATOR') return target.role === 'CLIENT';
    if (actor === 'PARTNER') return false;
    const levels: Record<UserRole, number> = { JUAN: 0, ADMIN: 1, GEO_MANAGER: 2, CLUSTER_MANAGER: 3, OWNER: 4, COLLABORATOR: 5, PARTNER: 6, CLIENT: 7 };
    return levels[actor] < levels[target.role];
  };

  const canDelete = (actor: UserRole, target: User): boolean => {
    if (actor === 'JUAN') return true;
    if (actor === 'COLLABORATOR') return false; 
    if (actor === 'PARTNER') return false;
    if (actor === 'CLIENT') return false;
    const levels: Record<UserRole, number> = { JUAN: 0, ADMIN: 1, GEO_MANAGER: 2, CLUSTER_MANAGER: 3, OWNER: 4, COLLABORATOR: 5, PARTNER: 6, CLIENT: 7 };
    return levels[actor] < levels[target.role];
  };

  const canChangePassword = (actor: UserRole): boolean => {
    return actor === 'JUAN';
  };

  // --- Actions ---
  const showNotification = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreate = () => {
    if (!newUser.name || !newUser.email) return;
    try {
        const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            password: newUser.password || '123' // Screenshot requirement: fallback to 123 if empty
        };
        db.createUser(user); // Write to Real DB
        setUsers([...db.getUsers()]);
        setIsCreateModalOpen(false);
        setNewUser({ name: '', email: '', role: 'CLIENT', password: '' });
        showNotification(`User ${user.name} onboarded. Access established.`, 'success');
    } catch (e) {
        showNotification("Security Error: Identity collision detected.", 'error');
    }
  };

  const handleDelete = (user: User) => {
    setDeleteTarget(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      db.deleteUser(deleteTarget.id); // Write to Real DB
      setUsers([...db.getUsers()]);
      showNotification("User deleted and access revoked", 'success');
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const openPasswordModal = (user: User) => {
    setPasswordChangeTarget(user);
    setNewPasswordValue('');
    setIsPasswordModalOpen(true);
  };

  const confirmPasswordChange = () => {
    if (passwordChangeTarget && newPasswordValue.trim() !== "") {
       const updated = { ...passwordChangeTarget, password: newPasswordValue };
       db.updateUser(updated); // Write to Real DB
       setUsers([...db.getUsers()]);
       showNotification(`Password for ${passwordChangeTarget.name} updated`, 'success');
       setIsPasswordModalOpen(false);
       setPasswordChangeTarget(null);
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return <span className="text-slate-700 italic">Never</span>;
    const date = new Date(iso);
    return date.toLocaleString();
  };

  if (simulatorRole === 'CLIENT' || simulatorRole === 'PARTNER') {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-slate-500 bg-slate-900/50 rounded-xl border border-red-900/30 backdrop-blur">
        <div className="bg-red-950/50 p-8 rounded-full mb-6 ring-4 ring-red-900/20 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
           <Lock size={64} className="text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">ACCESS DENIED</h2>
        <p className="max-w-md text-center text-red-400 font-mono text-sm border border-red-900/50 bg-red-950/30 p-4 rounded-lg">
          Security Alert: RBAC Policy Violation.<br/>{simulatorRole === 'CLIENT' ? 'Clients' : 'Partners'} are strictly prohibited from accessing this module.
        </p>
      </div>
    );
  }

  const creatableRoles = getCreatableRoles(simulatorRole);

  return (
    <div className="max-w-7xl mx-auto p-8 relative min-h-screen">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-10 right-10 px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-4 animate-in slide-in-from-top-4 border ${
          notification.type === 'success' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-400' : 'bg-red-950/90 border-red-500 text-red-400'
        }`}>
           {notification.type === 'success' ? <Check size={20} className="stroke-[3]"/> : <ShieldAlert size={20} className="stroke-[3]"/>}
           <span className="font-bold text-sm tracking-wide">{notification.msg}</span>
        </div>
      )}

      {/* Simulator Switcher */}
      <GlassCard className="mb-10 p-1 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-amber-950/30 to-slate-900/50 border-amber-500/20">
         <div className="flex items-center gap-6 p-6">
            <div className="relative">
               <div className="absolute inset-0 bg-amber-500 blur-lg opacity-20 rounded-full"></div>
               <div className="bg-slate-900 border border-amber-500/50 p-4 rounded-full relative z-10 shadow-xl">
                  {simulatorRole === 'JUAN' ? <Crown className="text-amber-500 w-8 h-8" /> : <UserCog className="text-slate-400 w-8 h-8" />}
               </div>
            </div>
            <div>
               <h3 className="text-amber-500 font-black uppercase tracking-[0.2em] text-xs mb-1">Live IAM System</h3>
               <p className="text-white text-lg font-bold">Managing as: <span className="text-amber-400 border-b-2 border-amber-500/50 pb-0.5">{simulatorRole.replace('_', ' ')}</span></p>
            </div>
         </div>
         <div className="p-6 w-full md:w-auto">
            <div className="relative group">
               <select 
                  value={simulatorRole} 
                  onChange={(e) => setSimulatorRole(e.target.value as UserRole)}
                  className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-5 py-3 pl-12 font-mono text-sm w-full md:w-72 focus:ring-2 focus:ring-amber-500 outline-none hover:bg-slate-900 transition-colors appearance-none cursor-pointer"
               >
                  <option value="JUAN">JUAN (Super Admin)</option>
                  <option value="GEO_MANAGER">Geo Manager</option>
                  <option value="CLUSTER_MANAGER">Cluster Manager</option>
                  <option value="OWNER">Owner (Enterprise)</option>
                  <option value="COLLABORATOR">Trusted Collaborator</option>
                  <option value="PARTNER">Partner</option>
               </select>
               <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-amber-500 transition-colors" size={18} />
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            </div>
         </div>
      </GlassCard>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
           <h1 className="text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
             Identity Management <span className="text-slate-600 text-lg font-normal tracking-normal">| Production DB</span>
           </h1>
           <p className="text-slate-400 max-w-2xl">
             Modifications here instantly affect the entire ecosystem. Creating a user grants immediate login access.
           </p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Search user..." 
                    value={filterText}
                    onChange={(e) => { setFilterText(e.target.value); setCurrentPage(1); }}
                    className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-48 transition-all"
                />
            </div>
            
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <select 
                    value={filterRole}
                    onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
                    className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl pl-10 pr-8 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                >
                    <option value="ALL">All Roles</option>
                    <option value="JUAN">JUAN</option>
                    <option value="GEO_MANAGER">GEO</option>
                    <option value="CLUSTER_MANAGER">CLUSTER</option>
                    <option value="OWNER">OWNER</option>
                    <option value="COLLABORATOR">COLLABORATOR</option>
                    <option value="PARTNER">PARTNER</option>
                    <option value="CLIENT">CLIENT</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={14} />
            </div>

            <button 
                onClick={() => setIsCreateModalOpen(true)}
                disabled={creatableRoles.length === 0}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transform hover:-translate-y-0.5"
            >
                {creatableRoles.length === 0 ? <Ban size={20} className="text-red-500"/> : <Plus size={20} className="text-blue-200"/>} 
                <span className="tracking-wide text-sm">{creatableRoles.length === 0 ? "CREATE DENIED" : "NEW USER"}</span>
            </button>
        </div>
      </div>

      {/* Users Table */}
      <GlassCard className="overflow-hidden">
         <div className="overflow-x-auto custom-scrollbar">
           <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-slate-950/80 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                 <tr>
                    <th className="p-6">Identity</th>
                    <th className="p-6">System Role</th>
                    <th className="p-6">Credentials</th>
                    <th className="p-6">Last Login</th>
                    <th className="p-6">Status</th>
                    <th className="p-6 text-right">Controls</th>
                 </tr>
              </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
               {paginatedUsers.map((user) => {
                  const editable = canEdit(simulatorRole, user);
                  const deletable = canDelete(simulatorRole, user);
                  const passChange = canChangePassword(simulatorRole);
                  const isPassVisible = visiblePasswords[user.id];

                  return (
                     <tr key={user.id} className="hover:bg-slate-800/40 transition-colors group">
                        <td className="p-6">
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${
                                 user.role === 'JUAN' ? 'bg-amber-500 text-slate-900' : 
                                 user.role === 'CLIENT' ? 'bg-slate-700 text-slate-300' : 'bg-blue-600 text-white'
                              }`}>
                                 {user.name.charAt(0)}
                              </div>
                              <div>
                                 <div className="font-bold text-white text-base">{user.name}</div>
                                 <div className="text-slate-500 text-xs mt-0.5 font-mono flex items-center gap-1">
                                    {user.email}
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="p-6">
                           <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border shadow-sm ${
                              user.role === 'JUAN' ? 'bg-amber-950/50 text-amber-500 border-amber-500/20 shadow-amber-900/20' :
                              user.role === 'GEO_MANAGER' ? 'bg-blue-950/50 text-blue-400 border-blue-500/20 shadow-blue-900/20' :
                              user.role === 'CLUSTER_MANAGER' ? 'bg-indigo-950/50 text-indigo-400 border-indigo-500/20 shadow-indigo-900/20' :
                              user.role === 'OWNER' ? 'bg-purple-950/50 text-purple-400 border-purple-500/20 shadow-purple-900/20' :
                              user.role === 'COLLABORATOR' ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20' :
                              'bg-slate-800 text-slate-400 border-slate-700'
                           }`}>
                              {user.role.replace('_', ' ')}
                           </span>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-2">
                             <div className={`font-mono text-xs rounded px-2 py-1 border w-24 text-center ${isPassVisible ? 'bg-slate-800 border-slate-600 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                               {isPassVisible ? user.password : '••••••••'}
                             </div>
                             <button 
                                onClick={() => togglePasswordVisibility(user.id)}
                                className="text-slate-500 hover:text-blue-400 transition-colors"
                             >
                               {isPassVisible ? <EyeOff size={14}/> : <Eye size={14}/>}
                             </button>
                           </div>
                        </td>
                        <td className="p-6 font-mono text-xs text-slate-400">
                           {formatDate(user.lastLogin)}
                        </td>
                        <td className="p-6">
                           <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                              ACTIVE
                           </span>
                        </td>
                        <td className="p-6 text-right">
                           <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                              {/* Password */}
                              <div className="relative group/tooltip">
                                <button 
                                   onClick={() => openPasswordModal(user)}
                                   disabled={!passChange}
                                   className={`p-2.5 rounded-lg transition-all border ${
                                      passChange 
                                      ? 'bg-slate-800 border-slate-700 hover:border-amber-500 hover:text-amber-500 text-slate-400' 
                                      : 'bg-slate-900/50 border-transparent text-slate-700 cursor-not-allowed'
                                   }`}
                                >
                                   <KeyRound size={16} />
                                </button>
                              </div>

                              {/* Edit */}
                              <div className="relative group/tooltip">
                                <button 
                                   disabled={!editable}
                                   className={`p-2.5 rounded-lg transition-all border ${
                                      editable 
                                      ? 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:text-blue-500 text-slate-400' 
                                      : 'bg-slate-900/50 border-transparent text-slate-700 cursor-not-allowed'
                                   }`}
                                >
                                   <Edit size={16} />
                                </button>
                              </div>

                              {/* Delete */}
                              <div className="relative group/tooltip">
                                <button 
                                   onClick={() => handleDelete(user)}
                                   disabled={!deletable}
                                   className={`p-2.5 rounded-lg transition-all border ${
                                      deletable 
                                      ? 'bg-slate-800 border-slate-700 hover:border-red-500 hover:text-red-500 text-slate-400' 
                                      : 'bg-slate-900/50 border-transparent text-slate-700 cursor-not-allowed'
                                   }`}
                                >
                                   <Trash2 size={16} />
                                </button>
                              </div>
                           </div>
                        </td>
                     </tr>
                  );
               })}
            </tbody>
         </table>
         </div>
         
         {/* Table Pagination Controls */}
         {totalPages > 1 && (
            <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center">
                <p className="text-xs text-slate-500 font-medium">
                    Showing {(currentPage-1)*itemsPerPage + 1} to {Math.min(currentPage*itemsPerPage, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length} entries
                </p>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16}/>
                    </button>
                    <span className="text-xs font-bold text-white px-4">Page {currentPage} of {totalPages}</span>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={16}/>
                    </button>
                </div>
            </div>
         )}
      </GlassCard>

      {/* Permission Legend */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-start gap-4">
            <div className="p-2 bg-red-950/50 rounded-lg border border-red-900/50"><Trash2 size={16} className="text-red-500"/></div>
            <div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Delete Scope</span>
               <div className="text-xs text-slate-300 leading-relaxed">
                  {users.filter(u => canDelete(simulatorRole, u)).map(u => u.role).filter((v,i,a) => a.indexOf(v)===i).join(', ') || <span className="text-red-500 font-bold">RESTRICTED</span>}
               </div>
            </div>
         </div>
         <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-start gap-4">
            <div className="p-2 bg-blue-950/50 rounded-lg border border-blue-900/50"><UserCheck size={16} className="text-blue-500"/></div>
            <div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Create Scope</span>
               <div className="text-xs text-slate-300 leading-relaxed">
                  {creatableRoles.join(', ') || <span className="text-red-500 font-bold">NONE</span>}
               </div>
            </div>
         </div>
         <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-start gap-4">
            <div className="p-2 bg-amber-950/50 rounded-lg border border-amber-900/50"><KeyRound size={16} className="text-amber-500"/></div>
            <div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Root Access</span>
               <div className="text-xs text-slate-300 font-bold">
                  {canChangePassword(simulatorRole) ? <span className="text-amber-500">FULL CONTROL</span> : <span className="text-slate-500">REVOKED</span>}
               </div>
            </div>
         </div>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative ring-1 ring-white/10">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                 <h2 className="text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
                    <UserCog className="text-blue-500" size={20}/> Onboard User
                 </h2>
                 <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
              </div>
              <div className="p-8 space-y-6">
                 <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Role Assignment</label>
                    <div className="relative">
                       <select 
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                          className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 appearance-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                       >
                          {creatableRoles.map(role => (
                             <option key={role} value={role}>{role}</option>
                          ))}
                       </select>
                       <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16} />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                        <input 
                           type="text" 
                           value={newUser.name}
                           onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                           className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                           placeholder="Jane Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Password (Optional)</label>
                        <input 
                           type="text" 
                           value={newUser.password}
                           onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                           className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                           placeholder="Default: 123"
                        />
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                    <input 
                       type="email" 
                       value={newUser.email}
                       onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                       className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                       placeholder="user@reachbnb.com"
                    />
                 </div>

                 <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex gap-3">
                    <ShieldCheck className="text-blue-400 shrink-0" size={18} />
                    <p className="text-xs text-blue-200 leading-relaxed">
                       {newUser.password ? <span>Direct password <strong className="text-white">{newUser.password}</strong> will be set.</span> : <span>Default Password <strong className="text-white">123</strong> will be assigned.</span>} User should change it upon first login.
                    </p>
                 </div>
              </div>
              <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-950/50">
                 <button 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2.5 text-slate-400 hover:text-white font-bold text-sm transition-colors"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={handleCreate}
                    disabled={!newUser.name || !newUser.email}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
                 >
                    <Save size={18} /> Confirm Access
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && passwordChangeTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative ring-1 ring-white/10">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                 <h2 className="text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
                    <KeyRound className="text-amber-500" size={20}/> Security Reset
                 </h2>
                 <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
              </div>
              <div className="p-8 space-y-6">
                 <div className="text-center">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                       <Lock size={32} className="text-amber-500" />
                    </div>
                    <h3 className="text-white font-bold">Reset Password for {passwordChangeTarget.name}</h3>
                    <p className="text-xs text-slate-500 mt-2">Only Super Admins can perform this action.</p>
                 </div>
                 
                 <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">New Password</label>
                    <input 
                       type="text" 
                       value={newPasswordValue}
                       onChange={(e) => setNewPasswordValue(e.target.value)}
                       className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-mono tracking-wider text-center"
                       placeholder="Enter new password"
                       autoFocus
                    />
                 </div>
              </div>
              <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-950/50">
                 <button 
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-5 py-2.5 text-slate-400 hover:text-white font-bold text-sm transition-colors"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={confirmPasswordChange}
                    disabled={!newPasswordValue}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20 transition-all hover:-translate-y-0.5"
                 >
                    <Save size={18} /> Update
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative ring-1 ring-white/10">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                 <h2 className="text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
                    <ShieldAlert className="text-red-500" size={20}/> Revoke Access
                 </h2>
                 <button onClick={() => setIsDeleteModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
              </div>
              <div className="p-8 space-y-6 text-center">
                 <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                    <Trash2 size={32} className="text-red-500" />
                 </div>
                 <h3 className="text-white font-bold text-xl">Confirm Deletion</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    Are you sure you want to delete <strong className="text-white">{deleteTarget.name}</strong>? 
                    This will revoke their access immediately and permanently.
                 </p>
              </div>
              <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-950/50">
                 <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-5 py-2.5 text-slate-400 hover:text-white font-bold text-sm transition-colors"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={confirmDelete}
                    className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-900/20 transition-all hover:-translate-y-0.5"
                 >
                    <Trash2 size={18} /> Revoke Access
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};