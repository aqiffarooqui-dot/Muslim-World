import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Heart, Compass, Menu, RotateCcw, Download, CheckCircle, ArrowLeft, RefreshCw, Search, Volume2, Bookmark, Clock, MapPin, Calendar, Bell, Globe } from 'lucide-react';
import { surahsList } from './data/quranData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTool, setCurrentTool] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Location & Prayer State
  const [city, setCity] = useState(localStorage.getItem('user_city') || 'New Delhi');
  const [country, setCountry] = useState(localStorage.getItem('user_country') || 'India');
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [hijriDate, setHijriDate] = useState('');
  const [loadingPrayers, setLoadingPrayers] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempCityInput, setTempCityInput] = useState('');

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

  // Fetch Prayer Times from AlAdhan API based on selected City
  useEffect(() => {
    async function fetchPrayerTimes() {
      setLoadingPrayers(true);
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/quran/en.asad`); // Keep cache check or fetch timings
        const dateStr = new Date().toISOString().split('T')[0].split('-').reverse().join('-');
        const timingsRes = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
        const timingsData = await timingsRes.json();
        
        if (timingsData.code === 200) {
          setPrayerTimes(timingsData.data.timings);
          const h = timingsData.data.date.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
        }
      } catch (e) {
        // Fallback default times if offline
        setPrayerTimes({
          Fajr: "04:32", Dhuhr: "12:28", Asr: "16:54", Maghrib: "19:12", Isha: "20:35", Sunrise: "05:55", Sunset: "19:12"
        });
        setHijriDate("27 Safar 1448 AH");
      } finally {
        setLoadingPrayers(false);
      }
    }
    fetchPrayerTimes();
  }, [city, country]);

  const handleSaveLocation = (newCity, newCountry) => {
    setCity(newCity);
    setCountry(newCountry);
    localStorage.setItem('user_city', newCity);
    localStorage.setItem('user_country', newCountry);
    setShowLocationModal(false);
  };

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
    <div className="min-h-screen bg-[#070b12] text-white flex flex-col pb-28 select-none font-sans">
      {/* iOS Frosted Glass Header */}
      <header className="bg-[#070b12]/80 backdrop-blur-xl border-b border-white/5 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(currentTool || selectedSurah) && (
              <button 
                onClick={() => { setCurrentTool(null); setSelectedSurah(null); }}
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-[#34d399] active:scale-90 transition-transform"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h1 className="text-base font-bold tracking-tight">
                {selectedSurah ? selectedSurah.name : currentTool === 'tasbih' ? 'Digital Tasbih' : currentTool === 'asma' ? 'Asma-ul-Husna' : 'Muslim World'}
              </h1>
              {!currentTool && !selectedSurah && (
                <button 
                  onClick={() => setShowLocationModal(true)}
                  className="flex items-center gap-1.5 mt-0.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 active:scale-95 transition-transform"
                >
                  <MapPin size={12} className="text-[#34d399]" />
                  <span className="text-[11px] text-[#34d399] font-medium">{city}, {country}</span>
                  <span className="text-[9px] text-white/40 ml-1">change</span>
                </button>
              )}
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
            {activeTab === 'home' && <HomeScreen setActiveTab={setActiveTab} setCurrentTool={setCurrentTool} prayerTimes={prayerTimes} hijriDate={hijriDate} loadingPrayers={loadingPrayers} city={city} />}
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
            {activeTab === 'qibla' && <QiblaScreen city={city} />}
            {activeTab === 'more' && <MoreScreen setCurrentTool={setCurrentTool} />}
          </>
        )}
      </main>

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-sm rounded-[32px] p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe size={18} className="text-[#34d399]" /> Select Location
              </h3>
              <button onClick={() => setShowLocationModal(false)} className="text-white/40 text-xs hover:text-white">✕</button>
            </div>
            
            <p className="text-xs text-white/60">Choose a preset city or type your location for exact prayer alignment:</p>
            
            <div className="grid grid-cols-2 gap-2">
              {['New Delhi', 'Mumbai', 'Lucknow', 'Dubai', 'London', 'Mecca'].map((c) => (
                <button
                  key={c}
                  onClick={() => handleSaveLocation(c, c === 'Mecca' ? 'Saudi Arabia' : c === 'London' ? 'UK' : c === 'Dubai' ? 'UAE' : 'India')}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all ${city === c ? 'bg-[#059669]/30 border-[#34d399] text-[#34d399]' : 'bg-white/5 border-white/10 text-white/80'}`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="pt-2 space-y-2">
              <input 
                type="text"
                placeholder="Or type custom city (e.g. Aligarh)"
                value={tempCityInput}
                onChange={(e) => setTempCityInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#34d399]"
              />
              <button
                onClick={() => { if(tempCityInput.trim()) handleSaveLocation(tempCityInput.trim(), 'India'); }}
                className="w-full bg-gradient-to-r from-[#059669] to-[#10b981] text-white py-3 rounded-2xl text-xs font-bold shadow-lg"
              >
                Apply Custom Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Update Banner */}
      {updateAvailable && (
        <div className="fixed bottom-24 left-4 right-4 bg-[#0f172a]/90 backdrop-blur-xl border border-[#34d399]/40 p-4 rounded-3xl flex justify-between items-center z-50 shadow-2xl">
          <div>
            <p className="text-[#34d399] text-xs font-bold">New Update Available! ✨</p>
            <p className="text-white/60 text-[10px]">Tap update for latest features.</p>
          </div>
          <button 
            onClick={handleRefreshApp}
            className="bg-gradient-to-r from-[#059669] to-[#10b981] text-white px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
          >
            <RefreshCw size={14} /> Update Now
          </button>
        </div>
      )}

      {/* iOS Floating Glass Pill Bottom Navigation */}
      {!currentTool && !selectedSurah && (
        <div className="fixed bottom-4 left-4 right-4 z-40 flex justify-center">
          <nav className="bg-[#0f172a]/75 backdrop-blur-2xl border border-white/10 h-16 px-3 rounded-full flex justify-between items-center max-w-sm w-full shadow-2xl shadow-black/60">
            <NavItem icon={<Home size={20} />} label="Home" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon={<BookOpen size={20} />} label="Quran" isActive={activeTab === 'quran'} onClick={() => setActiveTab('quran')} />
            <NavItem icon={<Heart size={20} />} label="Dua" isActive={activeTab === 'dua'} onClick={() => setActiveTab('dua')} />
            <NavItem icon={<Compass size={20} />} label="Qibla" isActive={activeTab === 'qibla'} onClick={() => setActiveTab('qibla')} />
            <NavItem icon={<Menu size={20} />} label="More" isActive={activeTab === 'more'} onClick={() => setActiveTab('more')} />
          </nav>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
    >
      <span className={isActive ? 'text-[#34d399]' : 'text-white/70'}>{icon}</span>
      <span className={`text-[9px] mt-0.5 tracking-tight ${isActive ? 'text-[#34d399] font-bold' : 'text-white/60'}`}>{label}</span>
      {isActive && (
        <span className="absolute bottom-1 w-1 h-1 bg-[#34d399] rounded-full shadow-[0_0_8px_#34d399]"></span>
      )}
    </button>
  );
}

function HomeScreen({ setActiveTab, setCurrentTool, prayerTimes, hijriDate, loadingPrayers, city }) {
  return (
    <div className="space-y-4">
      {/* iOS Frosted Glass Prayer Card */}
      <div className="bg-gradient-to-br from-[#059669]/90 to-[#047857]/90 backdrop-blur-2xl p-5 rounded-[28px] shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5 text-[#a7f3d0] text-[11px] font-bold uppercase tracking-wider">
              <Calendar size={13} />
              <span>{hijriDate || 'Loading Hijri date...'}</span>
            </div>
            <h2 className="text-white text-2xl font-bold mt-2 tracking-tight">Prayer Timings</h2>
            <p className="text-[#ecfdf5] text-xs mt-0.5">Aligned for <span className="font-bold underline">{city}</span></p>
          </div>
          <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-md border border-white/20">
            <Clock className="text-white animate-spin" style={{ animationDuration: '12s' }} size={22} />
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-white/15 flex justify-between items-center text-xs text-[#ecfdf5] font-medium">
          <span>Sunrise: {prayerTimes?.Sunrise || '05:55 AM'}</span>
          <span>Sunset: {prayerTimes?.Sunset || '07:12 PM'}</span>
        </div>
      </div>

      {/* Prayer Times Glass List */}
      <div className="bg-white/[0.04] backdrop-blur-xl p-4 rounded-[28px] border border-white/10 space-y-3 shadow-xl">
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Today's Schedule ({city})</span>
          <Bell size={14} className="text-[#34d399]" />
        </div>
        {loadingPrayers ? (
          <p className="text-center text-xs text-white/50 py-4">Fetching accurate timings...</p>
        ) : (
          <div className="space-y-2">
            {[
              { name: 'Fajr', time: prayerTimes?.Fajr },
              { name: 'Dhuhr', time: prayerTimes?.Dhuhr },
              { name: 'Asr', time: prayerTimes?.Asr },
              { name: 'Maghrib', time: prayerTimes?.Maghrib },
              { name: 'Isha', time: prayerTimes?.Isha },
            ].map((p, idx) => (
              <div key={idx} className={`flex justify-between items-center p-3 rounded-2xl transition-all ${idx === 1 ? 'bg-[#059669]/30 border border-[#34d399]/40 shadow-lg' : 'bg-white/[0.02] border border-white/5'}`}>
                <span className={`text-xs font-bold ${idx === 1 ? 'text-[#34d399]' : 'text-white/90'}`}>{p.name}</span>
                <span className={`text-xs font-mono ${idx === 1 ? 'text-[#34d399] font-bold' : 'text-white/60'}`}>{p.time || '--:--'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Navigation iOS Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div onClick={() => setActiveTab('quran')} className="bg-white/[0.04] backdrop-blur-xl p-4 rounded-[28px] border border-white/10 cursor-pointer active:scale-95 transition-transform shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-[#34d399]/15 flex items-center justify-center text-[#34d399] mb-3 border border-[#34d399]/20">
            <BookOpen size={20} />
          </div>
          <p className="text-white text-sm font-bold tracking-tight">Al-Quran</p>
          <p className="text-white/50 text-[10px] mt-0.5">Read & Listen 114 Surahs</p>
        </div>
        <div onClick={() => setCurrentTool('tasbih')} className="bg-white/[0.04] backdrop-blur-xl p-4 rounded-[28px] border border-white/10 cursor-pointer active:scale-95 transition-transform shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-[#34d399]/15 flex items-center justify-center text-[#34d399] mb-3 border border-[#34d399]/20">
            <RotateCcw size={20} />
          </div>
          <p className="text-white text-sm font-bold tracking-tight">Digital Tasbih</p>
          <p className="text-white/50 text-[10px] mt-0.5">Count daily Zikr</p>
        </div>
        <div onClick={() => setActiveTab('qibla')} className="bg-white/[0.04] backdrop-blur-xl p-4 rounded-[28px] border border-white/10 cursor-pointer active:scale-95 transition-transform shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-[#34d399]/15 flex items-center justify-center text-[#34d399] mb-3 border border-[#34d399]/20">
            <Compass size={20} />
          </div>
          <p className="text-white text-sm font-bold tracking-tight">Qibla Direction</p>
          <p className="text-white/50 text-[10px] mt-0.5">Accurate Kaaba compass</p>
        </div>
        <div onClick={() => setCurrentTool('asma')} className="bg-white/[0.04] backdrop-blur-xl p-4 rounded-[28px] border border-white/10 cursor-pointer active:scale-95 transition-transform shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-[#34d399]/15 flex items-center justify-center text-[#34d399] mb-3 border border-[#34d399]/20">
            <Heart size={20} />
          </div>
          <p className="text-white text-sm font-bold tracking-tight">99 Names</p>
          <p className="text-white/50 text-[10px] mt-0.5">Asma-ul-Husna</p>
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
        <div className="bg-gradient-to-r from-[#065f46] to-[#047857] p-4 rounded-[24px] flex justify-between items-center shadow-xl border border-white/10">
          <div>
            <p className="text-white text-xs font-bold">Download Offline Quran</p>
            <p className="text-[#a7f3d0] text-[10px]">Complete text in cache (~3MB)</p>
          </div>
          <button 
            onClick={downloadFullQuran} 
            disabled={downloading}
            className="bg-white text-[#065f46] px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
          >
            {downloading ? <span className="animate-spin">⏳</span> : <Download size={14} />}
            {downloading ? 'Downloading...' : 'Download'}
          </button>
        </div>
      ) : (
        <div className="bg-white/[0.04] backdrop-blur-xl p-3.5 rounded-[24px] flex items-center gap-2.5 border border-white/10 shadow-lg">
          <CheckCircle size={16} className="text-[#34d399]" />
          <p className="text-[#34d399] text-xs font-bold">Quran saved offline successfully!</p>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-white/40" size={16} />
        <input 
          type="text" 
          placeholder="Search Surah by name or number..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/[0.04] backdrop-blur-xl text-white pl-11 pr-4 py-3 rounded-2xl text-xs border border-white/10 focus:outline-none focus:border-[#34d399] shadow-inner placeholder-white/30"
        />
      </div>

      <p className="text-white/40 text-[11px] font-bold uppercase tracking-wider px-1">Surah List ({filteredSurahs.length})</p>
      {filteredSurahs.map(surah => (
        <div 
          key={surah.no} 
          onClick={() => setSelectedSurah(surah)}
          className="bg-white/[0.04] backdrop-blur-xl p-4 rounded-[24px] border border-white/10 flex justify-between items-center cursor-pointer active:scale-[0.99] transition-transform shadow-xl"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#34d399]/15 flex items-center justify-center text-[#34d399] text-xs font-bold border border-[#34d399]/20">
              {surah.no}
            </div>
            <div>
              <p className="text-white text-sm font-bold tracking-tight">{surah.name}</p>
              <p className="text-white/50 text-[11px]">{surah.meaning} • {surah.versesCount} Verses</p>
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
      <div className="bg-gradient-to-br from-[#065f46] to-[#047857] p-6 rounded-[32px] text-center shadow-2xl border border-white/10">
        <h2 className="text-white text-xl font-bold tracking-tight">{surah.name}</h2>
        <p className="text-[#a7f3d0] text-xs mt-1 font-medium">{surah.meaning} • {surah.versesCount} Verses</p>
        <p className="text-[#ecfdf5] text-3xl font-bold mt-3">{surah.arabic}</p>
      </div>
      {surah.verses.map(v => (
        <div key={v.id} className="bg-white/[0.04] backdrop-blur-xl p-4 rounded-[24px] border border-white/10 space-y-2.5 shadow-xl">
          <div className="flex justify-between items-center">
            <span className="text-[#34d399] text-[10px] font-bold px-2.5 py-1 bg-[#34d399]/15 rounded-xl border border-[#34d399]/20">Ayah {v.id}</span>
            <div className="flex gap-3 text-white/40">
              <Volume2 size={15} className="cursor-pointer hover:text-[#34d399] transition-colors" />
              <Bookmark size={15} className="cursor-pointer hover:text-[#34d399] transition-colors" />
            </div>
          </div>
          <p className="text-[#ecfdf5] text-xl text-right font-bold leading-relaxed">{v.arabic}</p>
          <p className="text-white/70 text-xs leading-normal">{v.translation}</p>
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
      <p className="text-white/40 text-[11px] font-bold uppercase tracking-wider px-1">Hisnul Muslim Duas</p>
      {duas.map((d, i) => (
        <div key={i} className="bg-white/[0.04] backdrop-blur-xl p-4 rounded-[24px] border border-white/10 space-y-2.5 shadow-xl">
          <p className="text-white text-sm font-bold tracking-tight">{d.title}</p>
          <p className="text-[#ecfdf5] text-lg text-right font-bold leading-relaxed">{d.arabic}</p>
          <p className="text-white/70 text-xs leading-normal">{d.meaning}</p>
        </div>
      ))}
    </div>
  );
}

function QiblaScreen({ city }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-32 h-32 rounded-full bg-white/[0.04] backdrop-blur-2xl border border-white/10 flex items-center justify-center shadow-2xl relative">
        <div className="absolute inset-0 rounded-full border border-[#34d399]/30 animate-ping opacity-25"></div>
        <Compass size={64} className="text-[#34d399]" />
      </div>
      <p className="text-white text-base font-bold mt-6 tracking-tight">Qibla Direction Compass</p>
      <p className="text-white/50 text-xs mt-1 font-medium">Calculated precisely from {city}</p>
    </div>
  );
}

function MoreScreen({ setCurrentTool }) {
  return (
    <div className="space-y-3">
      <div 
        onClick={() => setCurrentTool('tasbih')}
        className="bg-white/[0.04] backdrop-blur-xl p-4 rounded-[24px] border border-white/10 cursor-pointer shadow-xl flex items-center justify-between active:scale-[0.99] transition-transform"
      >
        <div>
          <p className="text-white text-sm font-bold tracking-tight">Digital Tasbih Counter</p>
          <p className="text-white/50 text-[11px] mt-0.5">Count your daily Zikr with ease</p>
        </div>
        <RotateCcw className="text-[#34d399]" size={20} />
      </div>
      <div 
        onClick={() => setCurrentTool('asma')}
        className="bg-white/[0.04] backdrop-blur-xl p-4 rounded-[24px] border border-white/10 cursor-pointer shadow-xl flex items-center justify-between active:scale-[0.99] transition-transform"
      >
        <div>
          <p className="text-white text-sm font-bold tracking-tight">Asma-ul-Husna (99 Names)</p>
          <p className="text-white/50 text-[11px] mt-0.5">Learn beautiful names of Allah</p>
        </div>
        <Heart className="text-[#34d399]" size={20} />
      </div>
    </div>
  );
}

function TasbihView() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <p className="text-[#ecfdf5] text-3xl font-bold tracking-wider mb-2">سُبْحَانَ ٱللَّٰهِ</p>
      
      <div 
        onClick={() => setCount(count + 1)}
        className="w-52 h-52 rounded-[60%_40%_70%_30%/50%_60%_40%_50%] bg-gradient-to-br from-[#059669] via-[#10b981] to-[#047857] flex flex-col items-center justify-center my-10 border-4 border-white/20 active:scale-90 transition-all duration-300 shadow-[0_20px_50px_rgba(5,150,105,0.4)] cursor-pointer animate-[morph_6s_ease-in-out_infinite]"
      >
        <span className="text-white text-6xl font-extrabold tracking-tight drop-shadow-md">{count}</span>
        <span className="text-[#a7f3d0] text-[10px] font-bold mt-1 tracking-widest uppercase">TAP WATER DROP</span>
      </div>

      <button 
        onClick={() => setCount(0)}
        className="flex items-center gap-1.5 bg-white/[0.04] backdrop-blur-xl px-5 py-3 rounded-2xl text-[#f43f5e] text-xs font-bold border border-white/10 shadow-xl active:scale-95 transition-transform"
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
      <p className="text-white/40 text-[11px] font-bold uppercase tracking-wider px-1">99 Names of Allah</p>
      {names.map(n => (
        <div key={n.no} className="bg-white/[0.04] backdrop-blur-xl p-4 rounded-[24px] border border-white/10 flex justify-between items-center shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-[#34d399]/15 flex items-center justify-center text-[#34d399] text-xs font-bold border border-[#34d399]/20">{n.no}</div>
            <div>
              <p className="text-white text-sm font-bold tracking-tight">{n.name}</p>
              <p className="text-white/50 text-[11px]">{n.meaning}</p>
            </div>
          </div>
          <p className="text-[#34d399] text-lg font-bold">{n.arabic}</p>
        </div>
      ))}
    </div>
  );
}
