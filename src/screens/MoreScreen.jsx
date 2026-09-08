import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function MoreScreen({ setCurrentTool }) {
  return (
    <div className="p-4 space-y-2">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Utilities & Tools</h3>
      <div onClick={() => setCurrentTool('names')} className="bg-slate-800 p-3 rounded-xl flex justify-between items-center border border-slate-700 hover:bg-slate-750 transition cursor-pointer">
        <span className="text-sm text-white">99 Names of Allah (Asma-ul-Husna)</span>
        <ChevronRight size={16} className="text-slate-400" />
      </div>
      <div onClick={() => setCurrentTool('tasbih')} className="bg-slate-800 p-3 rounded-xl flex justify-between items-center border border-slate-700 hover:bg-slate-750 transition cursor-pointer">
        <span className="text-sm text-white">Digital Tasbih Counter</span>
        <ChevronRight size={16} className="text-slate-400" />
      </div>
      <div className="bg-slate-800 p-3 rounded-xl flex justify-between items-center border border-slate-700 hover:bg-slate-750 transition cursor-pointer">
        <span className="text-sm text-white">Islamic Hijri Calendar</span>
        <ChevronRight size={16} className="text-slate-400" />
      </div>
      <div className="bg-slate-800 p-3 rounded-xl flex justify-between items-center border border-slate-700 hover:bg-slate-750 transition cursor-pointer">
        <span className="text-sm text-white">Nearby Mosque Locator</span>
        <ChevronRight size={16} className="text-slate-400" />
      </div>
      <div className="bg-slate-800 p-3 rounded-xl flex justify-between items-center border border-slate-700 hover:bg-slate-750 transition cursor-pointer">
        <span className="text-sm text-white">Zakat Calculator</span>
        <ChevronRight size={16} className="text-slate-400" />
      </div>
    </div>
  );
}
