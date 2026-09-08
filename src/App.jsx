import React, { useState } from 'react';
import { Home, BookOpen, Heart, Compass, Menu, Bell, Search, MapPin, ArrowLeft, ChevronRight, RotateCcw, Volume2 } from 'lucide-react';
import { surahsList } from './data/quranData';
import { namesList } from './data/namesData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTool, setCurrentTool] = useState(null); 
  const [selectedSurah, setSelectedSurah] = useState(null);

  return (
    <div className="flex justify-center bg-gray-950 min-h-screen text-gray-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Mobile App Frame (iOS Container Style) */}
      <div className="w-full max-w-md bg-slate-900 flex flex-col h-screen shadow-2xl relative overflow-hidden border-x border-slate-800/80">
        
        {/* iOS Style Top Header */}
        <header className="ios-glass sticky top-0 border-b border-slate-800/60 px-4 py-3.5 flex justify-between items-center z-30 shadow-sm">
          <div className="flex items-center gap-2.5">
            {(currentTool || selectedSurah) && (
              <button 
                onClick={() => { setCurrentTool(null); setSelectedSurah(null); }} 
                className="p-1 -ml-1 text-emerald-400 hover:bg-emerald-500/10 rounded-full transition"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-base font-semibold tracking-tight text-white">
                {selectedSurah ? selectedSurah.name : currentTool === 'tasbih' ? 'Digital Tasbih' : currentTool === 'names' ? '99 Names of Allah' : 'Muslim Knowledge'}
              </h1>
              {!currentTool && !selectedSurah && (
                <p className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <MapPin size={11} className="text-emerald-400" /> New Delhi, India
                </p>
              )}
            </div>
          </div>
          {!currentTool && !selectedSurah && (
            <div className="flex items-center gap-1">
              <button className="p-2 text-slate-300 hover:bg-slate-800 rounded-full transition">
                <Search size={18} />
              </button>
              <button className="p-2 text-slate-300 hover:bg-slate-800 rounded-full transition">
                <Bell size={18} />
              </button>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-28 pt-1">
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

        {/* iOS Frosted Glass Bottom Navigation Bar */}
        {!currentTool && !selectedSurah && (
          <nav className="absolute bottom-0 left-0 right-0 ios-glass border-t border-slate-800/80 flex justify-around items-center h-20 pb-4 px-2 z-30 shadow-lg">
            <NavItem icon={<Home size={22} />} label="Home" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon={<BookOpen size={22} />} label="Quran" isActive={activeTab === 'quran'} onClick={() => setActiveTab('quran')} />
            <NavItem icon={<Heart size={22} />} label="Dua" isActive={activeTab === 'dua'} onClick={() => setActiveTab('dua')} />
            <NavItem icon={<Compass size={22} />} label="Qibla" isActive={activeTab === 'qibla'} onClick={() => setActiveTab('qibla')} />
            <NavItem icon={<Menu size={22} />} label="More" isActive={activeTab === 'more'} onClick={() => setActiveTab('more')} />
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
      className={`flex flex-col items-center justify-center flex-1 h-full transition duration-200 ${
        isActive ? 'text-emerald-400 scale-105 font-semibold' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      <div className={`p-1 rounded-full ${isActive ? 'bg-emerald-500/15' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] mt-0.5 tracking-tight">{label}</span>
    </button>
  );
}

// 1. Home Screen (iOS Card Style)
function HomeScreen({ setActiveTab, setCurrentTool }) {
  return (
    <div className="p-4 space-y-4">
      {/* Prayer Time iOS Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-5 text-white shadow-xl shadow-emerald-950/30 relative overflow-hidden border border-emerald-500/20">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] bg-emerald-950/40 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-wider font-medium text-emerald-200 border border-emerald-400/20">
              18 Rabiul Awwal 1448 AH
            </span>
            <span className="text-[11px] text-emerald-100 font-medium">Next: Asr in 01:25 hr</span>
          </div>
          <div className="text-center my-4">
            <h2 className="text-xs text-emerald-200 font-medium tracking-wide uppercase">Dhuhr Time</h2>
            <p className="text-4xl font-extrabold tracking-tight mt-1">12:34 PM</p>
          </div>
          <div className="grid grid-cols-5 gap-1.5 pt-3 border-t border-white/15 text-center text-xs">
            <div className="bg-black/10 py-1.5 rounded-xl"><p className="text-emerald-200 text-[10px]">Fajr</p><p className="font-bold text-xs mt-0.5">04:32</p></div>
            <div className="bg-black/20 py-1.5 rounded-xl border border-white/10"><p className="text-emerald-100 text-[10px]">Dhuhr</p><p className="font-bold text-xs mt-0.5">12:34</p></div>
            <div className="bg-black/10 py-1.5 rounded-xl"><p className="text-emerald-200 text-[10px]">Asr</p><p className="font-bold text-xs mt-0.5">04:50</p></div>
            <div className="bg-black/10 py-1.5 rounded-xl"><p className="text-emerald-200 text-[10px]">Maghrib</p><p className="font-bold text-xs mt-0.5">06:48</p></div>
            <div className="bg-black/10 py-1.5 rounded-xl"><p className="text-emerald-200 text-[10px]">Isha</p><p className="font-bold text-xs mt-0.5">08:08</p></div>
          </div>
        </div>
      </div>

      {/* Daily Ayah iOS Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Ayah of the Day</span>
          <Volume2 size={16} className="text-slate-400 cursor-pointer hover:text-white transition" />
        </div>
        <p className="text-right text-xl font-arabic mb-2.5 text-emerald-100 leading-relaxed">
          فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ
        </p>
        <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
          "So which of the favors of your Lord would you deny?" <span className="text-emerald-400 not-italic font-semibold">— Surah Ar-Rahman: 13</span>
        </p>
      </div>

      {/* Quick Features iOS Grid */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Quick Features</h3>
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
    <div className="bg-slate-900/90 hover:bg-slate-800/90 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 transition duration-200 cursor-pointer border border-slate-800/80 shadow-sm h-full active:scale-95">
      <div className="p-2 bg-slate-800/60 rounded-xl">{icon}</div>
      <span className="text-[11px] font-medium text-slate-200">{label}</span>
    </div>
  );
}

// 2. Quran Screen
function QuranScreen({ setSelectedSurah }) {
  return (
    <div className="p-4 space-y-3">
      <div className="relative mb-3">
        <input 
          type="text" 
          placeholder="Search Surah..." 
          className="w-full bg-slate-900/90 text-sm text-white px-4 py-2.5 pl-10 rounded-2xl border border-slate-800 focus:outline-none focus:border-emerald-500 shadow-inner transition"
        />
        <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
      </div>

      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Surah List</h3>
      <div className="space-y-2.5">
        {surahsList.map((surah) => (
          <div 
            key={surah.no} 
            onClick={() => setSelectedSurah(surah)}
            className="bg-slate-900/90 p-3.5 rounded-2xl flex justify-between items-center border border-slate-800/80 hover:border-emerald-500/40 transition duration-200 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-xs border border-emerald-500/20">
                {surah.no}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-tight">{surah.name}</h4>
                <p className="text-[11px] text-slate-400 font-medium">{surah.meaning} • {surah.versesCount} Verses</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-arabic text-emerald-300">{surah.arabic}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Surah Detail View
function SurahDetail({ surah }) {
  const [translationLang, setTranslationLang] = useState('hinglish');

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-5 text-center text-white shadow-lg border border-emerald-500/20">
        <h2 className="text-xl font-bold tracking-tight">{surah.name}</h2>
        <p className="text-xs text-emerald-200 font-medium mt-0.5">{surah.meaning} • {surah.versesCount} Verses</p>
        <p className="text-3xl font-arabic mt-3 text-emerald-100">{surah.arabic}</p>
      </div>

      <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold shadow-inner">
        <button 
          onClick={() => setTranslationLang('hinglish')}
          className={`flex-1 py-2 rounded-xl transition duration-200 ${translationLang === 'hinglish' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          Hinglish
        </button>
        <button 
          onClick={() => setTranslationLang('english')}
          className={`flex-1 py-2 rounded-xl transition duration-200 ${translationLang === 'english' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          English
        </button>
        <button 
          onClick={() => setTranslationLang('urdu')}
          className={`flex-1 py-2 rounded-xl transition duration-200 ${translationLang === 'urdu' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          اردو
        </button>
      </div>

      <div className="space-y-3">
        {surah.verses && surah.verses.length > 0 ? (
          surah.verses.map((v) => (
            <div key={v.id} className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/80 space-y-3 shadow-sm">
              <div className="flex justify-between items-center text-xs text-emerald-400 font-semibold">
                <span className="bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">Ayah {v.id}</span>
                <Volume2 size={16} className="cursor-pointer text-slate-400 hover:text-white transition" />
              </div>
              <p className="text-right text-2xl font-arabic text-emerald-100 leading-loose">
                {v.arabic}
              </p>
              <div className={`pt-3 border-t border-slate-800 text-sm font-medium ${translationLang === 'urdu' ? 'text-right font-arabic text-emerald-200 text-base' : 'text-slate-300'}`}>
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

// 4. Dua Screen
function DuaScreen() {
  return (
    <div className="p-4 space-y-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Hisnul Muslim Categories</h3>
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
    <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 transition duration-200 cursor-pointer flex flex-col justify-between h-24 shadow-sm active:scale-95">
      <h4 className="text-sm font-semibold text-white tracking-tight">{title}</h4>
      <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
        <span>{count}</span>
        <ChevronRight size={16} className="text-emerald-400" />
      </div>
    </div>
  );
}

// 5. Qibla Screen
function QiblaScreen() {
  return (
    <div className="p-4 flex flex-col items-center justify-center h-[70vh] text-center space-y-5">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Qibla Direction</h3>
      <div className="w-64 h-64 rounded-full border-4 border-slate-800 relative flex items-center justify-center bg-slate-900/90 shadow-2xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <Compass size={84} className="text-emerald-400 animate-pulse drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
        </div>
        <div className="absolute top-3 text-xs font-bold text-emerald-400 tracking-wider">N</div>
        <div className="absolute bottom-3 text-xs font-bold text-slate-500 tracking-wider">S</div>
      </div>
      <p className="text-xs text-slate-400 max-w-xs font-medium leading-relaxed">
        Point your phone flat towards an open area. The needle points towards the Kaaba in Makkah.
      </p>
    </div>
  );
}

// 6. More Screen
function MoreScreen({ setCurrentTool }) {
  return (
    <div className="p-4 space-y-2.5">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">Utilities & Tools</h3>
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
    <div onClick={onClick} className="bg-slate-900/90 p-4 rounded-2xl flex justify-between items-center border border-slate-800/80 hover:bg-slate-800/80 transition duration-200 cursor-pointer shadow-sm active:scale-[0.98]">
      <span className="text-sm text-white font-medium">{title}</span>
      <ChevronRight size={16} className="text-slate-400" />
    </div>
  );
}

// 7. Tasbih Counter View
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
    <div className="p-4 flex flex-col items-center justify-center space-y-6 h-[75vh]">
      <div className="flex gap-2 overflow-x-auto w-full pb-2 scrollbar-none">
        {zikrs.map((item, idx) => (
          <button
            key={idx}
            onClick={() => { setSelectedZikr(item.name); setCount(0); }}
            className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap transition duration-200 border font-semibold ${
              selectedZikr === item.name ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="text-center space-y-1.5">
        <p className="text-3xl font-arabic text-emerald-300">{zikrs.find(z => z.name === selectedZikr)?.arabic}</p>
        <p className="text-xs text-slate-400 font-medium">{selectedZikr}</p>
      </div>

      <div className="relative flex items-center justify-center py-4">
        <button
          onClick={() => setCount(count + 1)}
          className="w-48 h-48 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-2xl shadow-emerald-900/50 flex flex-col items-center justify-center text-white active:scale-95 transition duration-150 border-4 border-emerald-400/20 ring-4 ring-emerald-950/40"
        >
          <span className="text-6xl font-black tracking-tight">{count}</span>
          <span className="text-[10px] uppercase tracking-widest text-emerald-100 font-semibold mt-1">Tap to Count</span>
        </button>
      </div>

      <button 
        onClick={() => setCount(0)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 transition shadow-sm"
      >
        <RotateCcw size={14} /> Reset Counter
      </button>
    </div>
  );
}

// 8. 99 Names View
function NamesListView() {
  return (
    <div className="p-4 space-y-2.5">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">Asma-ul-Husna</h3>
      {namesList.map((item) => (
        <div key={item.no} className="bg-slate-900/90 p-3.5 rounded-2xl flex justify-between items-center border border-slate-800/80 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-xs border border-emerald-500/20">{item.no}</div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-tight">{item.name}</h4>
              <p className="text-[11px] text-slate-400 font-medium">{item.meaning}</p>
            </div>
          </div>
          <span className="text-xl font-arabic text-emerald-300">{item.arabic}</span>
        </div>
      ))}
    </div>
  );
}
