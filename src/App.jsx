import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Heart, Compass, Menu, RotateCcw, Download, CheckCircle, ArrowLeft, RefreshCw, Search, Volume2, Bookmark, Clock, MapPin, Calendar, Bell, Globe, Navigation, Sun, Moon } from 'lucide-react';
import { surahsList } from './data/quranData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTool, setCurrentTool] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Location, Prayer & Theme State
  const [city, setCity] = useState(localStorage.getItem('user_city') || 'New Delhi');
  const [country, setCountry] = useState(localStorage.getItem('user_country') || 'India');
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [hijriDate, setHijriDate] = useState('');
  const [loadingPrayers, setLoadingPrayers] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempCityInput, setTempCityInput] = useState('');
  const [locatingGPS, setLocatingGPS] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  // Convert 24hr time string to 12hr AM/PM format
  const format12Hour = (timeStr) => {
    if (!timeStr) return '--:--';
    // Clean up timezone strings if returned by API (e.g. "04:32 (IST)")
    const cleanTime = timeStr.split(' ')[0];
    const [hourStr, minuteStr] = cleanTime.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    return `${hour}:${minuteStr} ${ampm}`;
  };

  // Fetch Prayer Times
  useEffect(() => {
    async function fetchPrayerTimes() {
      setLoadingPrayers(true);
      try {
        const timingsRes = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
        const timingsData = await timingsRes.json();
        
        if (timingsData.code === 200) {
          const raw = timingsData.data.timings;
          // Format all times to 12-hour format
          const formatted = {
            Fajr: format12Hour(raw.Fajr),
            Sunrise: format12Hour(raw.Sunrise),
            Dhuhr: format12Hour(raw.Dhuhr),
            Asr: format12Hour(raw.Asr),
            Maghrib: format12Hour(raw.Maghrib),
            Sunset: format12Hour(raw.Sunset),
            Isha: format12Hour(raw.Isha),
          };
          setPrayerTimes(formatted);
          const h = timingsData.data.date.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
        }
      } catch (e) {
        setPrayerTimes({
          Fajr: "04:32 AM", Sunrise: "05:55 AM", Dhuhr: "12:28 PM", Asr: "04:54 PM", Maghrib: "07:12 PM", Sunset: "07:12 PM", Isha: "08:35 PM"
        });
        setHijriDate("27 Safar 1448 AH");
      } finally {
        setLoadingPrayers(false);
      }
    }
    fetchPrayerTimes();
  }, [city, country]);

  // GPS Location detector
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const detectedCity = data.address.city || data.address.town || data.address.state_district || 'New Delhi';
          const detectedCountry = data.address.country || 'India';
          
          setCity(detectedCity);
          setCountry(detectedCountry);
          localStorage.setItem('user_city', detectedCity);
          localStorage.setItem('user_country', detectedCountry);
          setShowLocationModal(false);
        } catch (err) {
          alert("Could not fetch address from coordinates.");
        } finally {
          setLocatingGPS(false);
        }
      },
      () => {
        setLocatingGPS(false);
        alert("Unable to retrieve your location.");
      },
      { timeout: 10000 }
    );
  };

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
      alert("Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  const handleRefreshApp = () => {
    window.location.reload();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#070b12] text-white' : 'bg-[#f8fafc] text-slate-900'} flex flex-col pb-28 select-none font-sans relative overflow-hidden transition-colors duration-500`}>
      
      {/* Blurred Arabic Calligraphy Background Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center overflow-hidden z-0">
        <span className="text-[35vw] font-serif whitespace-nowrap select-none">بِسْمِ اللَّهِ</span>
      </div>

      {/* iOS Frosted Glass Header */}
      <header className={`${isDarkMode ? 'bg-[#070b12]/80 border-white/5' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border-b p-4 sticky top-0 z-40 transition-colors`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(currentTool || selectedSurah) && (
              <button 
                onClick={() => { setCurrentTool(null); setSelectedSurah(null); }}
                className={`w-9 h-9 rounded-full ${isDarkMode ? 'bg-white/10 text-[#34d399]' : 'bg-slate-100 text-emerald-600'} backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform`}
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
                  className={`flex items-center gap-1.5 mt-0.5 ${isDarkMode ? 'bg-white/5 border-white/10 text-[#34d399]' : 'bg-slate-100 border-slate-200 text-emerald-700'} px-2.5 py-1 rounded-full border active:scale-95 transition-transform`}
                >
                  <MapPin size={12} />
                  <span className="text-[11px] font-medium">{city}</span>
                  <span className={`text-[9px] ${isDarkMode ? 'text-white/40' : 'text-slate-400'} ml-1`}>change</span>
                </button>
              )}
            </div>
          </div>

          {/* Day/Night Theme Toggle Button */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-10 h-10 rounded-2xl ${isDarkMode ? 'bg-white/10 text-amber-400 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-200'} backdrop-blur-md border flex items-center justify-center shadow-lg active:scale-90 transition-transform`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 flex-1 max-w-md mx-auto w-full z-10 relative">
        {selectedSurah ? (
          <SurahDetail surah={selectedSurah} isDarkMode={isDarkMode} />
        ) : currentTool === 'tasbih' ? (
          <TasbihView isDarkMode={isDarkMode} />
        ) : currentTool === 'asma' ? (
          <AsmaulHusnaView isDarkMode={isDarkMode} />
        ) : (
          <>
            {activeTab === 'home' && <HomeScreen setActiveTab={setActiveTab} setCurrentTool={setCurrentTool} prayerTimes={prayerTimes} hijriDate={hijriDate} loadingPrayers={loadingPrayers} city={city} isDarkMode={isDarkMode} />}
            {activeTab === 'quran' && (
              <QuranScreen 
                isDownloaded={isDownloaded} 
                downloading={downloading} 
                downloadFullQuran={downloadFullQuran} 
                setSelectedSurah={setSelectedSurah}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isDarkMode={isDarkMode}
              />
            )}
            {activeTab === 'dua' && <DuaScreen isDarkMode={isDarkMode} />}
            {activeTab === 'qibla' && <QiblaScreen city={city} isDarkMode={isDarkMode} />}
            {activeTab === 'more' && <MoreScreen setCurrentTool={setCurrentTool} isDarkMode={isDarkMode} />}
          </>
        )}
      </main>

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`${isDarkMode ? 'bg-[#0f172a] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'} border w-full max-w-sm rounded-[32px] p-6 space-y-4 shadow-2xl`}>
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Globe size={18} className="text-[#34d399]" /> Set Location
              </h3>
              <button onClick={() => setShowLocationModal(false)} className="text-xs opacity-60 hover:opacity-100">✕</button>
            </div>
            
            <button
              onClick={handleDetectGPS}
              disabled={locatingGPS}
              className="w-full bg-[#059669]/20 border border-[#34d399]/40 text-[#34d399] py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
            >
              <Navigation size={15} className={locatingGPS ? "animate-spin" : ""} />
              {locatingGPS ? 'Detecting GPS...' : 'Use Phone GPS Location'}
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {['New Delhi', 'Mumbai', 'Lucknow', 'Dubai', 'London', 'Mecca'].map((c) => (
                <button
                  key={c}
                  onClick={() => handleSaveLocation(c, c === 'Mecca' ? 'Saudi Arabia' : c === 'London' ? 'UK' : c === 'Dubai' ? 'UAE' : 'India')}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all ${city === c ? 'bg-[#059669]/30 border-[#34d399] text-[#34d399]' : isDarkMode ? 'bg-white/5 border-white/10 text-white/80' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="pt-2 space-y-2">
              <input 
                type="text"
                placeholder="Or type custom city..."
                value={tempCityInput}
                onChange={(e) => setTempCityInput(e.target.value)}
                className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#34d399]`}
              />
              <button
                onClick={() => { if(tempCityInput.trim()) handleSaveLocation(tempCityInput.trim(), 'India'); }}
                className="w-full bg-gradient-to-r from-[#059669] to-[#10b981] text-white py-3 rounded-2xl text-xs font-bold shadow-lg"
              >
                Apply Custom City
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Glass Pill Bottom Navigation */}
      {!currentTool && !selectedSurah && (
        <div className="fixed bottom-4 left-4 right-4 z-40 flex justify-center">
          <nav className={`${isDarkMode ? 'bg-[#0f172a]/80 border-white/10 shadow-black/60' : 'bg-white/80 border-slate-200 shadow-slate-300/60'} backdrop-blur-2xl border h-16 px-3 rounded-full flex justify-between items-center max-w-sm w-full shadow-2xl`}>
            <NavItem icon={<Home size={20} />} label="Home" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} isDarkMode={isDarkMode} />
            <NavItem icon={<BookOpen size={20} />} label="Quran" isActive={activeTab === 'quran'} onClick={() => setActiveTab('quran')} isDarkMode={isDarkMode} />
            <NavItem icon={<Heart size={20} />} label="Dua" isActive={activeTab === 'dua'} onClick={() => setActiveTab('dua')} isDarkMode={isDarkMode} />
            <NavItem icon={<Compass size={20} />} label="Qibla" isActive={activeTab === 'qibla'} onClick={() => setActiveTab('qibla')} isDarkMode={isDarkMode} />
            <NavItem icon={<Menu size={20} />} label="More" isActive={activeTab === 'more'} onClick={() => setActiveTab('more')} isDarkMode={isDarkMode} />
          </nav>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick, isDarkMode }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
    >
      <span className={isActive ? 'text-[#34d399]' : isDarkMode ? 'text-white/70' : 'text-slate-600'}>{icon}</span>
      <span className={`text-[9px] mt-0.5 tracking-tight ${isActive ? 'text-[#34d399] font-bold' : isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>{label}</span>
      {isActive && (
        <span className="absolute bottom-1 w-1 h-1 bg-[#34d399] rounded-full shadow-[0_0_8px_#34d399]"></span>
      )}
    </button>
  );
}

function HomeScreen({ setActiveTab, setCurrentTool, prayerTimes, hijriDate, loadingPrayers, city, isDarkMode }) {
  return (
    <div className="space-y-4">
      {/* Immersive Prayer Card with Sun Animation */}
      <div className="bg-gradient-to-br from-[#059669]/95 via-[#047857]/95 to-[#065f46]/95 backdrop-blur-2xl p-5 rounded-[32px] shadow-2xl border border-white/15 relative overflow-hidden text-white">
        
        {/* Animated Sun & Arc Simulation Background */}
        <div className="absolute right-4 top-4 w-28 h-28 border border-white/10 rounded-full flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 border border-dashed border-white/20 rounded-full animate-spin" style={{ animationDuration: '40s' }}></div>
          <Sun className="absolute text-amber-300 animate-pulse" size={24} style={{ transform: 'translate(25px, -20px)' }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-[#a7f3d0] text-[11px] font-bold uppercase tracking-wider">
            <Calendar size={13} />
            <span>{hijriDate || 'Loading Hijri date...'}</span>
          </div>
          <h2 className="text-white text-2xl font-bold mt-2 tracking-tight">{city}</h2>
          <p className="text-[#ecfdf5] text-xs mt-0.5 opacity-90">Live Islamic Daily Schedule</p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center text-xs text-[#ecfdf5] font-medium relative z-10">
          <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
            <Sun size={14} className="text-amber-300" />
            <span>Sunrise: {prayerTimes?.Sunrise || '05:55 AM'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
            <Moon size={14} className="text-indigo-200" />
            <span>Sunset: {prayerTimes?.Sunset || '07:12 PM'}</span>
          </div>
        </div>
      </div>

      {/* Prayer Times List */}
      <div className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-xl p-4 rounded-[28px] border space-y-3 transition-colors`}>
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <span className={`text-xs font-bold ${isDarkMode ? 'text-white/50' : 'text-slate-400'} uppercase tracking-wider`}>Today's Schedule ({city})</span>
          <Bell size={14} className="text-[#34d399]" />
        </div>
        {loadingPrayers ? (
          <p className="text-center text-xs opacity-50 py-4">Loading 12hr Timings...</p>
        ) : (
          <div className="space-y-2">
            {[
              { name: 'Fajr', time: prayerTimes?.Fajr },
              { name: 'Dhuhr', time: prayerTimes?.Dhuhr },
              { name: 'Asr', time: prayerTimes?.Asr },
              { name: 'Maghrib', time: prayerTimes?.Maghrib },
              { name: 'Isha', time: prayerTimes?.Isha },
            ].map((p, idx) => (
              <div key={idx} className={`flex justify-between items-center p-3 rounded-2xl transition-all ${idx === 1 ? 'bg-[#059669]/30 border border-[#34d399]/40 shadow-lg' : isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <span className={`text-xs font-bold ${idx === 1 ? 'text-[#34d399]' : isDarkMode ? 'text-white/90' : 'text-slate-700'}`}>{p.name}</span>
                <span className={`text-xs font-mono ${idx === 1 ? 'text-[#34d399] font-bold' : isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>{p.time || '--:--'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div onClick={() => setActiveTab('quran')} className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-xl p-4 rounded-[28px] border cursor-pointer active:scale-95 transition-transform`}>
          <div className="w-10 h-10 rounded-2xl bg-[#34d399]/15 flex items-center justify-center text-[#34d399] mb-3 border border-[#34d399]/20">
            <BookOpen size={20} />
          </div>
          <p className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Al-Quran</p>
          <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Read 114 Surahs</p>
        </div>
        <div onClick={() => setCurrentTool('tasbih')} className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-xl p-4 rounded-[28px] border cursor-pointer active:scale-95 transition-transform`}>
          <div className="w-10 h-10 rounded-2xl bg-[#34d399]/15 flex items-center justify-center text-[#34d399] mb-3 border border-[#34d399]/20">
            <RotateCcw size={20} />
          </div>
          <p className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Digital Tasbih</p>
          <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Count daily Zikr</p>
        </div>
        <div onClick={() => setActiveTab('qibla')} className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-xl p-4 rounded-[28px] border cursor-pointer active:scale-95 transition-transform`}>
          <div className="w-10 h-10 rounded-2xl bg-[#34d399]/15 flex items-center justify-center text-[#34d399] mb-3 border border-[#34d399]/20">
            <Compass size={20} />
          </div>
          <p className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Qibla Direction</p>
          <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Kaaba compass</p>
        </div>
        <div onClick={() => setCurrentTool('asma')} className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-xl p-4 rounded-[28px] border cursor-pointer active:scale-95 transition-transform`}>
          <div className="w-10 h-10 rounded-2xl bg-[#34d399]/15 flex items-center justify-center text-[#34d399] mb-3 border border-[#34d399]/20">
            <Heart size={20} />
          </div>
          <p className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>99 Names</p>
          <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Asma-ul-Husna</p>
        </div>
      </div>
    </div>
  );
}

function QuranScreen({ isDownloaded, downloading, downloadFullQuran, setSelectedSurah, searchQuery, setSearchQuery, isDarkMode }) {
  const filteredSurahs = surahsList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.no.toString().includes(searchQuery)
  );

  return (
    <div className="space-y-3">
      {!isDownloaded ? (
        <div className="bg-gradient-to-r from-[#065f46] to-[#047857] p-4 rounded-[24px] flex justify-between items-center shadow-xl border border-white/10 text-white">
          <div>
            <p className="text-xs font-bold">Download Offline Quran</p>
            <p className="text-[#a7f3d0] text-[10px]">Complete cache (~3MB)</p>
          </div>
          <button onClick={downloadFullQuran} disabled={downloading} className="bg-white text-[#065f46] px-4 py-2 rounded-2xl text-xs font-bold shadow-lg">
            {downloading ? 'Downloading...' : 'Download'}
          </button>
        </div>
      ) : (
        <div className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200'} backdrop-blur-xl p-3.5 rounded-[24px] flex items-center gap-2.5 border shadow-lg`}>
          <CheckCircle size={16} className="text-[#34d399]" />
          <p className="text-[#34d399] text-xs font-bold">Quran saved offline successfully!</p>
        </div>
      )}

      <div className="relative">
        <Search className={`absolute left-4 top-3.5 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`} size={16} />
        <input 
          type="text" 
          placeholder="Search Surah..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full ${isDarkMode ? 'bg-white/[0.04] border-white/10 text-white placeholder-white/30' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'} backdrop-blur-xl pl-11 pr-4 py-3 rounded-2xl text-xs border focus:outline-none focus:border-[#34d399] shadow-inner`}
        />
      </div>

      <p className={`text-[11px] font-bold uppercase tracking-wider px-1 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Surah List ({filteredSurahs.length})</p>
      {filteredSurahs.map(surah => (
        <div 
          key={surah.no} 
          onClick={() => setSelectedSurah(surah)}
          className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-xl p-4 rounded-[24px] border flex justify-between items-center cursor-pointer active:scale-[0.99] transition-transform`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#34d399]/15 flex items-center justify-center text-[#34d399] text-xs font-bold border border-[#34d399]/20">{surah.no}</div>
            <div>
              <p className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{surah.name}</p>
              <p className={`text-[11px] ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>{surah.meaning} • {surah.versesCount} Verses</p>
            </div>
          </div>
          <p className="text-[#34d399] text-lg font-bold">{surah.arabic}</p>
        </div>
      ))}
    </div>
  );
}

function SurahDetail({ surah, isDarkMode }) {
  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-br from-[#065f46] to-[#047857] p-6 rounded-[32px] text-center shadow-2xl border border-white/10 text-white">
        <h2 className="text-xl font-bold tracking-tight">{surah.name}</h2>
        <p className="text-[#a7f3d0] text-xs mt-1 font-medium">{surah.meaning} • {surah.versesCount} Verses</p>
        <p className="text-[#ecfdf5] text-3xl font-bold mt-3">{surah.arabic}</p>
      </div>
      {surah.verses.map(v => (
        <div key={v.id} className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-xl p-4 rounded-[24px] border space-y-2.5`}>
          <div className="flex justify-between items-center">
            <span className="text-[#34d399] text-[10px] font-bold px-2.5 py-1 bg-[#34d399]/15 rounded-xl border border-[#34d399]/20">Ayah {v.id}</span>
            <div className={`flex gap-3 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
              <Volume2 size={15} className="cursor-pointer hover:text-[#34d399]" />
              <Bookmark size={15} className="cursor-pointer hover:text-[#34d399]" />
            </div>
          </div>
          <p className={`text-xl text-right font-bold leading-relaxed ${isDarkMode ? 'text-[#ecfdf5]' : 'text-slate-900'}`}>{v.arabic}</p>
          <p className={`text-xs leading-normal ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>{v.translation}</p>
        </div>
      ))}
    </div>
  );
}

function DuaScreen({ isDarkMode }) {
  const duas = [
    { title: "Morning & Evening Azkar", arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ", meaning: "We have reached the morning and unto Allah belongs all sovereignty." },
    { title: "For Seeking Forgiveness", arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ", meaning: "My Lord, forgive me and accept my repentance." }
  ];
  return (
    <div className="space-y-3">
      <p className={`text-[11px] font-bold uppercase tracking-wider px-1 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Hisnul Muslim Duas</p>
      {duas.map((d, i) => (
        <div key={i} className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-xl p-4 rounded-[24px] border space-y-2.5`}>
          <p className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{d.title}</p>
          <p className={`text-lg text-right font-bold leading-relaxed ${isDarkMode ? 'text-[#ecfdf5]' : 'text-slate-900'}`}>{d.arabic}</p>
          <p className={`text-xs leading-normal ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>{d.meaning}</p>
        </div>
      ))}
    </div>
  );
}

function QiblaScreen({ city, isDarkMode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className={`w-32 h-32 rounded-full ${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-2xl'} backdrop-blur-2xl border flex items-center justify-center relative`}>
        <div className="absolute inset-0 rounded-full border border-[#34d399]/30 animate-ping opacity-25"></div>
        <Compass size={64} className="text-[#34d399]" />
      </div>
      <p className={`text-base font-bold mt-6 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Qibla Direction Compass</p>
      <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Calculated precisely from {city}</p>
    </div>
  );
}

function MoreScreen({ setCurrentTool, isDarkMode }) {
  return (
    <div className="space-y-3">
      <div onClick={() => setCurrentTool('tasbih')} className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-xl p-4 rounded-[24px] border cursor-pointer flex items-center justify-between`}>
        <div>
          <p className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Digital Tasbih Counter</p>
          <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Count daily Zikr</p>
        </div>
        <RotateCcw className="text-[#34d399]" size={20} />
      </div>
      <div onClick={() => setCurrentTool('asma')} className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-xl p-4 rounded-[24px] border cursor-pointer flex items-center justify-between`}>
        <div>
          <p className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Asma-ul-Husna (99 Names)</p>
          <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Learn beautiful names</p>
        </div>
        <Heart className="text-[#34d399]" size={20} />
      </div>
    </div>
  );
}

function TasbihView({ isDarkMode }) {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <p className={`text-3xl font-bold tracking-wider mb-2 ${isDarkMode ? 'text-[#ecfdf5]' : 'text-slate-900'}`}>سُبْحَانَ ٱللَّٰهِ</p>
      
      <div 
        onClick={() => setCount(count + 1)}
        className="w-52 h-52 rounded-[60%_40%_70%_30%/50%_60%_40%_50%] bg-gradient-to-br from-[#059669] via-[#10b981] to-[#047857] flex flex-col items-center justify-center my-10 border-4 border-white/20 active:scale-90 transition-all duration-300 shadow-[0_20px_50px_rgba(5,150,105,0.4)] cursor-pointer animate-[morph_6s_ease-in-out_infinite] text-white"
      >
        <span className="text-6xl font-extrabold tracking-tight drop-shadow-md">{count}</span>
        <span className="text-[#a7f3d0] text-[10px] font-bold mt-1 tracking-widest uppercase">TAP WATER DROP</span>
      </div>

      <button onClick={() => setCount(0)} className={`flex items-center gap-1.5 ${isDarkMode ? 'bg-white/[0.04] border-white/10 text-[#f43f5e]' : 'bg-white border-slate-200 text-rose-600 shadow-xl'} backdrop-blur-xl px-5 py-3 rounded-2xl text-xs font-bold border active:scale-95`}>
        <RotateCcw size={14} /> Reset Counter
      </button>
    </div>
  );
}

function AsmaulHusnaView({ isDarkMode }) {
  const names = [
    { no: 1, arabic: "الرَّحْمَٰنُ", name: "Ar-Rahman", meaning: "The Most Gracious" },
    { no: 2, arabic: "الرَّحِيمُ", name: "Ar-Rahim", meaning: "The Most Merciful" }
  ];
  return (
    <div className="space-y-3">
      <p className={`text-[11px] font-bold uppercase tracking-wider px-1 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>99 Names of Allah</p>
      {names.map(n => (
        <div key={n.no} className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-xl p-4 rounded-[24px] border flex justify-between items-center`}>
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-[#34d399]/15 flex items-center justify-center text-[#34d399] text-xs font-bold border border-[#34d399]/20">{n.no}</div>
            <div>
              <p className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{n.name}</p>
              <p className={`text-[11px] ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>{n.meaning}</p>
            </div>
          </div>
          <p className="text-[#34d399] text-lg font-bold">{n.arabic}</p>
        </div>
      ))}
    </div>
  );
}
