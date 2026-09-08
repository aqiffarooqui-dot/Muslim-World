import React from 'react';
import { BookOpen, Heart, Compass, Menu, Volume2 } from 'lucide-react';

export default function HomeScreen({ setActiveTab, setCurrentTool }) {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs bg-emerald-900/60 px-3 py-1 rounded-full uppercase tracking-wider">18 Rabiul Awwal 1448 AH</span>
            <span className="text-xs text-emerald-200">Next: Asr in 01:25 hr</span>
          </div>
          <div className="text-center my-3">
            <h2 className="text-sm text-emerald-200">Dhuhr Time</h2>
            <p className="text-3xl font-bold tracking-tight">12:34 PM</p>
          </div>
          <div className="grid grid-cols-5 gap-1 pt-3 border-t border-emerald-600/50 text-center text-xs">
            <div><p className="text-emerald-200">Fajr</p><p className="font-semibold">04:32</p></div>
            <div><p className="text-emerald-200">Dhuhr</p><p className="font-semibold">12:34</p></div>
            <div><p className="text-emerald-200">Asr</p><p className="font-semibold">04:50</p></div>
            <div><p className="text-emerald-200">Maghrib</p><p className="font-semibold">06:48</p></div>
            <div><p className="text-emerald-200">Isha</p><p className="font-semibold">08:08</p></div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-emerald-400">Ayah of the Day</span>
          <Volume2 size={16} className="text-slate-400 cursor-pointer hover:text-white" />
        </div>
        <p className="text-right text-lg font-arabic mb-2 text-emerald-100">فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ</p>
        <p className="text-xs text-slate-300 italic mb-1">"So which of the favors of your Lord would you deny?" (Surah Ar-Rahman: 13)</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Quick Features</h3>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div onClick={() => setActiveTab('quran')}><QuickFeatureItem icon={<BookOpen className="text-emerald-400" />} label="Quran" /></div>
          <div onClick={() => setActiveTab('dua')}><QuickFeatureItem icon={<Heart className="text-rose-400" />} label="Duas" /></div>
          <div onClick={() => setActiveTab('qibla')}><QuickFeatureItem icon={<Compass className="text-amber-400" />} label="Qibla" /></div>
          <div onClick={() => setCurrentTool('tasbih')}><QuickFeatureItem icon={<Menu className="text-sky-400" />} label="Tasbih" /></div>
        </div>
      </div>
    </div>
  );
}

function QuickFeatureItem({ icon, label }) {
  return (
    <div className="bg-slate-800 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-700 transition cursor-pointer border border-slate-700 h-full">
      {icon}
      <span className="text-xs text-slate-200">{label}</span>
    </div>
  );
}
