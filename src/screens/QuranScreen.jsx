import React from 'react';
import { Search } from 'lucide-react';
import { surahsList } from '../data/quranData';

export default function QuranScreen({ setSelectedSurah }) {
  return (
    <div className="p-4 space-y-3">
      <div className="relative mb-3">
        <input 
          type="text" 
          placeholder="Search Surah..." 
          className="w-full bg-slate-800 text-sm text-white px-4 py-2 pl-10 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
        />
        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
      </div>

      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Surah List</h3>
      <div className="space-y-2">
        {surahsList.map((surah) => (
          <div 
            key={surah.no} 
            onClick={() => setSelectedSurah(surah)}
            className="bg-slate-800 p-3 rounded-xl flex justify-between items-center border border-slate-700 hover:bg-slate-750 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-900/60 text-emerald-400 font-bold flex items-center justify-center text-xs border border-emerald-700/50">
                {surah.no}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{surah.name}</h4>
                <p className="text-[11px] text-slate-400">{surah.meaning} • {surah.versesCount} Verses</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-arabic text-emerald-300">{surah.arabic}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
