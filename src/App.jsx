import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Heart, Compass, Menu, RotateCcw, Download, CheckCircle, ArrowLeft, RefreshCw, Search, Volume2, Bookmark, Share2 } from 'lucide-react';
import { surahsList } from './data/quranData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTool, setCurrentTool] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Check storage & Vercel version updates
  useEffect(() => {
    const cachedQuran = localStorage.getItem('full_quran_cache');
    if (cachedQuran) setIsDownloaded(true);

    const currentVersion = "1.0.0";
    fetch('/version.json')
      .then(res => res.json())
      .then(data => {
        if (data.version && data.version !== currentVersion) {
          setUpdateAvailable(true);
        }
      }).catch(() => {});
  }, []);

  const downloadFullQuran = async () => {
    setDownloading(true);
    try {
      const res = await fetch('https://api.alquran.cloud/v1/quran/en.asad');
      const data = await res.json();
      if (data.code === 200) {
        localStorage.setItem('full_quran_cache', JSON.stringify(data.data.surahs));
        setIsDownloaded(true);
      }
    } catch (e) {
      alert("Download failed. Check your internet connection.");
    } finally {
      setDownloading(false);
    }
  };

  const handleRefreshApp = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col pb-20 select-none">
      {/* Header */}
      <header className="bg-[#0f172a] border-b border-[#1e293b] p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(currentTool || selectedSurah) && (
              <button 
                onClick={() => { setCurrentTool(null); setSelectedSurah(null); }}
                className="w-9 h-9 rounded-full bg-[#1e293b] flex items-center justify-center text-[#34d399]"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h1 className="text-base font-bold">
                {selectedSurah ? selectedSurah.name : currentTool === 'tasbih' ? 'Digital Tasbih' : currentTool === 'asma' ? 'Asma-ul-Husna' : 'Muslim World'}
              </h1>
              {!currentTool && !selectedSurah && <p className="text-[11px] text-[#34d399] mt-0.5">New Delhi, India</p>}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 flex-1 max-w-md mx-auto w-full">
        {selectedSurah ? (
          <SurahDetail surah={selectedSurah} />
        ) : currentTool === 'tasbih' ? (
          <TasbihView />
        ) : currentTool === 'asma' ? (
          <AsmaulHusnaView />
        ) : (
          <>
            {activeTab === 'home' && <HomeScreen setActiveTab={setActiveTab} setCurrentTool={setCurrentTool} />}
            {activeTab === 'quran' && (
              <QuranScreen 
                isDownloaded={isDownloaded} 
                downloading={downloading} 
                downloadFullQuran={downloadFullQuran} 
                setSelectedSurah={setSelectedSurah}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
            {activeTab === 'dua' && <DuaScreen />}
            {activeTab === 'qibla' && <QiblaScreen />}
            {activeTab === 'more' && <MoreScreen setCurrentTool={setCurrentTool} />}
          </>
        )}
      </main>

      {/* In-App Update Banner */}
      {updateAvailable && (
        <div className="fixed bottom-20 left-4 right-4 bg-[#0f172a] border border-[#34d399] p-4 rounded-2xl flex justify-between items-center z-50 shadow-2xl">
          <div>
            <p className="text-[#34d399] text-xs font-bold">New Update Available! ✨</p>
            <p className="text-[#94a3b8] text-[10px]">Tap update for latest features.</p>
          </div>
          <button 
            onClick={handleRefreshApp}
            className="bg-[#059669] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw size={14} /> Update Now
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      {!currentTool && !selectedSurah && (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0f172a] border-t border-[#1e293b] flex justify-around items-center z-40">
          <NavItem icon={<Home size={20} />} label="Home" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<BookOpen size={20} />} label="Quran" isActive={activeTab === 'quran'} onClick={() => setActiveTab('quran')} />
          <NavItem icon={<Heart size={20} />} label="Dua" isActive={activeTab === 'dua'} onClick={() => setActiveTab('dua')} />
          <NavItem icon={<Compass size={20} />} label="Qibla" isActive={activeTab === 'qibla'} onClick={() => setActiveTab('qibla')} />
          <NavItem icon={<Menu size={20} />} label="More" isActive={activeTab === 'more'} onClick={() => setActiveTab('more')} />
        </nav>
      )}
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1">
      <span className={isActive ? 'text-[#34d399]' : 'text-[#94a3b8]'}>{icon}</span>
      <span className={`text-[10px] mt-1 ${isActive ? 'text-[#34d399] font-bold' : 'text-[#94a3b8]'}`}>{label}</span>
    </button>
  );
}

function HomeScreen({ setActiveTab, setCurrentTool }) {
  return (
    <div className="space-y-4">
      <div className="bg-[#059669] p-5 rounded-3xl shadow-lg">
        <p className="text-[#a7f3d0] text-[11px] font-bold uppercase tracking-wider">Islamic Date • New Delhi</p>
        <p className="text-white text-3xl font-bold my-1.5">04:32 AM</p>
        <p className="text-[#ecfdf5] text-xs">Next Prayer: Fajr (In 2 hours 15 mins)</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div onClick={() => setActiveTab('quran')} className="bg-[#1e293b] p-4 rounded-2xl border border-[#334155] cursor-pointer">
          <BookOpen className="text-[#34d399] mb-2" size={24} />
          <p className="text-white text-sm font-bold">Al-Quran</p>
          <p className="text-[#94a3b8] text-[10px] mt-0.5">Read & Listen 114 Surahs</p>
        </div>
        <div onClick={() => setCurrentTool('tasbih')} className="bg-[#1e293b] p-4 rounded-2xl border border-[#334155] cursor-pointer">
          <RotateCcw className="text-[#34d399] mb-2" size={24} />
          <p className="text-white text-sm font-bold">Digital Tasbih</p>
          <p className="text-[#94a3b8] text-[10px] mt-0.5">Count daily Zikr</p>
        </div>
        <div onClick={() => setActiveTab('qibla')} className="bg-[#1e293b] p-4 rounded-2xl border border-[#334155] cursor-pointer">
          <Compass className="text-[#34d399] mb-2" size={24} />
          <p className="text-white text-sm font-bold">Qibla Direction</p>
          <p className="text-[#94a3b8] text-[10px] mt-0.5">Accurate Kaaba compass</p>
        </div>
        <div onClick={() => setCurrentTool('asma')} className="bg-[#1e293b] p-4 rounded-2xl border border-[#334155] cursor-pointer">
          <Heart className="text-[#34d399] mb-2" size={24} />
          <p className="text-white text-sm font-bold">99 Names</p>
          <p className="text-[#94a3b8] text-[10px] mt-0.5">Asma-ul-Husna</p>
        </div>
      </div>
    </div>
  );
}

function QuranScreen({ isDownloaded, downloading, downloadFullQuran, setSelectedSurah, searchQuery, setSearchQuery }) {
  const filteredSurahs = surahsList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.no.toString().includes(searchQuery)
  );

  return (
    <div className="space-y-3">
      {!isDownloaded ? (
        <div className="bg-[#065f46] p-4 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-white text-xs font-bold">Download Offline Quran</p>
            <p className="text-[#a7f3d0] text-[10px]">Complete text in cache (~3MB)</p>
          </div>
          <button 
            onClick={downloadFullQuran} 
            disabled={downloading}
            className="bg-white text-[#065f46] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            {downloading ? <span className="animate-spin">⏳</span> : <Download size={14} />}
            {downloading ? 'Downloading...' : 'Download'}
          </button>
        </div>
      ) : (
        <div className="bg-[#1e293b] p-3.5 rounded-2xl flex items-center gap-2.5">
          <CheckCircle size={16} className="text-[#34d399]" />
          <p className="text-[#34d399] text-xs font-bold">Quran saved offline successfully!</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 text-[#94a3b8]" size={16} />
        <input 
          type="text" 
          placeholder="Search Surah by name or number..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1e293b] text-white pl-10 pr-4 py-2.5 rounded-xl text-xs border border-[#334155] focus:outline-none focus:border-[#34d399]"
        />
      </div>

      <p className="text-[#94a3b8] text-[11px] font-bold uppercase tracking-wider">Surah List ({filteredSurahs.length})</p>
      {filteredSurahs.map(surah => (
        <div 
          key={surah.no} 
          onClick={() => setSelectedSurah(surah)}
          className="bg-[#1e293b] p-4 rounded-2xl border border-[#334155] flex justify-between items-center cursor-pointer active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#34d399]/10 flex items-center justify-center text-[#34d399] text-xs font-bold">
              {surah.no}
            </div>
            <div>
              <p className="text-white text-sm font-bold">{surah.name}</p>
              <p className="text-[#94a3b8] text-[11px]">{surah.meaning} • {surah.versesCount} Verses</p>
            </div>
          </div>
          <p className="text-[#34d399] text-lg font-bold">{surah.arabic}</p>
        </div>
      ))}
    </div>
  );
}

function SurahDetail({ surah }) {
  return (
    <div className="space-y-3">
      <div className="bg-[#065f46] p-5 rounded-3xl text-center">
        <h2 className="text-white text-lg font-bold">{surah.name}</h2>
        <p className="text-[#a7f3d0] text-xs mt-0.5">{surah.meaning} • {surah.versesCount} Verses</p>
        <p className="text-[#ecfdf5] text-2xl font-bold mt-2">{surah.arabic}</p>
      </div>
      {surah.verses.map(v => (
        <div key={v.id} className="bg-[#1e293b] p-4 rounded-2xl border border-[#334155] space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[#34d399] text-[10px] font-bold px-2 py-0.5 bg-[#34d399]/10 rounded-md">Ayah {v.id}</span>
            <div className="flex gap-2 text-[#94a3b8]">
              <Volume2 size={14} className="cursor-pointer hover:text-[#34d399]" />
              <Bookmark size={14} className="cursor-pointer hover:text-[#34d399]" />
            </div>
          </div>
          <p className="text-[#ecfdf5] text-xl text-right font-bold">{v.arabic}</p>
          <p className="text-[#cbd5e1] text-xs">{v.translation}</p>
        </div>
      ))}
    </div>
  );
}

function DuaScreen() {
  const duas = [
    { title: "Morning & Evening Azkar", arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ", meaning: "We have reached the morning and at this very time unto Allah belongs all sovereignty." },
    { title: "For Seeking Forgiveness", arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ", meaning: "My Lord, forgive me and accept my repentance." },
    { title: "For Ease & Hardship", arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا", meaning: "O Allah, there is no ease except in that which You have made easy." }
  ];
  return (
    <div className="space-y-3">
      <p className="text-[#94a3b8] text-[11px] font-bold uppercase tracking-wider">Hisnul Muslim Duas</p>
      {duas.map((d, i) => (
        <div key={i} className="bg-[#1e293b] p-4 rounded-2xl border border-[#334155] space-y-2">
          <p className="text-white text-sm font-bold">{d.title}</p>
          <p className="text-[#ecfdf5] text-lg text-right font-bold">{d.arabic}</p>
          <p className="text-[#cbd5e1] text-xs">{d.meaning}</p>
        </div>
      ))}
    </div>
  );
}

function QiblaScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Compass size={80} className="text-[#34d399] animate-pulse" />
      <p className="text-white text-sm font-bold mt-4">Qibla Direction Compass</p>
      <p className="text-[#94a3b8] text-xs mt-1">291° West-Northwest from New Delhi</p>
    </div>
  );
}

function MoreScreen({ setCurrentTool }) {
  return (
    <div className="space-y-3">
      <div 
        onClick={() => setCurrentTool('tasbih')}
        className="bg-[#1e293b] p-4 rounded-2xl border border-[#334155] cursor-pointer"
      >
        <p className="text-white text-sm font-bold">Digital Tasbih Counter</p>
        <p className="text-[#94a3b8] text-[11px] mt-0.5">Count your daily Zikr with ease</p>
      </div>
      <div 
        onClick={() => setCurrentTool('asma')}
        className="bg-[#1e293b] p-4 rounded-2xl border border-[#334155] cursor-pointer"
      >
        <p className="text-white text-sm font-bold">Asma-ul-Husna (99 Names)</p>
        <p className="text-[#94a3b8] text-[11px] mt-0.5">Learn beautiful names of Allah</p>
      </div>
    </div>
  );
}

function TasbihView() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <p className="text-[#ecfdf5] text-2xl font-bold">سُبْحَانَ ٱللَّٰهِ</p>
      <div 
        onClick={() => setCount(count + 1)}
        className="w-44 h-44 rounded-full bg-[#059669] flex flex-col items-center justify-center my-8 border-4 border-[#34d399]/30 active:scale-95 transition-transform cursor-pointer shadow-2xl"
      >
        <span className="text-white text-5xl font-bold">{count}</span>
        <span className="text-[#a7f3d0] text-[10px] font-bold mt-1 tracking-wider">TAP TO COUNT</span>
      </div>
      <button 
        onClick={() => setCount(0)}
        className="flex items-center gap-1.5 bg-[#1e293b] px-4 py-2.5 rounded-xl text-[#f43f5e] text-xs font-bold border border-[#334155]"
      >
        <RotateCcw size={14} /> Reset Counter
      </button>
    </div>
  );
}

function AsmaulHusnaView() {
  const names = [
    { no: 1, arabic: "الرَّحْمَٰنُ", name: "Ar-Rahman", meaning: "The Most Gracious" },
    { no: 2, arabic: "الرَّحِيمُ", name: "Ar-Rahim", meaning: "The Most Merciful" },
    { no: 3, arabic: "الْمَلِكُ", name: "Al-Malik", meaning: "The King / Sovereign" }
  ];
  return (
    <div className="space-y-3">
      <p className="text-[#94a3b8] text-[11px] font-bold uppercase tracking-wider">99 Names of Allah</p>
      {names.map(n => (
        <div key={n.no} className="bg-[#1e293b] p-4 rounded-2xl border border-[#334155] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#34d399]/10 flex items-center justify-center text-[#34d399] text-xs font-bold">{n.no}</div>
            <div>
              <p className="text-white text-sm font-bold">{n.name}</p>
              <p className="text-[#94a3b8] text-[11px]">{n.meaning}</p>
            </div>
          </div>
          <p className="text-[#34d399] text-lg font-bold">{n.arabic}</p>
        </div>
      ))}
    </div>
  );
}
