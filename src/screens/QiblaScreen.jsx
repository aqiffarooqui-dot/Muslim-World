import React from 'react';
import { Compass } from 'lucide-react';

export default function QiblaScreen() {
  return (
    <div className="p-4 flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
      <h3 className="text-sm font-semibold text-slate-300">Qibla Direction</h3>
      <div className="w-64 h-64 rounded-full border-4 border-slate-700 relative flex items-center justify-center bg-slate-800/50 shadow-inner">
        <div className="absolute inset-0 flex items-center justify-center">
          <Compass size={80} className="text-emerald-500 animate-pulse" />
        </div>
        <div className="absolute top-4 text-xs font-bold text-emerald-400">N</div>
        <div className="absolute bottom-4 text-xs font-bold text-slate-500">S</div>
      </div>
      <p className="text-xs text-slate-400 max-w-xs">Point your phone flat towards an open area. The needle points towards the Kaaba in Makkah.</p>
    </div>
  );
}
