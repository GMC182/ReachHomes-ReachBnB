import React from 'react';
import { databaseSchema } from '../data';
import { Database, Key, Table as TableIcon, Info, Search } from 'lucide-react';

export const SchemaViewer: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-800 pb-6 gap-6">
        <div className="w-full md:w-auto text-center md:text-left">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
            <Database className="text-blue-500 w-8 h-8" />
            Database Schema
          </h2>
          <p className="text-slate-400 text-sm md:text-lg">
            20+ Normalized tables optimized for multi-tenant hierarchy and auditability.
          </p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search tables..." 
            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {databaseSchema.map((table) => (
          <div key={table.name} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group">
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex justify-between items-start group-hover:bg-slate-900 transition-colors">
              <div>
                <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2 font-mono">
                  <TableIcon size={18} className="text-slate-500" />
                  {table.name}
                </h3>
                <p className="text-sm text-slate-400 mt-1">{table.description}</p>
              </div>
            </div>
            
            <div className="px-5 py-3 bg-blue-900/10 border-b border-blue-900/20 flex items-start gap-2">
               <Info size={14} className="text-blue-400 mt-0.5 shrink-0" />
               <p className="text-xs text-blue-200 italic leading-relaxed"><span className="font-bold not-italic text-blue-400">Why?</span> {table.reasoning}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 w-1/3">Column</th>
                    <th className="p-4 w-1/4">Type</th>
                    <th className="p-4">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {table.columns.map((col, idx) => (
                    <tr key={col.name} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-mono text-slate-300 flex items-center gap-2">
                        {col.key === 'PK' && <Key size={12} className="text-yellow-500 shrink-0" />}
                        {col.key === 'FK' && <Key size={12} className="text-blue-500 shrink-0" />}
                        <span className={col.key === 'PK' ? 'font-bold text-white' : ''}>{col.name}</span>
                      </td>
                      <td className="p-4 text-purple-400 font-mono text-xs font-medium">{col.type}</td>
                      <td className="p-4 text-slate-500 text-xs">{col.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};