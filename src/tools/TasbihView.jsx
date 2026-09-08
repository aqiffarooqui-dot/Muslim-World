import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export default function TasbihView() {
  const [count, setCount] = useState(0);
  const [selectedZikr, setSelectedZikr] = useState("SubhanAllah");

  const zikrs = [
    { name: "SubhanAllah", arabic: "سُبْحَانَ ٱللَّٰهِ" },
    { name: "Alhamdulillah", arabic: "ٱلْحَمْدُ لِلَّٰهِ" },
    { name: "Allahu Akbar", arabic: "ٱللَّٰهُ أَكْبَرُ" },
    { name: "Astaghfirullah", arabic: "أَسْتَغْفِرُ ٱللَّٰهَ" }
  ];

  return (
    <div className="p-4 flex flex-col items-center justify-center space-y-6 h-[75vh]">
      <div className="flex gap-2 overflow-x-auto w-full pb-2">
        {zikrs.map((item, idx) => (
          <button
            key={idx}
            onClick={() => { setSelectedZikr(item.name); setCount(0); }}
            className={`px-3 py-2 rounded-xl text-xs whitespace-nowrap transition border ${
              selectedZikr === item.name ? 'bg-emerald-600 text-white border-emerald-500 font-semibold' : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="text-center space-y-1">
        <p className="text-2xl font-arabic text-emerald-300">{zikrs.find(z => z.name === selectedZikr)?.arabic}</p>
        <p className="text-xs text-slate-400">{selectedZikr}</p>
      </div>

      <div className="relative flex items-center justify-center">
        <button
          onClick={() => setCount(count + 1)}
          className="w-44 h-44 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-xl shadow-emerald-900/40 flex flex-col items-center justify-center text-white active:scale-95 transition border-4 border-emerald-400/30"
        >
          <span className="text-5xl font-extrabold tracking-tight">{count}</span>
          <span className="text-[10px] uppercase tracking-widest text-emerald-100 mt-1">Tap to Count</span>
        </button>
      </div>

      <button 
        onClick={() => setCount(0)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 transition"
      >
        <RotateCcw size={14} /> Reset Counter
      </button>
    </div>
  );
}
