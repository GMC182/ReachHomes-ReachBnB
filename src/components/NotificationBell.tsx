
import React, { useState, useEffect } from 'react';
import { db } from '../services/DatabaseService';
import { Bell, X, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const user = db.getCurrentUser();

  useEffect(() => {
    if (!user) return;
    const update = () => {
      setNotifications(db.getNotifications(user.id));
    };
    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && user) {
      db.markNotificationsRead(user.id);
    }
  };

  if (!user) return null;

  return (
    <div className="relative z-[100]">
      <button 
        onClick={handleOpen}
        className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
      >
        <Bell size={20} className={unreadCount > 0 ? "text-amber-500 animate-pulse" : "text-white/40 group-hover:text-white/80"} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)]">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[-1]"
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Notifications</h3>
                <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white"><X size={14}/></button>
              </div>
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={32} className="text-white/10 mx-auto mb-3" />
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">No alerts found</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`p-4 border-b border-white/5 last:border-0 flex gap-4 transition-colors ${n.read ? 'opacity-50' : 'bg-white/5'}`}>
                      <div className={`mt-1 shrink-0 ${
                        n.type === 'SUCCESS' ? 'text-emerald-500' : 
                        n.type === 'ALERT' ? 'text-red-500' : 'text-blue-500'
                      }`}>
                        {n.type === 'SUCCESS' ? <CheckCircle size={14} /> : 
                         n.type === 'ALERT' ? <AlertTriangle size={14} /> : <Info size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/80 leading-relaxed mb-1">{n.message}</p>
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{n.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
