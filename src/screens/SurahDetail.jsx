import React, { useState, useEffect } from 'react';
import { Volume2, Loader2, BookOpen } from 'lucide-react';

export default function SurahDetail({ surah }) {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVerses() {
      setLoading(true);
      try {
        const savedQuran = localStorage.getItem('full_quran_indopak');
        if (savedQuran) {
          const quranData = JSON.parse(savedQuran);
          const currentSurah = quranData.find(s => s.number === surah.no);
          if (currentSurah && currentSurah.ayahs) {
            const formatted = currentSurah.ayahs.map(a => ({
              id: a.numberInSurah,
              arabic: a.text,
              translation: a.translation
            }));
            setVerses(formatted);
            setLoading(false);
            return;
          }
        }

        if (surah.verses && surah.verses.length > 0) {
          setVerses(surah.verses);
        } else {
          setVerses([]);
        }
      } catch (err) {
        console.error("Error loading verses:", err);
      } finally {
        setLoading(false);
      }
    }

    loadVerses();
  }, [surah]);

  return (
    <div className="space-y-4 pb-4">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-5 text-center text-white shadow-xl border border-emerald-500/20">
        <h2 className="text-xl font-extrabold tracking-tight">{surah.name}</h2>
        <p className="text-xs text-emerald-200 font-medium mt-1">{surah.meaning} • {surah.versesCount} Verses</p>
        <p className="text-3xl font-arabic mt-3 text-emerald-100">{surah.arabic}</p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-400">
            <Loader2 className="animate-spin text-emerald-400" size={32} />
            <p className="text-xs">Loading Indo-Pak Verses...</p>
          </div>
        ) : verses.length > 0 ? (
          verses.map((v) => (
            <div key={v.id} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3 shadow-sm">
              <div className="flex justify-between items-center text-xs text-emerald-400 font-bold">
                <span className="bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">Ayah {v.id}</span>
                <Volume2 size={16} className="cursor-pointer text-slate-400 hover:text-white transition" />
              </div>
              {/* Indo-Pak Arabic Text Rendering */}
              <p className="text-right text-2xl font-arabic text-emerald-100 leading-loose">
                {v.arabic}
              </p>
              <div className="pt-3 border-t border-slate-700/85 text-sm font-medium text-slate-300">
                {v.translation}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8 text-center space-y-3 my-6">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <BookOpen size={24} />
            </div>
            <h4 className="text-sm font-bold text-white">Download Required for Indo-Pak Quran</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Please click the <span className="text-emerald-300 font-semibold">"Download"</span> button on the Quran tab to download all 114 Surahs in Indo-Pak script.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
