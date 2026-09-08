import React, { useState } from 'react';
import { Home, BookOpen, Heart, Compass, Menu, Bell, Search, MapPin, ArrowLeft, ChevronRight, RotateCcw, Volume2, Calendar, Clock, Sparkles } from 'lucide-react';
import { surahsList } from './data/quranData';
import { namesList } from './data/namesData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTool, setCurrentTool] = useState(null); 
  const [selectedSurah, setSelectedSurah] = useState(null);

  return (
    <div className="fixed inset-0 bg-[#090d16] flex justify-center items-center overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      {/* Authentic Mobile Device Frame Container */}
      <div className="w-full h-full sm:max-w-[410px] sm:h-[88vh] sm:rounded-[48px] sm:border-[10px] sm:border-slate-800 bg-[#0f172a] flex flex-col relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
        
        {/* iOS Dynamic Island / Status Bar Spacer */}
        <div className="bg-[#0f172a]/90 backdrop-blur-md pt-3 pb-1 px-6 flex justify-between items-center text-xs font-semibold text-slate-400 shrink-0">
          <span>01:53</span>
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
          {!currentTool && !selectedSurah && (
            <div className="flex items-center gap-1.5">
              <button className="w-9 h-9 bg-slate-800/60 text-slate-300 hover:bg-slate-800 flex items-center justify-center rounded-full transition">
                <Search size={17} />
              </button>
              <button className="w-9 h-9 bg-slate-800/60 text-slate-300 hover:bg-slate-800 flex items-center justify-center rounded-full transition">
                <Bell size={17} />
              </button>
            </div>
          )}
        </header>

        {/* Scrollable Body Content */}
        <main className="flex-1 overflow-y-auto pb-28 pt-2 px-4 space-y-4 scrollbar-none">
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

        {/* Floating iOS Bottom Navigation Bar */}
        {!currentTool && !selectedSurah && (
          <nav className="absolute bottom-0 left-0 right-0 bg-[#0f172a]/95 backdrop-blur-2xl border-t border-slate-800/80 flex justify-around items-center h-20 pb-4 px-3 z-30 shadow-[0_-10px_25px_rgba(0,0,0,0.5)] shrink-0">
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
      <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-emerald-500/15 shadow-sm shadow-emerald-500/20' : 'bg-transparent'}`}>
        {icon}
      </div>
      <span className="text-[10px] mt-1 tracking-tight">{label}</span>
    </button>
  );
}

function HomeScreen({ setActiveTab, setCurrentTool }) {
  return (
    <div className="space-y-4 pb-4">
      {/* Enhanced Prayer Card */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 rounded-3xl p-5 text-white shadow-xl shadow-emerald-950/40 relative overflow-hidden border border-emerald-400/20">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5 bg-emerald-950/50 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/20 text-[11px] font-medium text-emerald-200">
              <Calendar size={12} className="text-emerald-400" />
              <span>18 Rabiul Awwal 1448 AH</span>
            </div>
            <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-full text-emerald-100 font-medium">Asr in 01:25 hr</span>
          </div>
          
          <div className="text-center my-4 bg-black/10 backdrop-blur-sm py-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-center gap-1 text-xs text-emerald-200 font-medium tracking-wider uppercase mb-1">
              <Clock size={13} /> Dhuhr Time
            </div>
            <p className="text-4xl font-extrabold tracking-tight text-white">12:34 PM</p>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-1 text-center text-xs">
            <div className="bg-black/15 py-2 rounded-xl border border-white/5"><p className="text-emerald-200 text-[10px] font-medium">Fajr</p><p className="font-bold text-xs mt-0.5">04:32</p></div>
            <div className="bg-emerald-950/80 py-2 rounded-xl border border-emerald-400/30 shadow-inner"><p className="text-emerald-300 text-[10px] font-bold">Dhuhr</p><p className="font-extrabold text-xs mt-0.5 text-white">12:34</p></div>
            <div className="bg-black/15 py-2 rounded-xl border border-white/5"><p className="text-emerald-200 text-[10px] font-medium">Asr</p><p className="font-bold text-xs mt-0.5">04:50</p></div>
            <div className="bg-black/15 py-2 rounded-xl border border-white/5"><p className="text-emerald-200 text-[10px] font-medium">Maghrib</p><p className="font-bold text-xs mt-0.5">06:48</p></div>
            <div className="bg-black/15 py-2 rounded-xl border border-white/5"><p className="text-emerald-200 text-[10px] font-medium">Isha</p><p className="font-bold text-xs mt-0.5">08:08</p></div>
          </div>
        </div>
      </div>

      {/* Ayah of the Day Card */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-5 shadow-lg backdrop-blur-xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} /> Ayah of the Day
          </span>
          <button className="w-8 h-8 bg-slate-700/60 hover:bg-slate-700 flex items-center justify-center rounded-full transition text-slate-300">
            <Volume2 size={16} />
          </button>
        </div>
        <p className="text-right text-2xl font-arabic mb-3 text-emerald-100 leading-loose">
          فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ
        </p>
        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-700/40">
          <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
            "So which of the favors of your Lord would you deny?"
          </p>
          <span className="text-[11px] text-emerald-400 font-bold block mt-1.5">— Surah Ar-Rahman: 13</span>
        </div>
      </div>

      {/* Quick Features Grid */}
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
    <div className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 transition duration-200 cursor-pointer border border-slate-700/60 shadow-sm h-full active:scale-95 group">
      <div className="p-2.5 bg-slate-900/70 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-[11px] font-semibold text-slate-200">{label}</span>
    </div>
  );
}

function QuranScreen({ setSelectedSurah }) {
  return (
    <div className="space-y-3 pb-4">
      <div className="relative mb-2">
        <input 
          type="text" 
          placeholder="Search Surah or Verse..." 
          className="w-full bg-slate-800/90 text-sm text-white px-4 py-3 pl-11 rounded-2xl border border-slate-700/80 focus:outline-none focus:border-emerald-500 shadow-inner transition"
        />
        <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
      </div>

      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Surah List</h3>
      <div className="space-y-2.5">
        {surahsList.map((surah) => (
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

function SurahDetail({ surah }) {
  const [translationLang, setTranslationLang] = useState('hinglish');

  return (
    <div className="space-y-4 pb-4">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-5 text-center text-white shadow-xl border border-emerald-500/20">
        <h2 className="text-xl font-extrabold tracking-tight">{surah.name}</h2>
        <p className="text-xs text-emerald-200 font-medium mt-1">{surah.meaning} • {surah.versesCount} Verses</p>
        <p className="text-3xl font-arabic mt-3 text-emerald-100">{surah.arabic}</p>
      </div>

      <div className="flex bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold shadow-inner">
        <button 
          onClick={() => setTranslationLang('hinglish')}
          className={`flex-1 py-2.5 rounded-xl transition duration-200 ${translationLang === 'hinglish' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          Hinglish
        </button>
        <button 
          onClick={() => setTranslationLang('english')}
          className={`flex-1 py-2.5 rounded-xl transition duration-200 ${translationLang === 'english' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          English
        </button>
        <button 
          onClick={() => setTranslationLang('urdu')}
          className={`flex-1 py-2.5 rounded-xl transition duration-200 ${translationLang === 'urdu' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          اردو
        </button>
      </div>

      <div className="space-y-3">
        {surah.verses && surah.verses.length > 0 ? (
          surah.verses.map((v) => (
            <div key={v.id} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3 shadow-sm">
              <div className="flex justify-between items-center text-xs text-emerald-400 font-bold">
                <span className="bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">Ayah {v.id}</span>
                <Volume2 size={16} className="cursor-pointer text-slate-400 hover:text-white transition" />
              </div>
              <p className="text-right text-2xl font-arabic text-emerald-100 leading-loose">
                {v.arabic}
              </p>
              <div className={`pt-3 border-t border-slate-700/80 text-sm font-medium ${translationLang === 'urdu' ? 'text-right font-arabic text-emerald-200 text-base' : 'text-slate-300'}`}>
                {translationLang === 'english' && v.english}
                {translationLang === 'hinglish' && v.hinglish}
                {translationLang === 'urdu' && v.urdu}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">
            Verses data for this Surah will be updated soon. (Al-Fatihah has full content demo).
          </div>
        )}
      </div>
    </div>
  );
}

function DuaScreen() {
  return (
    <div className="space-y-3 pb-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Hisnul Muslim Categories</h3>
      <div className="grid grid-cols-2 gap-3">
        <DuaCategoryCard title="Morning & Evening" count="25 Duas" />
        <DuaCategoryCard title="Prayer & Wudu" count="18 Duas" />
        <DuaCategoryCard title="Home & Family" count="12 Duas" />
        <DuaCategoryCard title="Traveling" count="10 Duas" />
      </div>
    </div>
  );
}

function DuaCategoryCard({ title, count }) {
  return (
    <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/70 hover:border-emerald-500/50 transition duration-200 cursor-pointer flex flex-col justify-between h-28 shadow-sm active:scale-95">
      <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
      <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
        <span className="bg-slate-900/60 px-2.5 py-1 rounded-lg">{count}</span>
        <div className="w-7 h-7 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center">
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
}

function QiblaScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">
      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Qibla Direction</h3>
      <div className="w-64 h-64 rounded-full border-4 border-slate-700 relative flex items-center justify-center bg-slate-800/80 shadow-2xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <Compass size={84} className="text-emerald-400 animate-pulse drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
        </div>
        <div className="absolute top-3 text-xs font-bold text-emerald-400 tracking-wider">N</div>
        <div className="absolute bottom-3 text-xs font-bold text-slate-500 tracking-wider">S</div>
      </div>
      <p className="text-xs text-slate-400 max-w-xs font-medium leading-relaxed px-4">
        Point your phone flat towards an open area. The needle points towards the Kaaba in Makkah.
      </p>
    </div>
  );
}

function MoreScreen({ setCurrentTool }) {
  return (
    <div className="space-y-2.5 pb-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Utilities & Tools</h3>
      <MoreItem title="99 Names of Allah (Asma-ul-Husna)" onClick={() => setCurrentTool('names')} />
      <MoreItem title="Digital Tasbih Counter" onClick={() => setCurrentTool('tasbih')} />
      <MoreItem title="Islamic Hijri Calendar" onClick={() => {}} />
      <MoreItem title="Nearby Mosque Locator" onClick={() => {}} />
      <MoreItem title="Zakat Calculator" onClick={() => {}} />
    </div>
  );
}

function MoreItem({ title, onClick }) {
  return (
    <div onClick={onClick} className="bg-slate-800/80 p-4 rounded-2xl flex justify-between items-center border border-slate-700/70 hover:bg-slate-800 transition duration-200 cursor-pointer shadow-sm active:scale-[0.98]">
      <span className="text-sm text-white font-semibold">{title}</span>
      <div className="w-7 h-7 bg-slate-700/60 text-slate-300 rounded-full flex items-center justify-center">
        <ChevronRight size={16} />
      </div>
    </div>
  );
}

function TasbihView() {
  const [count, setCount] = useState(0);
  const [selectedZikr, setSelectedZikr] = useState("SubhanAllah");

  const zikrs = [
    { name: "SubhanAllah", arabic: "سُبْحَانَ ٱللَّٰهِ" },
    { name: "Alhamdulillah", arabic: "ٱلْحَمْدُ لِلَّٰهِ" },
    { name: "Allahu Akbar", arabic: "ٱللَّٰهُ أَكْبَرُ" },
    { name: "Astaghfirullah", arabic: "أَسْتَغْفِرُ ٱللَّٰهَ" }
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-4">
      <div className="flex gap-2 overflow-x-auto w-full pb-2 scrollbar-none px-1">
        {zikrs.map((item, idx) => (
          <button
            key={idx}
            onClick={() => { setSelectedZikr(item.name); setCount(0); }}
            className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap transition duration-200 border font-bold ${
              selectedZikr === item.name ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="text-center space-y-2 bg-slate-800/60 w-full p-4 rounded-3xl border border-slate-700/60">
        <p className="text-3xl font-arabic text-emerald-300">{zikrs.find(z => z.name === selectedZikr)?.arabic}</p>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{selectedZikr}</p>
      </div>

      <div className="relative flex items-center justify-center py-2">
        <button
          onClick={() => setCount(count + 1)}
          className="w-52 h-52 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-500 shadow-2xl shadow-emerald-950/60 flex flex-col items-center justify-center text-white active:scale-95 transition duration-150 border-4 border-emerald-300/30 ring-8 ring-emerald-950/30"
        >
          <span className="text-7xl font-black tracking-tight">{count}</span>
          <span className="text-[10px] uppercase tracking-widest text-emerald-100 font-bold mt-1">Tap to Count</span>
        </button>
      </div>

      <button 
        onClick={() => setCount(0)}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-400 bg-slate-800/80 px-5 py-3 rounded-xl border border-slate-700 transition shadow-sm active:scale-95"
      >
        <RotateCcw size={14} /> Reset Counter
      </button>
    </div>
  );
}

function NamesListView() {
  return (
    <div className="space-y-2.5 pb-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Asma-ul-Husna</h3>
      {namesList.map((item) => (
        <div key={item.no} className="bg-slate-800/80 p-3.5 rounded-2xl flex justify-between items-center border border-slate-700/70 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-xs border border-emerald-500/20">{item.no}</div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">{item.name}</h4>
              <p className="text-[11px] text-slate-400 font-medium">{item.meaning}</p>
            </div>
          </div>
          <span className="text-xl font-arabic text-emerald-300">{item.arabic}</span>
        </div>
      ))}
    </div>
  );
}
