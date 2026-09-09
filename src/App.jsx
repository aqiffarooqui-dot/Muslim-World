import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Heart, Compass, Menu, RotateCcw, Download, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { surahsList } from './data/quranData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTool, setCurrentTool] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Check offline storage on load
  useEffect(() => {
    const cachedQuran = localStorage.getItem('full_quran_cache');
    if (cachedQuran) setIsDownloaded(true);

    // Vercel auto-update simulation / check
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
              {selectedSurah ? selectedSurah.name : currentTool === 'tasbih' ? 'Digital Tasbih' : 'Muslim World'}
            </h1>
            {!currentTool && !selectedSurah && <p className="text-[11px] text-[#34d399] mt-0.5">New Delhi, India</p>}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 flex-1 max-w-md mx-auto w-full">
        {selectedSurah ? (
          <SurahDetail surah={selectedSurah} />
        ) : currentTool === 'tasbih' ? (
          <TasbihView />
        ) : (
          <>
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'quran' && (
              <QuranScreen 
                isDownloaded={isDownloaded} 
                downloading={downloading} 
                downloadFullQuran={downloadFullQuran} 
                setSelectedSurah={setSelectedSurah} 
              />
            )}
            {activeTab === 'dua' && <DuaScreen />}
            {activeTab === 'qibla' && <QiblaScreen />}
            {activeTab === 'more' && <MoreScreen setCurrentTool={setCurrentTool} />}
          </>
        )}
      </main>

      {/* In-App Native Update Banner */}
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

function HomeScreen() {
  return (
    <div className="space-y-3">
      <div className="bg-[#059669] p-5 rounded-3xl">
        <p className="text-[#a7f3d0] text-[11px] font-bold uppercase tracking-wider">27 Safar 1448 AH</p>
        <p className="text-white text-3xl font-bold my-1.5">02:45 AM</p>
        <p className="text-[#ecfdf5] text-xs">Next: Fajr at 04:32 AM</p>
      </div>
    </div>
  );
}

function QuranScreen({ isDownloaded, downloading, downloadFullQuran, setSelectedSurah }) {
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

      <p className="text-[#94a3b8] text-[11px] font-bold uppercase tracking-wider">Surah List (114)</p>
      {surahsList.map(surah => (
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
          <span className="text-[#34d399] text-[10px] font-bold px-2 py-0.5 bg-[#34d399]/10 rounded-md">Ayah {v.id}</span>
          <p className="text-[#ecfdf5] text-xl text-right font-bold">{v.arabic}</p>
          <p className="text-[#cbd5e1] text-xs">{v.translation}</p>
        </div>
      ))}
    </div>
  );
}

function DuaScreen() {
  return <p className="text-[#94a3b8] text-xs text-center py-10">Hisnul Muslim Duas coming soon...</p>;
}

function QiblaScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Compass size={80} className="text-[#34d399] animate-pulse" />
      <p className="text-white text-sm font-bold mt-4">Qibla Direction Compass</p>
      <p className="text-[#94a3b8] text-xs mt-1">Calibrating sensors for New Delhi</p>
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
        <p className="text-[#94a3b8] text-[11px] mt-0.5">Count your Zikr with vibrations</p>
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
