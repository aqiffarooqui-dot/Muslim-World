import React, { useState, useEffect } from 'react';
import { Search, Download, CheckCircle, Loader2 } from 'lucide-react';
import { surahsList } from '../data/quranData';

export default function QuranScreen({ setSelectedSurah }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    const savedQuran = localStorage.getItem('full_quran_indopak');
    if (savedQuran) {
      setIsDownloaded(true);
    }
  }, []);

  const downloadFullQuran = async () => {
    setDownloading(true);
    try {
      // Fetching complete Quran in Indo-Pak script & translation
      const res = await fetch('https://api.alquran.cloud/v1/quran/en.asad');
      const arabicRes = await fetch('https://api.alquran.cloud/v1/quran/ar.indopak');
      
      const data = await res.json();
      const arabicData = await arabicRes.json();
      
      if (data.code === 200 && arabicData.code === 200) {
        // Merge Indo-Pak arabic text into surahs
        const mergedSurahs = data.data.surahs.map((surah, sIdx) => ({
          ...surah,
          ayahs: surah.ayahs.map((ayah, aIdx) => ({
            ...ayah,
            text: arabicData.data.surahs[sIdx].ayahs[aIdx].text,
            translation: ayah.text
          }))
        }));

        localStorage.setItem('full_quran_indopak', JSON.stringify(mergedSurahs));
        setIsDownloaded(true);
      }
    } catch (err) {
      console.error("Download failed:", err);
      alert("Please check your internet connection to download Quran.");
    } finally {
      setDownloading(false);
    }
  };

  const filteredSurahs = surahsList.filter(surah => 
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.no.toString().includes(searchQuery)
  );

  return (
    <div className="space-y-3 pb-4">
      {!isDownloaded ? (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 border border-emerald-600/40 rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold">Download Indo-Pak Quran (Offline)</h4>
            <p className="text-[10px] text-emerald-200">Authentic South Asian Script (~3MB)</p>
          </div>
          <button 
            onClick={downloadFullQuran}
            disabled={downloading}
            className="bg-white text-emerald-900 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1.5 shadow"
          >
            {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {downloading ? 'Downloading...' : 'Download'}
          </button>
        </div>
      ) : (
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 text-emerald-400 text-xs font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle size={16} />
          <span>Indo-Pak Quran script saved offline successfully!</span>
        </div>
      )}

      <div className="relative mb-2">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Surah by name, meaning or number..." 
          className="w-full bg-slate-800/90 text-sm text-white px-4 py-3 pl-11 rounded-2xl border border-slate-700/80 focus:outline-none focus:border-emerald-500 shadow-inner transition"
        />
        <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
      </div>

      <div className="flex justify-between items-center px-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Surah List (114)</h3>
        <span className="text-[10px] text-emerald-400 font-medium">Indo-Pak Script</span>
      </div>

      <div className="space-y-2.5">
        {filteredSurahs.map((surah) => (
          <div 
            key={surah.no} 
            onClick={() => setSelectedSurah(surah)}
            className="bg-slate-800/80 p-4 rounded-2xl flex justify-between items-center border border-slate-700/70 hover:border-emerald-500/50 hover:bg-slate-800 transition duration-200 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/20 shadow-inner">
                {surah.no}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">{surah.name}</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{surah.meaning} • {surah.versesCount} Verses</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-arabic text-emerald-300">{surah.arabic}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
