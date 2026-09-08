import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Heart, Compass, Menu, Bell, Search, MapPin, ArrowLeft, ChevronRight, RotateCcw, Volume2, Calendar, Clock, Sparkles, Navigation, Download, CheckCircle, Loader2 } from 'lucide-react';
import { surahsList } from './data/quranData';
import { namesList } from './data/namesData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTool, setCurrentTool] = useState(null); 
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Check for updates automatically in the background
  useEffect(() => {
    const currentVersion = "1.0.0";
    fetch('/version.json?' + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        if (data.version && data.version !== currentVersion) {
          setUpdateAvailable(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="fixed inset-0 bg-[#090d16] flex justify-center items-center overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      <div className="w-full h-full sm:max-w-[410px] sm:h-[88vh] sm:rounded-[48px] sm:border-[10px] sm:border-slate-800 bg-[#0f172a] flex flex-col relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
        
        {/* Top Status Bar */}
        <div className="bg-[#0f172a]/90 backdrop-blur-md pt-3 pb-1 px-6 flex justify-between items-center text-xs font-semibold text-slate-400 shrink-0">
          <span>02:25</span>
          <div className="w-20 h-4 bg-black rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-5 h-2.5 border border-slate-400 rounded-sm p-0.5 flex items-center">
              <div className="h-full w-3.5 bg-emerald-400 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Professional Header */}
        <header className="bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-800/80 px-5 py-3.5 flex justify-between items-center z-30 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {(currentTool || selectedSurah) && (
              <button 
                onClick={() => { setCurrentTool(null); setSelectedSurah(null); }} 
                className="w-9 h-9 bg-slate-800/80 text-emerald-400 hover:bg-slate-700 flex items-center justify-center rounded-full transition active:scale-95"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                {selectedSurah ? selectedSurah.name : currentTool === 'tasbih' ? 'Digital Tasbih' : currentTool === 'names' ? '99 Names of Allah' : 'Muslim Knowledge'}
              </h1>
              {!currentTool && !selectedSurah && (
                <p className="text-[11px] text-emerald-400/90 flex items-center gap-1 font-medium mt-0.5">
                  <MapPin size={11} /> New Delhi, India
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Body Content */}
        <main className="flex-1 overflow-y-auto pb-28 pt-2 px-4 space-y-4">
          {selectedSurah ? (
            <SurahDetail surah={selectedSurah} />
          ) : currentTool === 'tasbih' ? (
            <TasbihView />
          ) : currentTool === 'names' ? (
            <NamesListView />
          ) : (
            <>
              {activeTab === 'home' && <HomeScreen setActiveTab={setActiveTab} setCurrentTool={setCurrentTool} />}
              {activeTab === 'quran' && <QuranScreen setSelectedSurah={setSelectedSurah} />}
              {activeTab === 'dua' && <DuaScreen />}
              {activeTab === 'qibla' && <QiblaScreen />}
              {activeTab === 'more' && <MoreScreen setCurrentTool={setCurrentTool} />}
            </>
          )}
        </main>

        {/* In-App Update Popup Notification */}
        {updateAvailable && (
          <div className="absolute bottom-24 left-4 right-4 bg-slate-900/95 border border-emerald-500/50 p-4 rounded-3xl shadow-2xl backdrop-blur-xl z-50 flex items-center justify-between text-white animate-bounce">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-emerald-400">New Update Available! ✨</h4>
              <p className="text-[10px] text-slate-300">Tap update to get the latest features.</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition active:scale-95"
            >
              Update Now
            </button>
          </div>
        )}

        {/* Bottom Navigation */}
        {!currentTool && !selectedSurah && (
          <nav className="absolute bottom-0 left-0 right-0 bg-[#0f172a]/95 backdrop-blur-2xl border-t border-slate-800/80 flex justify-around items-center h-20 pb-4 px-3 z-30 shadow-2xl shrink-0">
            <NavItem icon={<Home size={21} />} label="Home" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon={<BookOpen size={21} />} label="Quran" isActive={activeTab === 'quran'} onClick={() => setActiveTab('quran')} />
            <NavItem icon={<Heart size={21} />} label="Dua" isActive={activeTab === 'dua'} onClick={() => setActiveTab('dua')} />
            <NavItem icon={<Compass size={21} />} label="Qibla" isActive={activeTab === 'qibla'} onClick={() => setActiveTab('qibla')} />
            <NavItem icon={<Menu size={21} />} label="More" isActive={activeTab === 'more'} onClick={() => setActiveTab('more')} />
          </nav>
        )}

      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
        isActive ? 'text-emerald-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-emerald-500/15 shadow-sm' : 'bg-transparent'}`}>
        {icon}
      </div>
      <span className="text-[10px] mt-1 tracking-tight">{label}</span>
    </button>
  );
}

function HomeScreen({ setActiveTab, setCurrentTool }) {
  const [locationName, setLocationName] = useState("New Delhi, India");
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4 pb-4">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <MapPin size={13} />
          <span>{locationName}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 rounded-3xl p-5 text-white shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5 bg-emerald-950/50 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-emerald-200">
            <Calendar size={13} className="text-emerald-400" />
            <span>27 Safar 1448 AH</span>
          </div>
          <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full text-emerald-100 font-medium">Next: Fajr</span>
        </div>
        
        <div className="text-center my-4 bg-black/10 py-4 rounded-2xl border border-white/10">
          <p className="text-xs text-emerald-200 font-medium tracking-wider uppercase mb-1">Local Time</p>
          <p className="text-3xl font-extrabold tracking-tight text-white">{timeString || "02:25:00 AM"}</p>
        </div>

        <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
          <div className="bg-emerald-950/90 py-2 rounded-xl border border-emerald-400/50"><p className="text-emerald-300 font-bold text-[10px]">Fajr</p><p className="font-bold text-[11px] text-white">04:32</p></div>
          <div className="bg-black/15 py-2 rounded-xl"><p className="text-emerald-200 text-[10px]">Dhuhr</p><p className="font-bold text-[11px]">12:34</p></div>
          <div className="bg-black/15 py-2 rounded-xl"><p className="text-emerald-200 text-[10px]">Asr</p><p className="font-bold text-[11px]">04:50</p></div>
          <div className="bg-black/15 py-2 rounded-xl"><p className="text-emerald-200 text-[10px]">Maghrib</p><p className="font-bold text-[11px]">06:48</p></div>
          <div className="bg-black/15 py-2 rounded-xl"><p className="text-emerald-200 text-[10px]">Isha</p><p className="font-bold text-[11px]">08:08</p></div>
        </div>
      </div>

      <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-5 shadow-lg">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
          <Sparkles size={14} /> Ayah of the Day
        </span>
        <p className="text-right text-2xl font-arabic mb-3 text-emerald-100 leading-loose">
          فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ
        </p>
        <p className="text-xs text-slate-300 italic font-medium">"So which of the favors of your Lord would you deny?"</p>
        <span className="text-[11px] text-emerald-400 font-bold block mt-1.5">— Surah Ar-Rahman: 13</span>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Quick Features</h3>
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
    <div className="bg-slate-800/80 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer border border-slate-700/60 shadow-sm active:scale-95">
      <div className="p-2.5 bg-slate-900/70 rounded-xl">{icon}</div>
      <span className="text-[11px] font-semibold text-slate-200">{label}</span>
    </div>
  );
}

function QuranScreen({ setSelectedSurah }) {
  const [downloading, setDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('full_quran_multilang')) setIsDownloaded(true);
  }, []);

  const downloadFullQuran = async () => {
    setDownloading(true);
    try {
      const resEn = await fetch('https://api.alquran.cloud/v1/quran/en.asad');
      const resUr = await fetch('https://api.alquran.cloud/v1/quran/ur.jalandhry');
      const resAr = await fetch('https://api.alquran.cloud/v1/quran/ar.indopak');

      const dataEn = await resEn.json();
      const dataUr = await resUr.json();
      const dataAr = await resAr.json();

      if (dataEn.code === 200 && dataUr.code === 200 && dataAr.code === 200) {
        const mergedSurahs = dataEn.data.surahs.map((surah, sIdx) => ({
          ...surah,
          ayahs: surah.ayahs.map((ayah, aIdx) => {
            const staticSurah = surahsList.find(s => s.no === surah.number);
            const staticAyah = staticSurah && staticSurah.verses ? staticSurah.verses.find(v => v.id === ayah.numberInSurah) : null;
            
            return {
              ...ayah,
              text: dataAr.data.surahs[sIdx].ayahs[aIdx].text,
              english: ayah.text,
              urdu: dataUr.data.surahs[sIdx].ayahs[aIdx].text,
              hinglish: staticAyah ? staticAyah.hinglish : `Ayah ${ayah.numberInSurah} translation updating offline.`
            };
          })
        }));
        localStorage.setItem('full_quran_multilang', JSON.stringify(mergedSurahs));
        setIsDownloaded(true);
      }
    } catch (e) {
      alert("Download failed. Check internet connection.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-3 pb-4">
      {!isDownloaded ? (
        <div className="bg-emerald-900 border border-emerald-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-md">
          <div>
            <h4 className="text-xs font-bold">Download Multi-Language Quran</h4>
            <p className="text-[10px] text-emerald-200">Includes English, Urdu & Hinglish (~4MB)</p>
          </div>
          <button onClick={downloadFullQuran} disabled={downloading} className="bg-white text-emerald-900 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow">
            {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {downloading ? 'Downloading...' : 'Download'}
          </button>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle size={16} /> Multi-Language Quran saved offline!
        </div>
      )}

      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Surah List (114)</h3>
      <div className="space-y-2.5">
        {surahsList.map((surah) => (
          <div key={surah.no} onClick={() => setSelectedSurah(surah)} className="bg-slate-800/80 p-4 rounded-2xl flex justify-between items-center border border-slate-700/70 hover:border-emerald-500 cursor-pointer shadow-sm active:scale-98">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/20">{surah.no}</div>
              <div>
                <h4 className="text-sm font-bold text-white">{surah.name}</h4>
                <p className="text-[11px] text-slate-400">{surah.meaning} • {surah.versesCount} Verses</p>
              </div>
            </div>
            <span className="text-xl font-arabic text-emerald-300">{surah.arabic}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SurahDetail({ surah }) {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('hinglish');

  useEffect(() => {
    const saved = localStorage.getItem('full_quran_multilang');
    if (saved) {
      const data = JSON.parse(saved);
      const cur = data.find(s => s.number === surah.no);
      if (cur && cur.ayahs) {
        setVerses(cur.ayahs.map(a => ({ 
          id: a.numberInSurah, 
          arabic: a.text, 
          english: a.english, 
          urdu: a.urdu, 
          hinglish: a.hinglish 
        })));
        setLoading(false);
        return;
      }
    }
    if (surah.verses && surah.verses.length > 0) {
      setVerses(surah.verses);
    } else {
      setVerses([]);
    }
    setLoading(false);
  }, [surah]);

  return (
    <div className="space-y-4 pb-4">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-5 text-center text-white shadow-xl">
        <h2 className="text-xl font-extrabold">{surah.name}</h2>
        <p className="text-xs text-emerald-200 mt-1">{surah.meaning} • {surah.versesCount} Verses</p>
        <p className="text-3xl font-arabic mt-3 text-emerald-100">{surah.arabic}</p>
      </div>

      <div className="flex bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold shadow-inner">
        <button 
          onClick={() => setLang('hinglish')}
          className={`flex-1 py-2.5 rounded-xl transition duration-200 ${lang === 'hinglish' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          Hinglish
        </button>
        <button 
          onClick={() => setLang('english')}
          className={`flex-1 py-2.5 rounded-xl transition duration-200 ${lang === 'english' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          English
        </button>
        <button 
          onClick={() => setLang('urdu')}
          className={`flex-1 py-2.5 rounded-xl transition duration-200 ${lang === 'urdu' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          اردو
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-20 text-slate-400"><Loader2 className="animate-spin text-emerald-400" size={32} /></div>
        ) : verses.length > 0 ? (
          verses.map(v => (
            <div key={v.id} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
              <span className="bg-emerald-500/15 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">Ayah {v.id}</span>
              <p className="text-right text-2xl font-arabic text-emerald-100 leading-loose">{v.arabic}</p>
              <div className={`pt-3 border-t border-slate-700 text-sm font-medium ${lang === 'urdu' ? 'text-right font-arabic text-emerald-200 text-base' : 'text-slate-300'}`}>
                {lang === 'english' && (v.english || "English translation available after downloading.")}
                {lang === 'urdu' && (v.urdu || "اردو ترجمہ دستیاب ہے۔")}
                {lang === 'hinglish' && (v.hinglish || v.translation || "Hinglish translation available.")}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-800/60 p-8 rounded-2xl text-center space-y-3">
            <BookOpen size={24} className="mx-auto text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Download Required</h4>
            <p className="text-xs text-slate-400">Please download the multi-language Quran from the Quran tab to read offline.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DuaScreen() {
  return (
    <div className="space-y-3 pb-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Hisnul Muslim</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 h-28 flex flex-col justify-between"><h4 className="text-sm font-bold text-white">Morning & Evening</h4><span className="text-xs text-slate-400">25 Duas</span></div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 h-28 flex flex-col justify-between"><h4 className="text-sm font-bold text-white">Prayer & Wudu</h4><span className="text-xs text-slate-400">18 Duas</span></div>
      </div>
    </div>
  );
}

function QiblaScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
      <h3 className="text-sm font-bold text-slate-300">Qibla Direction</h3>
      <div className="w-64 h-64 rounded-full border-4 border-slate-700 relative flex items-center justify-center bg-slate-800 shadow-2xl">
        <Compass size={84} className="text-emerald-400 animate-pulse" />
      </div>
    </div>
  );
}

function MoreScreen({ setCurrentTool }) {
  return (
    <div className="space-y-2.5 pb-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Tools</h3>
      <div onClick={() => setCurrentTool('names')} className="bg-slate-800 p-4 rounded-2xl flex justify-between items-center border border-slate-700 cursor-pointer"><span className="text-sm text-white font-semibold">99 Names of Allah</span><ChevronRight size={16} className="text-slate-400" /></div>
      <div onClick={() => setCurrentTool('tasbih')} className="bg-slate-800 p-4 rounded-2xl flex justify-between items-center border border-slate-700 cursor-pointer"><span className="text-sm text-white font-semibold">Digital Tasbih Counter</span><ChevronRight size={16} className="text-slate-400" /></div>
    </div>
  );
}

function TasbihView() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-6">
      <div className="text-center bg-slate-800 w-full p-4 rounded-3xl border border-slate-700">
        <p className="text-3xl font-arabic text-emerald-300">سُبْحَانَ ٱللَّٰهِ</p>
        <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">SubhanAllah</p>
      </div>
      <button onClick={() => setCount(count + 1)} className="w-52 h-52 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-2xl flex flex-col items-center justify-center text-white active:scale-95 transition border-4 border-emerald-300/30">
        <span className="text-7xl font-black">{count}</span>
        <span className="text-[10px] uppercase font-bold mt-1">Tap to Count</span>
      </button>
      <button onClick={() => setCount(0)} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-400 bg-slate-800 px-5 py-3 rounded-xl border border-slate-700">
        <RotateCcw size={14} /> Reset
      </button>
    </div>
  );
}

function NamesListView() {
  return (
    <div className="space-y-2.5 pb-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Asma-ul-Husna</h3>
      {namesList.map((item) => (
        <div key={item.no} className="bg-slate-800 p-3.5 rounded-2xl flex justify-between items-center border border-slate-700">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-xs">{item.no}</div>
            <div>
              <h4 className="text-sm font-bold text-white">{item.name}</h4>
              <p className="text-[11px] text-slate-400">{item.meaning}</p>
            </div>
          </div>
          <span className="text-xl font-arabic text-emerald-300">{item.arabic}</span>
        </div>
      ))}
    </div>
  );
}
