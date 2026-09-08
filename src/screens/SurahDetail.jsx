import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

export default function SurahDetail({ surah }) {
  const [translationLang, setTranslationLang] = useState('hinglish');

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-xl p-4 text-center text-white shadow-md">
        <h2 className="text-xl font-bold">{surah.name}</h2>
        <p className="text-xs text-emerald-200">{surah.meaning} • {surah.versesCount} Verses</p>
        <p className="text-2xl font-arabic mt-2 text-emerald-300">{surah.arabic}</p>
      </div>

      <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-medium">
        <button 
          onClick={() => setTranslationLang('hinglish')}
          className={`flex-1 py-2 rounded-lg transition ${translationLang === 'hinglish' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          Hinglish
        </button>
        <button 
          onClick={() => setTranslationLang('english')}
          className={`flex-1 py-2 rounded-lg transition ${translationLang === 'english' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          English
        </button>
        <button 
          onClick={() => setTranslationLang('urdu')}
          className={`flex-1 py-2 rounded-lg transition ${translationLang === 'urdu' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          اردو (Urdu)
        </button>
      </div>

      <div className="space-y-3">
        {surah.verses && surah.verses.length > 0 ? (
          surah.verses.map((v) => (
            <div key={v.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
              <div className="flex justify-between items-center text-xs text-emerald-400 font-semibold">
                <span>Ayah {v.id}</span>
                <Volume2 size={16} className="cursor-pointer text-slate-400 hover:text-white" />
              </div>
              <p className="text-right text-xl font-arabic text-emerald-100 leading-loose">
                {v.arabic}
              </p>
              <div className={`pt-2 border-t border-slate-700/60 text-sm ${translationLang === 'urdu' ? 'text-right font-arabic text-emerald-200' : 'text-slate-300'}`}>
                {translationLang === 'english' && v.english}
                {translationLang === 'hinglish' && v.hinglish}
                {translationLang === 'urdu' && v.urdu}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            Verses data for this Surah will be updated soon. (Al-Fatihah has full content demo).
          </div>
        )}
      </div>
    </div>
  );
}
