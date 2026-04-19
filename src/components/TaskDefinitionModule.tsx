
import React, { useState, useEffect } from 'react';
import { db } from '../services/DatabaseService';
import { TaskTemplate } from '../types';
import { CheckSquare, Plus, Clock, ShieldCheck, PlayCircle, Trash2, CheckCircle } from 'lucide-react';

export const TaskDefinitionModule: React.FC = () => {
    const [templates, setTemplates] = useState<TaskTemplate[]>([]);
    const [form, setForm] = useState({ title: '', type: 'CLEANING', description: '', duration: 60 });
    const [showToast, setShowToast] = useState(false);

    useEffect(() => { setTemplates(db.getTemplates()); }, []);

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        const juan = db.getSuperAdmin();
        if (!juan) return;
        db.createTemplate({ title: form.title, type: form.type, description: form.description, standardDurationMinutes: form.duration, createdBy: juan.id });
        setTemplates([...db.getTemplates()]);
        setForm({ title: '', type: 'CLEANING', description: '', duration: 60 });
        
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="p-8 md:p-10 max-w-7xl mx-auto relative">
            {showToast && (
                <div className="fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 z-50">
                    <CheckCircle size={20} />
                    <span className="font-bold text-sm">Template published successfully</span>
                </div>
            )}

            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 text-center md:text-left">
                <div className="w-full md:w-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 flex items-center justify-center md:justify-start gap-3">
                        <CheckSquare className="text-blue-600 w-8 h-8 md:w-10 md:h-10" /> Task Studio
                    </h2>
                    <p className="text-slate-500 font-medium text-sm md:text-lg">Standardize the entire network's operational speed.</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl flex items-center justify-center gap-3 border border-blue-100 w-full md:w-auto">
                    <ShieldCheck size={20} /> <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Juan Mode Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <form onSubmit={save} className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6 h-fit sticky top-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Plus size={20}/>
                        </div>
                        <h3 className="font-black text-slate-800 text-xl">Create Master Template</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Task Title</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" placeholder="e.g. Deep Clean Master Bedroom" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Category</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                                    <option value="CLEANING">Cleaning</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            
                            <div className="space-y-1.5 relative">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Duration (Mins)</label>
                                <div className="relative">
                                    <input type="number" min="1" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" placeholder="60" value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value)})} required />
                                    <Clock className="absolute right-4 top-4 text-slate-400" size={18}/>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Standard Operating Procedure</label>
                            <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-sm text-slate-900 min-h-[120px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none" placeholder="Step 1: ...&#10;Step 2: ..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2">
                        <Plus size={18} /> Publish to Network
                    </button>
                </form>

                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-slate-900">Active Templates</h3>
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{templates.length} Total</span>
                    </div>
                    
                    {templates.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                            <CheckSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-slate-600 mb-1">No templates found</h4>
                            <p className="text-slate-500 text-sm">Create your first master template to get started.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                            {templates.map(tpl => (
                                <div key={tpl.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-2xl ${
                                            tpl.type === 'CLEANING' ? 'bg-blue-50 text-blue-600' : 
                                            tpl.type === 'MAINTENANCE' ? 'bg-orange-50 text-orange-600' : 
                                            'bg-purple-50 text-purple-600'
                                        }`}>
                                            <PlayCircle size={20}/>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-widest">{tpl.type}</span>
                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1"><Clock size={10}/> {tpl.duration} MINS</span>
                                        </div>
                                    </div>
                                    <h4 className="font-black text-slate-900 text-lg mb-2 line-clamp-1">{tpl.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1 line-clamp-3">{tpl.description}</p>
                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">ID: {tpl.id.split('-')[0]}</span>
                                        <button className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
