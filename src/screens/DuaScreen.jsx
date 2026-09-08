import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function DuaScreen() {
  return (
    <div className="p-4 space-y-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hisnul Muslim Categories</h3>
      <div className="grid grid-cols-2 gap-3">
        <DuaCategoryCard title="Morning & Evening" count="25 Duas" />
        <DuaCategoryCard title="Prayer & Wudu" count="18 Duas" />
        <DuaCategoryCard title="Home & Family" count="12 Duas" />
        <DuaCategoryCard title="Traveling" count="10 Duas" />
      </div>
    </div>
  );
}

function DuaCategoryCard({ title, count }) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between h-24">
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>{count}</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );
}
