import QiblaCompass from "./components/QiblaCompass";
import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Heart, Compass, Menu, RotateCcw, Download, CheckCircle, ArrowLeft, RefreshCw, Search, Volume2, Bookmark, Clock, MapPin, Calendar, Bell, Globe, Navigation, Sun, Moon, Sparkles, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('mw_theme') !== 'light';
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Premium Prayer Configuration
  const [prayerMode, setPrayerMode] = useState(localStorage.getItem('mw_prayer_mode') || 'location');
  const [calculationMethod, setCalculationMethod] = useState(localStorage.getItem('mw_calc_method') || '2');
  const [madhab, setMadhab] = useState(localStorage.getItem('mw_madhab') || '0');
  const [selectedMasjid, setSelectedMasjid] = useState(localStorage.getItem('mw_selected_masjid') || '');
  const [masjids, setMasjids] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mw_masjids') || '[]'); }
    catch { return []; }
  });
  const [nextPrayer, setNextPrayer] = useState(null);
  const [prayerCountdown, setPrayerCountdown] = useState('');
  const [showPrayerSettings, setShowPrayerSettings] = useState(false);
  const [jummahTime, setJummahTime] = useState(localStorage.getItem('mw_jummah_time') || '01:30 PM');
  const [sehriReminder, setSehriReminder] = useState(localStorage.getItem('mw_sehri_reminder') !== 'false');
  const [iftarReminder, setIftarReminder] = useState(localStorage.getItem('mw_iftar_reminder') !== 'false');
  const [prayerNotifications, setPrayerNotifications] = useState(localStorage.getItem('mw_prayer_notifications') === 'true');
  const [adhanEnabled, setAdhanEnabled] = useState(localStorage.getItem('mw_adhan') === 'true');


  // Global Premium Appearance Settings
  const [themeMode, setThemeMode] = useState(localStorage.getItem('mw_theme_mode') || 'dark');
  const [premiumGlow, setPremiumGlow] = useState(localStorage.getItem('mw_glow') !== 'false');
  const [premiumBlur, setPremiumBlur] = useState(localStorage.getItem('mw_blur') !== 'false');
  const [premium3D, setPremium3D] = useState(localStorage.getItem('mw_3d') !== 'false');
  const [reduceMotion, setReduceMotion] = useState(localStorage.getItem('mw_reduce_motion') === 'true');
  const [fontScale, setFontScale] = useState(localStorage.getItem('mw_font_scale') || '100');




  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const prayerSourceUI = (
    <section className="mw-prayer-premium-card mw-glass">
      <div className="mw-prayer-card-head">
        <div>
          <div className="mw-kicker"><Sparkles size={12}/> PRAYER TIMES</div>
          <h2>{prayerMode === 'location' ? 'Location Prayer Time' : 'Local Masjid Time'}</h2>
          <p>{prayerMode === 'location' ? `${city}, ${country}` : (activeMasjid?.name || 'Select your masjid')}</p>
        </div>
        <button
          className="mw-prayer-settings-btn"
          onClick={() => setShowPrayerSettings(true)}
          aria-label="Prayer settings"
        >
          <Navigation size={17}/>
        </button>
      </div>

      <div className="mw-prayer-mode-switch">
        <button
          className={prayerMode === 'location' ? 'active' : ''}
          onClick={() => setPrayerMode('location')}
        >
          <MapPin size={15}/> Location Time
        </button>
        <button
          className={prayerMode === 'masjid' ? 'active' : ''}
          onClick={() => setPrayerMode('masjid')}
        >
          <Heart size={15}/> Local Masjid
        </button>
      </div>

      {prayerMode === 'location' ? (
        <>
          <div className="mw-next-prayer">
            <div>
              <span>NEXT PRAYER</span>
              <strong>{nextPrayer || 'Calculating...'}</strong>
            </div>
            <div className="mw-countdown">
              {prayerCountdown || '--:--:--'}
            </div>
          </div>

          <div className="mw-prayer-grid">
            {['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'].map(name => (
              <div className="mw-prayer-time" key={name}>
                <span>{name}</span>
                <strong>{prayerTimes?.[name] || '--:--'}</strong>
              </div>
            ))}
          </div>

          <div className="mw-prayer-specials">
            <div><span>🌙 Sehri Ends</span><strong>{prayerTimes?.SehriEnd || '--:--'}</strong></div>
            <div><span>🌅 Iftar</span><strong>{prayerTimes?.Maghrib || '--:--'}</strong></div>
            <div><span>🌌 Midnight</span><strong>{prayerTimes?.Isha || '--:--'}</strong></div>
          </div>

          <div className="mw-prayer-meta">
            <span>Calculation: {calculationMethod}</span>
            <span>{madhab === '1' ? 'Hanafi' : 'Shafi / Maliki / Hanbali'}</span>
          </div>
        </>
      ) : (
        <div className="mw-masjid-panel">
          {activeMasjid ? (
            <>
              <div className="mw-masjid-selected">
                <Heart size={17}/>
                <div>
                  <strong>{activeMasjid.name}</strong>
                  <span>{activeMasjid.location || 'Local Masjid'}</span>
                </div>
              </div>

              <div className="mw-prayer-grid">
                {['Fajr','Dhuhr','Asr','Maghrib','Isha','Jumuah'].map(name => (
                  <div className="mw-prayer-time" key={name}>
                    <span>{name === 'Jumuah' ? 'Jumu’ah' : name}</span>
                    <strong>{activeMasjid.times?.[name] || '--:--'}</strong>
                  </div>
                ))}
              </div>
              <button
                className="mw-edit-masjid"
                onClick={() => setShowPrayerSettings(true)}
              >
                ⚙️ Manage Masjid
              </button>
            </>
          ) : (
            <div className="mw-masjid-empty">
              <Heart size={25}/>
              <strong>No masjid selected</strong>
              <span>Add your local masjid and enter its Jamaat times.</span>
              <button onClick={() => setShowPrayerSettings(true)}>
                Add Masjid
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );

  const prayerSettingsUI = showPrayerSettings && (
    <div className="mw-modal-backdrop" onClick={() => setShowPrayerSettings(false)}>
      <div className="mw-prayer-settings mw-glass" onClick={e => e.stopPropagation()}>
        <div className="mw-settings-head">
          <div>
            <span className="mw-kicker">PRAYER CONFIGURATION</span>
            <h2>Prayer Settings</h2>
          </div>
          <button onClick={() => setShowPrayerSettings(false)}><XCircle size={20}/></button>
        </div>

        <label>Calculation Method</label>
        <select value={calculationMethod} onChange={e => setCalculationMethod(e.target.value)}>
          <option value="2">ISNA</option>
          <option value="1">University of Islamic Sciences, Karachi</option>
          <option value="3">Muslim World League</option>
          <option value="4">Umm Al-Qura University, Makkah</option>
          <option value="5">Egyptian General Authority of Survey</option>
        </select>

        <label>Madhab / Asr</label>
        <select value={madhab} onChange={e => setMadhab(e.target.value)}>
          <option value="0">Shafi / Maliki / Hanbali</option>
          <option value="1">Hanafi</option>
        </select>

        <div className="mw-setting-divider"/>

                <div className="mw-setting-divider"/>

        <h3>Prayer Notifications</h3>

        <div className="mw-toggle-list">
          <button onClick={() => setPrayerNotifications(v => !v)}>
            <span>🔔 Prayer Notifications</span>
            <b>{prayerNotifications ? 'ON' : 'OFF'}</b>
          </button>

          <button onClick={() => setAdhanEnabled(v => !v)}>
            <span>🕌 Adhan</span>
            <b>{adhanEnabled ? 'ON' : 'OFF'}</b>
          </button>

          <button onClick={() => setSehriReminder(v => !v)}>
            <span>🌙 Sehri Reminder</span>
            <b>{sehriReminder ? 'ON' : 'OFF'}</b>
          </button>

          <button onClick={() => setIftarReminder(v => !v)}>
            <span>🌅 Iftar Reminder</span>
            <b>{iftarReminder ? 'ON' : 'OFF'}</b>
          </button>
        </div>

        <label>Jumu’ah Time</label>
        <input
          value={jummahTime}
          onChange={e => setJummahTime(e.target.value)}
          placeholder="e.g. 01:30 PM"
        />

<h3>Local Masjid</h3>
        <input id="mwMasjidName" placeholder="Masjid name"/>
        <input id="mwMasjidLocation" placeholder="Area / location"/>

        <div className="mw-masjid-input-grid">
          {['Fajr','Dhuhr','Asr','Maghrib','Isha','Jumuah'].map(name => (
            <input key={name} id={'mw_'+name} placeholder={name + ' time'}/>
          ))}
        </div>

        <button
          className="mw-save-masjid"
          onClick={() => {
            const name = document.getElementById('mwMasjidName')?.value?.trim();
            if (!name) return alert('Please enter masjid name.');
            saveMasjid({
              id: Date.now().toString(),
              name,
              location: document.getElementById('mwMasjidLocation')?.value?.trim() || '',
              times: Object.fromEntries(
                ['Fajr','Dhuhr','Asr','Maghrib','Isha','Jumuah']
                .map(x => [x, document.getElementById('mw_'+x)?.value?.trim() || ''])
              )
            });
            setPrayerMode('masjid');
            setShowPrayerSettings(false);
          }}
        >
          Save Masjid
        </button>

        {masjids.length > 0 && (
          <div className="mw-existing-masjids">
            <span>Saved Masjids</span>
            {masjids.map(m => (
              <div className="mw-masjid-row" key={m.id}>
                <button onClick={() => {
                  setSelectedMasjid(m.id);
                  localStorage.setItem('mw_selected_masjid', m.id);
                  setPrayerMode('masjid');
                }}>
                  <span>{m.name}</span>
                  {m.id === selectedMasjid && <CheckCircle2 size={16}/>}
                </button>
                <button
                  className="mw-delete-masjid"
                  onClick={() => {
                    const updated = masjids.filter(x => x.id !== m.id);
                    setMasjids(updated);
                    localStorage.setItem('mw_masjids', JSON.stringify(updated));
                    if (selectedMasjid === m.id) {
                      setSelectedMasjid(updated[0]?.id || '');
                      localStorage.setItem('mw_selected_masjid', updated[0]?.id || '');
                    }
                  }}
                >
                  <XCircle size={15}/>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('mw_theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.dataset.mwTheme = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

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

  const format12Hour = (timeStr) => {
    if (!timeStr) return '--:--';
    const cleanTime = timeStr.split(' ')[0];
    const [hourStr, minuteStr] = cleanTime.split(':');
    let hour = parseInt(hourStr, 10);
    if (isNaN(hour)) return timeStr;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${minuteStr} ${ampm}`;
  };

  const adjustTime = (timeStr, minutesToAdd) => {
    if (!timeStr) return '--:--';
    const cleanTime = timeStr.split(' ')[0];
    const [h, m] = cleanTime.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return timeStr;
    const date = new Date();
    date.setHours(h, m + minutesToAdd);
    let hh = date.getHours();
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ampm = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12;
    hh = hh ? hh : 12;
    return `${hh}:${mm} ${ampm}`;
  };

  useEffect(() => {
    async function fetchPrayerTimes() {
      setLoadingPrayers(true);
      try {
        const timingsRes = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${calculationMethod}&school=${madhab}`);
        const timingsData = await timingsRes.json();
        
        if (timingsData.code === 200) {
          const raw = timingsData.data.timings;
          
          const formatted = {
            Fajr: format12Hour(raw.Fajr),
            Sunrise: format12Hour(raw.Sunrise),
            Dhuhr: format12Hour(raw.Dhuhr),
            Asr: format12Hour(raw.Asr),
            Maghrib: format12Hour(raw.Maghrib),
            Sunset: format12Hour(raw.Sunset),
            Isha: format12Hour(raw.Isha),
            SehriEnd: format12Hour(raw.Fajr),
            Ishraq: adjustTime(raw.Sunrise, 20),
            Chasht: adjustTime(raw.Sunrise, 120),
            Zawaal: adjustTime(raw.Dhuhr, -15),
            Tahajjud: "03:15 AM"
          };
          
          setPrayerTimes(formatted);
          const h = timingsData.data.date.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
        }
      } catch (e) {
        setPrayerTimes({
          Fajr: "04:32 AM", Sunrise: "05:55 AM", Dhuhr: "12:28 PM", Asr: "04:54 PM", Maghrib: "07:12 PM", Sunset: "07:12 PM", Isha: "08:35 PM",
          SehriEnd: "04:32 AM", Ishraq: "06:15 AM", Chasht: "08:00 AM", Zawaal: "12:13 PM", Tahajjud: "03:15 AM"
        });
        setHijriDate("27 Safar 1448 AH");
      } finally {
        setLoadingPrayers(false);
      }
    }
    fetchPrayerTimes();
  }, [city, country, calculationMethod, madhab, prayerMode]);

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

  const saveMasjid = (masjid) => {
    const updated = [...masjids.filter(m => m.id !== masjid.id), masjid];
    setMasjids(updated);
    localStorage.setItem('mw_masjids', JSON.stringify(updated));
    setSelectedMasjid(masjid.id);
    localStorage.setItem('mw_selected_masjid', masjid.id);
  };

  const activeMasjid = masjids.find(m => m.id === selectedMasjid);

  useEffect(() => {
    if (!prayerTimes || prayerMode !== 'location') return;

    const updateCountdown = () => {
      const now = new Date();
      const entries = ['Fajr','Dhuhr','Asr','Maghrib','Isha']
        .map(name => ({ name, value: prayerTimes[name], minutes: parseTimeToMinutes(prayerTimes[name]) }))
        .filter(x => x.value && x.minutes >= 0);

      let next = entries.find(x => x.minutes > now.getHours() * 60 + now.getMinutes());
      if (!next && entries.length) next = { ...entries[0], tomorrow: true };

      if (!next) {
        setNextPrayer(null);
        setPrayerCountdown('');
        return;
      }

      let diff = next.minutes - (now.getHours() * 60 + now.getMinutes());
      diff = diff * 60 - now.getSeconds();
      if (next.tomorrow) diff += 24 * 60 * 60;

      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const sec = diff % 60;

      setNextPrayer(next.name);
      setPrayerCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [prayerTimes, prayerMode, currentTime]);

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

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(' ');
    if (parts.length < 2) return 0;
    const [time, modifier] = parts;
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  let activePrayer = 'Dhuhr Time';
  let dosText = "Engage in Dhikr, Quran, and lawful daily work.";
  let dontsText = "Avoid wasting time in idle talk or distractions.";

  if (prayerTimes) {
    const fajrMin = parseTimeToMinutes(prayerTimes.Fajr);
    const sunriseMin = parseTimeToMinutes(prayerTimes.Sunrise);
    const dhuhrMin = parseTimeToMinutes(prayerTimes.Dhuhr);
    const asrMin = parseTimeToMinutes(prayerTimes.Asr);
    const maghribMin = parseTimeToMinutes(prayerTimes.Maghrib);
    const ishaMin = parseTimeToMinutes(prayerTimes.Isha);
    const zawaalMin = parseTimeToMinutes(prayerTimes.Zawaal);

    if (currentMinutes >= fajrMin - 40 && currentMinutes < fajrMin) {
      activePrayer = 'Sehri Ending Soon';
      dosText = "Complete Suhoor meal & make Niyyah for fast.";
      dontsText = "Do not consume food or drink after Fajr begins.";
    } else if (currentMinutes >= fajrMin && currentMinutes < sunriseMin) {
      activePrayer = 'Fajr & Morning Azkar';
      dosText = "Offer Fajr prayer in congregation & recite Morning Azkar.";
      dontsText = "Do not sleep immediately after Fajr before sunrise.";
    } else if (currentMinutes >= sunriseMin && currentMinutes < sunriseMin + 30) {
      activePrayer = 'Ishraq Window';
      dosText = "Wait after sunrise to offer Ishraq Nafl prayer.";
      dontsText = "Avoid any prayer exactly at sunrise.";
    } else if (currentMinutes >= zawaalMin - 15 && currentMinutes <= zawaalMin + 15) {
      activePrayer = 'Zawaal (Prohibited)';
      dosText = "Engage in Istighfar, quiet reflection, and Dhikr.";
      dontsText = "Strictly do NOT offer Nafl or Qaza prayers during Zawaal.";
    } else if (currentMinutes >= dhuhrMin && currentMinutes < asrMin) {
      activePrayer = 'Dhuhr Time';
      dosText = "Perform Dhuhr prayer on time and resume productive work.";
      dontsText = "Avoid delaying prayers for worldly tasks.";
    } else if (currentMinutes >= asrMin && currentMinutes < maghribMin - 20) {
      activePrayer = 'Asr Time';
      dosText = "Offer Asr prayer and prepare for upcoming evening Azkar.";
      dontsText = "Do not delay Asr until sunset when light fades.";
    } else if (currentMinutes >= maghribMin - 20 && currentMinutes < maghribMin + 45) {
      activePrayer = 'Maghrib & Iftar';
      dosText = "Break fast promptly with dates/water; make heartfelt Dua.";
      dontsText = "Do not delay offering Maghrib prayer after Iftar.";
    } else if (currentMinutes >= ishaMin || currentMinutes < fajrMin - 40) {
      activePrayer = 'Isha & Tahajjud';
      dosText = "Offer Isha, Witr, and wake up for late night Tahajjud.";
      dontsText = "Avoid late night screen time that causes missing Fajr.";
    }
  }

  return (
    <div className={`mw-app-shell min-h-screen ${isDarkMode ? 'bg-[#07110d] text-white' : 'bg-[#f1f5f9] text-slate-900'} flex flex-col pb-28 select-none font-sans relative overflow-hidden transition-colors duration-500`}>      <div className="mw-premium-orb mw-premium-orb-one" />      <div className="mw-premium-orb mw-premium-orb-two" />
      
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.025] flex items-center justify-center overflow-hidden z-0">
        <span className="text-[35vw] font-serif whitespace-nowrap select-none">بِسْمِ اللَّهِ</span>
      </div>

      {/* Strictly Fixed Header with Complete Live Guidance */}
      <div className="sticky top-0 left-0 right-0 z-50">
        <header className={`${isDarkMode ? 'bg-[#070b12]/95 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900'} backdrop-blur-2xl border-b shadow-xl transition-colors mw-header`}>
          <div className="p-3.5 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              {(currentTool || selectedSurah) && (
                <button 
                  onClick={() => { setCurrentTool(null); setSelectedSurah(null); }}
                  className={`w-9 h-9 rounded-full ${isDarkMode ? 'bg-white/10 text-[#34d399] border-white/10' : 'bg-white text-emerald-600 border-slate-200'} backdrop-blur-md border flex items-center justify-center active:scale-90 transition-transform shadow-md`}
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
                    className={`flex items-center gap-1.5 mt-0.5 ${isDarkMode ? 'bg-white/10 border-white/15 text-[#34d399]' : 'bg-white border-slate-200 text-emerald-700'} px-3 py-0.5 rounded-full border backdrop-blur-xl active:scale-95 transition-transform shadow-sm`}
                  >
                    <MapPin size={11} />
                    <span className="text-[10px] font-medium">{city}</span>
                  </button>
                )}
              </div>
            </div>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-9 h-9 rounded-2xl ${isDarkMode ? 'bg-white/10 text-amber-400 border-white/15' : 'bg-white text-slate-700 border-slate-200'} backdrop-blur-xl border flex items-center justify-center shadow-lg active:scale-90 transition-transform`}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Complete Live Guidance Inside Header */}
          {!currentTool && !selectedSurah && (
            <div className="bg-gradient-to-r from-[#065f46] via-[#047857] to-[#0f172a] px-4 py-2.5 text-white flex flex-col gap-1.5 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#a7f3d0] flex items-center gap-1 animate-pulse">
                  <Sparkles size={11} /> Live Guidance: {activePrayer}
                </span>
                <span className="text-[9px] font-mono bg-black/40 px-2.5 py-0.5 rounded-full text-white/90">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1 text-[11px] pb-0.5">
                <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-xl border border-white/10">
                  <CheckCircle2 size={13} className="text-[#34d399] shrink-0" />
                  <span className="font-medium text-white/95">Do: {dosText}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-xl border border-white/10">
                  <XCircle size={13} className="text-rose-400 shrink-0" />
                  <span className="font-medium text-white/95">Don't: {dontsText}</span>
                </div>
              </div>
            </div>
          )}
        </header>
      </div>

      <main className="p-4 flex-1 max-w-md mx-auto w-full z-10 relative">
        {selectedSurah ? (
          <SurahDetail surah={selectedSurah} isDarkMode={isDarkMode} />
        ) : currentTool === 'tasbih' ? (
          <TasbihView isDarkMode={isDarkMode} />
        ) : currentTool === 'asma' ? (
          <AsmaulHusnaView isDarkMode={isDarkMode} />
        ) : (
          <>
            {activeTab === 'home' && <HomeScreen setActiveTab={setActiveTab} setCurrentTool={setCurrentTool} prayerTimes={prayerTimes} hijriDate={hijriDate} loadingPrayers={loadingPrayers} city={city} isDarkMode={isDarkMode} currentTime={currentTime} activePrayer={activePrayer} />}
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

      {showLocationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`${isDarkMode ? 'bg-[#0f172a]/90 border-white/15 text-white' : 'bg-white/90 border-slate-200 text-slate-900'} backdrop-blur-2xl border w-full max-w-sm rounded-[32px] p-6 space-y-4 shadow-2xl`}>
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Globe size={18} className="text-[#34d399]" /> Set Location
              </h3>
              <button onClick={() => setShowLocationModal(false)} className="text-xs opacity-60 hover:opacity-100">✕</button>
            </div>
            
            <button
              onClick={handleDetectGPS}
              disabled={locatingGPS}
              className="w-full bg-[#059669]/20 border border-[#34d399]/40 text-[#34d399] py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg backdrop-blur-md"
            >
              <Navigation size={15} className={locatingGPS ? "animate-spin" : ""} />
              {locatingGPS ? 'Detecting GPS...' : 'Use Phone GPS Location'}
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {['New Delhi', 'Mumbai', 'Lucknow', 'Dubai', 'London', 'Mecca'].map((c) => (
                <button
                  key={c}
                  onClick={() => handleSaveLocation(c, c === 'Mecca' ? 'Saudi Arabia' : c === 'London' ? 'UK' : c === 'Dubai' ? 'UAE' : 'India')}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold border backdrop-blur-md transition-all ${city === c ? 'bg-[#059669]/30 border-[#34d399] text-[#34d399]' : isDarkMode ? 'bg-white/5 border-white/10 text-white/80' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
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
                className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} backdrop-blur-md border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#34d399]`}
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

      {!currentTool && !selectedSurah && (
        <div className="fixed bottom-4 left-4 right-4 z-40 flex justify-center">
          <nav className={`${isDarkMode ? 'bg-[#0f172a]/60 border-white/15 shadow-black/80' : 'bg-white/60 border-slate-200/80 shadow-slate-300/50'} backdrop-blur-2xl border h-16 px-3 rounded-full flex justify-between items-center max-w-sm w-full shadow-2xl`}>
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

function HomeScreen({ setActiveTab, setCurrentTool, prayerTimes, hijriDate, loadingPrayers, city, isDarkMode, currentTime, activePrayer }) {
  const prayers = [
    { name: 'Fajr', key: 'Fajr' },
    { name: 'Dhuhr', key: 'Dhuhr' },
    { name: 'Asr', key: 'Asr' },
    { name: 'Maghrib', key: 'Maghrib' },
    { name: 'Isha', key: 'Isha' }
  ];

  const quickActions = [
    {
      title: 'Al-Quran',
      subtitle: 'Read & continue',
      icon: <BookOpen size={21} />,
      action: () => setActiveTab('quran')
    },
    {
      title: 'Qibla',
      subtitle: 'Find direction',
      icon: <Compass size={21} />,
      action: () => setActiveTab('qibla')
    },
    {
      title: 'Duas',
      subtitle: 'Daily supplications',
      icon: <Heart size={21} />,
      action: () => setActiveTab('dua')
    },
    {
      title: 'Tasbih',
      subtitle: 'Remember Allah',
      icon: <RotateCcw size={21} />,
      action: () => setCurrentTool('tasbih')
    }
  ];

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-5">

      {/* Welcome */}
      <section className="flex items-end justify-between gap-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDarkMode ? 'text-emerald-300/70' : 'text-emerald-700/70'}`}>
            Assalamu Alaikum
          </p>
          <h1 className={`mt-1 text-2xl sm:text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Muslim World
          </h1>
          <div className={`flex items-center gap-1.5 mt-1 text-xs ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
            <MapPin size={13} />
            <span>{city}</span>
            <span>•</span>
            <span>{hijriDate || 'Islamic Calendar'}</span>
          </div>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`hidden sm:flex w-11 h-11 rounded-2xl items-center justify-center border ${
            isDarkMode
              ? 'bg-white/5 border-white/10 text-emerald-300'
              : 'bg-white border-slate-200 text-emerald-700'
          }`}
        >
          <Bell size={19} />
        </button>
      </section>

      {/* Prayer Hero */}
      <section className="mw-gradient rounded-[28px] p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-8 bottom-[-70px] w-40 h-40 rounded-full bg-[#c9a84e]/20 blur-2xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-white/65 text-xs font-bold uppercase tracking-[0.16em]">
                <Clock size={14} />
                Live Prayer Status
              </div>

              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
                {activePrayer}
              </h2>

              <p className="mt-1 text-sm text-white/65">
                {loadingPrayers ? 'Updating prayer times…' : `Prayer times for ${city}`}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs text-white/55">Today</p>
              <p className="text-lg font-bold">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-black/15 border border-white/10 p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Sehri Ends</p>
              <p className="mt-1 text-xl font-bold">
                {loadingPrayers ? '—' : prayerTimes?.SehriEnd || '—'}
              </p>
            </div>

            <div className="rounded-2xl bg-black/15 border border-white/10 p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Maghrib</p>
              <p className="mt-1 text-xl font-bold">
                {loadingPrayers ? '—' : prayerTimes?.Maghrib || '—'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className={`mw-section-title ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Quick Access
          </h2>
          <span className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
            Essentials
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((item) => (
            <button
              key={item.title}
              onClick={item.action}
              className={`text-left p-4 rounded-[22px] border ${
                isDarkMode
                  ? 'bg-white/[0.045] border-white/10 hover:bg-white/[0.07]'
                  : 'bg-white border-slate-200 hover:border-emerald-200'
              } shadow-sm`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isDarkMode
                  ? 'bg-emerald-400/10 text-emerald-300'
                  : 'bg-emerald-50 text-emerald-700'
              }`}>
                {item.icon}
              </div>

              <p className={`mt-3 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {item.title}
              </p>
              <p className={`mt-0.5 text-[11px] ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>
                {item.subtitle}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Prayer Times */}
      <section className={`rounded-[26px] border p-4 sm:p-5 ${
        isDarkMode
          ? 'bg-white/[0.035] border-white/10'
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Today's Prayers
            </h2>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>
              Accurate local prayer schedule
            </p>
          </div>
          <Sun size={19} className={isDarkMode ? 'text-amber-300' : 'text-amber-500'} />
        </div>

        {loadingPrayers ? (
          <div className="grid grid-cols-5 gap-2">
            {prayers.map((p) => (
              <div key={p.key} className={`rounded-2xl p-3 h-20 animate-pulse ${
                isDarkMode ? 'bg-white/5' : 'bg-slate-100'
              }`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {prayers.map((p) => {
              const isCurrent = activePrayer.toLowerCase().includes(p.name.toLowerCase());

              return (
                <div
                  key={p.key}
                  className={`rounded-2xl p-2.5 sm:p-3 text-center border ${
                    isCurrent
                      ? 'bg-emerald-500/15 border-emerald-400/40'
                      : isDarkMode
                        ? 'bg-white/[0.025] border-white/5'
                        : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <p className={`text-[10px] sm:text-xs font-bold ${
                    isCurrent
                      ? 'text-emerald-400'
                      : isDarkMode ? 'text-white/55' : 'text-slate-500'
                  }`}>
                    {p.name}
                  </p>
                  <p className={`mt-1 text-[11px] sm:text-xs font-semibold ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {prayerTimes?.[p.key] || '—'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Islamic Focus */}
      <section className={`rounded-[26px] p-5 border ${
        isDarkMode
          ? 'bg-[#102219] border-emerald-400/10'
          : 'bg-emerald-50/70 border-emerald-100'
      }`}>
        <div className="flex gap-4 items-start">
          <div className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center ${
            isDarkMode
              ? 'bg-emerald-400/10 text-emerald-300'
              : 'bg-white text-emerald-700'
          }`}>
            <Sparkles size={20} />
          </div>

          <div>
            <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
              isDarkMode ? 'text-emerald-300/60' : 'text-emerald-700/60'
            }`}>
              Daily Focus
            </p>
            <p className={`mt-1 text-sm font-semibold leading-6 ${
              isDarkMode ? 'text-white/85' : 'text-slate-700'
            }`}>
              {activePrayer === 'Zawaal (Prohibited)'
                ? 'Use this time for Dhikr, Istighfar and quiet reflection.'
                : 'Keep your prayers on time, remember Allah, and make space for Quran today.'}
            </p>
          </div>
        </div>
      </section>

      {/* More tools */}
      <section className="grid grid-cols-2 gap-3 pb-3">
        <button
          onClick={() => setCurrentTool('asma')}
          className={`flex items-center gap-3 p-4 rounded-[22px] border text-left ${
            isDarkMode
              ? 'bg-white/[0.035] border-white/10'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-400/10 text-amber-500 flex items-center justify-center">
            <Sparkles size={19} />
          </div>
          <div>
            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>99 Names</p>
            <p className={`text-[10px] ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>Asma-ul-Husna</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('more')}
          className={`flex items-center gap-3 p-4 rounded-[22px] border text-left ${
            isDarkMode
              ? 'bg-white/[0.035] border-white/10'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
            <Menu size={19} />
          </div>
          <div>
            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>More</p>
            <p className={`text-[10px] ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>All features</p>
          </div>
        </button>
      </section>

    </main>
  );
}

function QuranScreen({ isDownloaded, downloading, downloadFullQuran, setSelectedSurah, searchQuery, setSearchQuery, isDarkMode }) {
  const filteredSurahs = surahsList.filter((surah) =>
    `${surah.number} ${surah.name} ${surah.englishName || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-7">

      {/* Quran Hero */}
      <section className="mw-gradient rounded-[28px] p-5 sm:p-7 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-[0.16em]">
            <BookOpen size={14} />
            Al-Quran
          </div>

          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
            Read the Quran
          </h1>

          <p className="mt-1 text-sm text-white/65">
            Read, search and continue your Quran journey.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 rounded-2xl bg-black/15 border border-white/10 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-white/45 font-bold">
                Quran
              </p>
              <p className="mt-1 text-sm font-semibold text-white/90">
                114 Surahs
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-widest text-white/45 font-bold">
                Offline
              </p>
              <p className="mt-1 text-sm font-bold">
                {isDownloaded ? 'Ready' : 'Available'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offline Quran */}
      <section className={`mt-4 rounded-[24px] border p-4 sm:p-5 ${
        isDarkMode
          ? 'bg-white/[0.035] border-white/10'
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
            isDownloaded
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-amber-400/10 text-amber-500'
          }`}>
            {isDownloaded ? <CheckCircle size={21} /> : <Download size={21} />}
          </div>

          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {isDownloaded ? 'Quran available offline' : 'Save Quran for offline reading'}
            </p>

            <p className={`text-xs mt-0.5 ${
              isDarkMode ? 'text-white/45' : 'text-slate-500'
            }`}>
              {isDownloaded
                ? 'Your Quran data is stored on this device.'
                : 'Download once and read without an internet connection.'}
            </p>
          </div>

          {!isDownloaded && (
            <button
              onClick={downloadFullQuran}
              disabled={downloading}
              className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50"
            >
              {downloading ? 'Saving…' : 'Download'}
            </button>
          )}
        </div>
      </section>

      {/* Search */}
      <section className="mt-5">
        <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
          isDarkMode
            ? 'bg-white/[0.045] border-white/10'
            : 'bg-white border-slate-200'
        }`}>
          <Search size={19} className={isDarkMode ? 'text-white/40' : 'text-slate-400'} />

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Surah by name or number…"
            className={`flex-1 bg-transparent outline-none text-sm ${
              isDarkMode
                ? 'text-white placeholder:text-white/30'
                : 'text-slate-900 placeholder:text-slate-400'
            }`}
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`text-xs font-bold ${
                isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
              }`}
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Surah List */}
      <section className="mt-5">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className={`text-lg font-bold ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Surahs
            </h2>
            <p className={`text-xs mt-0.5 ${
              isDarkMode ? 'text-white/40' : 'text-slate-500'
            }`}>
              {filteredSurahs.length} results
            </p>
          </div>

          <BookOpen
            size={18}
            className={isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredSurahs.map((surah) => (
            <button
              key={surah.number}
              onClick={() => setSelectedSurah(surah)}
              className={`group flex items-center gap-3 p-4 rounded-[22px] border text-left ${
                isDarkMode
                  ? 'bg-white/[0.035] border-white/10 hover:bg-white/[0.06]'
                  : 'bg-white border-slate-200 hover:border-emerald-200'
              }`}
            >
              <div className={`w-11 h-11 shrink-0 rounded-2xl rotate-45 flex items-center justify-center ${
                isDarkMode
                  ? 'bg-emerald-400/10 text-emerald-300'
                  : 'bg-emerald-50 text-emerald-700'
              }`}>
                <span className="-rotate-45 text-xs font-bold">
                  {surah.number}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {surah.englishName || surah.name}
                </p>

                <p className={`text-[11px] mt-0.5 ${
                  isDarkMode ? 'text-white/40' : 'text-slate-500'
                }`}>
                  {surah.name}
                  {surah.numberOfAyahs ? ` • ${surah.numberOfAyahs} Ayahs` : ''}
                </p>
              </div>

              <div className={`text-xl font-serif ${
                isDarkMode ? 'text-emerald-200/80' : 'text-emerald-800/80'
              }`}>
                {surah.name}
              </div>
            </button>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className={`text-center py-12 rounded-[24px] border ${
            isDarkMode
              ? 'bg-white/[0.03] border-white/10'
              : 'bg-white border-slate-200'
          }`}>
            <Search size={28} className="mx-auto opacity-40" />
            <p className={`mt-3 text-sm font-semibold ${
              isDarkMode ? 'text-white/70' : 'text-slate-600'
            }`}>
              No Surah found
            </p>
            <p className={`mt-1 text-xs ${
              isDarkMode ? 'text-white/35' : 'text-slate-400'
            }`}>
              Try another name or number.
            </p>
          </div>
        )}
      </section>

    </main>
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
        <div key={v.id} className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white/70 border-slate-200 shadow-xl'} backdrop-blur-2xl p-4 rounded-[24px] border space-y-2.5`}>
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
        <div key={i} className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white/70 border-slate-200 shadow-xl'} backdrop-blur-2xl p-4 rounded-[24px] border space-y-2.5`}>
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
    <div className="w-full">
      <QiblaCompass city={city} isDarkMode={isDarkMode} />
    </div>
  );
}


function IslamicCalendarView({ onBack }) {
  const today = new Date();

  const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const weekdayFormatter = new Intl.DateTimeFormat('en', {
    weekday: 'short'
  });

  const monthFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    month: 'long',
    year: 'numeric'
  });

  const getHijriParts = (date) => {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).formatToParts(date);

    return Object.fromEntries(
      parts
        .filter(p => ['day', 'month', 'year'].includes(p.type))
        .map(p => [p.type, Number(p.value)])
    );
  };

  const current = getHijriParts(today);

  const [viewDate, setViewDate] = useState(today);

  const shiftMonth = (amount) => {
    const next = new Date(viewDate);
    next.setDate(15);
    next.setMonth(next.getMonth() + amount);
    setViewDate(next);
  };

  const viewHijri = getHijriParts(viewDate);

  const days = [];
  const cursor = new Date(viewDate);
  cursor.setDate(1);

  // Find the first Gregorian date belonging to the displayed Hijri month.
  for (let i = -3; i <= 35; i++) {
    const d = new Date(viewDate);
    d.setDate(1 + i);

    const h = getHijriParts(d);

    if (
      h.year === viewHijri.year &&
      h.month === viewHijri.month &&
      !days.some(x => x.h.day === h.day)
    ) {
      days.push({ date: d, h });
    }
  }

  // If month crosses a Gregorian month, search a wider range.
  if (days.length < 29) {
    days.length = 0;

    for (let i = -20; i <= 50; i++) {
      const d = new Date(viewDate);
      d.setDate(1 + i);

      const h = getHijriParts(d);

      if (
        h.year === viewHijri.year &&
        h.month === viewHijri.month &&
        !days.some(x => x.h.day === h.day)
      ) {
        days.push({ date: d, h });
      }
    }
  }

  days.sort((a, b) => a.h.day - b.h.day);

  const firstDate = days[0]?.date;
  const startOffset = firstDate ? firstDate.getDay() : 0;

  const cells = [
    ...Array.from({ length: startOffset }, () => null),
    ...days
  ];

  const islamicEvents = [
    { month: 1, day: 1, title: "1 Muharram", icon: "🌙" },
    { month: 1, day: 10, title: "Ashura", icon: "🕌" },
    { month: 3, day: 12, title: "12 Rabi al-Awwal", icon: "✨" },
    { month: 7, day: 27, title: "Isra & Mi'raj", icon: "🌌" },
    { month: 8, day: 15, title: "Shab-e-Barat", icon: "🌙" },
    { month: 9, day: 1, title: "1 Ramadan", icon: "🌙" },
    { month: 9, day: 27, title: "Laylat al-Qadr", icon: "⭐" },
    { month: 10, day: 1, title: "Eid al-Fitr", icon: "🎉" },
    { month: 12, day: 9, title: "Day of Arafah", icon: "🕋" },
    { month: 12, day: 10, title: "Eid al-Adha", icon: "🕋" }
  ];

  const currentEvent = islamicEvents.find(
    e => e.month === current.month && e.day === current.day
  );

  const monthName = monthFormatter.format(viewDate);

  return (
    <div className="mw-calendar-page">
      <div className="mw-calendar-header">
        <button className="mw-icon-button" onClick={onBack} aria-label="Back">
          <ArrowLeft size={20} />
        </button>

        <div>
          <div className="mw-eyebrow">ISLAMIC CALENDAR</div>
          <h2>Hijri Calendar</h2>
          <p>Track important Islamic dates</p>
        </div>
      </div>

      <div className="mw-calendar-hero mw-gradient">
        <div className="mw-calendar-hero-icon">🌙</div>
        <div>
          <span>Today</span>
          <strong>{hijriFormatter.format(today)}</strong>
          <small>
            {today.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </small>
        </div>
      </div>

      {currentEvent && (
        <div className="mw-calendar-event mw-card">
          <span>{currentEvent.icon}</span>
          <div>
            <small>Today's Islamic occasion</small>
            <strong>{currentEvent.title}</strong>
          </div>
        </div>
      )}

      <div className="mw-calendar-card mw-card">
        <div className="mw-calendar-monthbar">
          <button className="mw-calendar-nav" onClick={() => shiftMonth(-1)}>
            ‹
          </button>

          <div>
            <strong>{monthName}</strong>
            <small>Hijri month</small>
          </div>

          <button className="mw-calendar-nav" onClick={() => shiftMonth(1)}>
            ›
          </button>
        </div>

        <div className="mw-calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="mw-calendar-grid">
          {cells.map((item, index) => {
            if (!item) {
              return <div key={`empty-${index}`} className="mw-calendar-day empty" />;
            }

            const isToday =
              item.h.year === current.year &&
              item.h.month === current.month &&
              item.h.day === current.day;

            const event = islamicEvents.find(
              e => e.month === item.h.month && e.day === item.h.day
            );

            return (
              <div
                key={`${item.h.year}-${item.h.month}-${item.h.day}`}
                className={`mw-calendar-day ${isToday ? 'today' : ''} ${event ? 'event' : ''}`}
                title={event?.title || ''}
              >
                <strong>{item.h.day}</strong>
                <small>{item.date.getDate()}</small>
                {event && <i>•</i>}
              </div>
            );
          })}
        </div>

        <div className="mw-calendar-legend">
          <span><i className="today-dot"></i> Today</span>
          <span><i className="event-dot"></i> Islamic occasion</span>
        </div>
      </div>

      <div className="mw-calendar-info mw-card">
        <div className="mw-section-title">
          <div>
            <h3>Important dates</h3>
            <p>Commonly observed Islamic occasions</p>
          </div>
          <Calendar size={20} />
        </div>

        <div className="mw-event-list">
          {islamicEvents
            .filter(e => e.month === viewHijri.month)
            .map(event => (
              <div className="mw-event-row" key={`${event.month}-${event.day}`}>
                <span>{event.icon}</span>
                <div>
                  <strong>{event.day} {monthName.split(' ')[0]}</strong>
                  <small>{event.title}</small>
                </div>
              </div>
            ))}

          {!islamicEvents.some(e => e.month === viewHijri.month) && (
            <div className="mw-muted">
              No major listed occasion in this month.
            </div>
          )}
        </div>
      </div>

      <p className="mw-calendar-note">
        Hijri dates are calculated using the Umm al-Qura calendar system.
        Local moon-sighting dates may differ by one day.
      </p>
    </div>
  );
}


function RamadanCalendarView({ onBack, prayerTimes, hijriDate }) {
  const today = new Date();

  const hijriParts = (date) => {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).formatToParts(date);

    return Object.fromEntries(
      parts
        .filter(p => ['day', 'month', 'year'].includes(p.type))
        .map(p => [p.type, Number(p.value)])
    );
  };

  const currentHijri = hijriParts(today);
  const isRamadan = currentHijri.month === 9;

  const ramadanYear = currentHijri.year;

  const ramadanDays = Array.from({ length: 30 }, (_, index) => ({
    day: index + 1,
    label: `Day ${index + 1}`,
    focus: [
      'Intention & sincerity',
      'Quran & reflection',
      'Charity & kindness',
      'Patience & gratitude',
      'Dhikr & remembrance',
      'Family & good character',
      'Forgiveness',
      'Quran recitation',
      'Dua & hope',
      'Sadaqah',
      'Prayer & consistency',
      'Helping others',
      'Gratitude',
      'Seeking knowledge',
      'Good deeds',
      'Self-reflection',
      'Dua for the Ummah',
      'Quran reflection',
      'Patience',
      'Charity',
      'Night prayer',
      'Dhikr',
      'Family ties',
      'Forgiveness',
      'Quran completion goal',
      'Extra worship',
      'Seek Laylat al-Qadr',
      'Dua & repentance',
      'Prepare for Eid',
      'Gratitude & Eid preparation'
    ][index]
  }));

  const selectedDay = isRamadan
    ? Math.min(Math.max(currentHijri.day, 1), 30)
    : 1;

  const [activeDay, setActiveDay] = useState(selectedDay);

  const sehri = prayerTimes?.Fajr || '—';
  const iftar = prayerTimes?.Maghrib || '—';

  const qadrNights = [21, 23, 25, 27, 29];

  return (
    <div className="mw-ramadan-page">

      <div className="mw-calendar-header">
        <button className="mw-icon-button" onClick={onBack} aria-label="Back">
          <ArrowLeft size={20} />
        </button>

        <div>
          <div className="mw-eyebrow">RAMADAN</div>
          <h2>30-Day Journey</h2>
          <p>Plan your worship throughout Ramadan</p>
        </div>
      </div>

      <div className="mw-ramadan-hero mw-gradient">
        <div className="mw-ramadan-moon">🌙</div>

        <div className="mw-ramadan-hero-copy">
          <span>Ramadan {ramadanYear}</span>

          <strong>
            {isRamadan
              ? `Ramadan ${currentHijri.day}`
              : 'Ramadan planner'}
          </strong>

          <small>
            {isRamadan
              ? 'Today in Ramadan'
              : '30 days of worship, reflection & growth'}
          </small>
        </div>
      </div>

      <div className="mw-ramadan-times mw-card">
        <div className="mw-ramadan-time">
          <span>🌅</span>
          <div>
            <small>Sehri ends</small>
            <strong>{sehri}</strong>
          </div>
        </div>

        <div className="mw-ramadan-divider"></div>

        <div className="mw-ramadan-time">
          <span>🌇</span>
          <div>
            <small>Iftar</small>
            <strong>{iftar}</strong>
          </div>
        </div>
      </div>

      {!isRamadan && (
        <div className="mw-ramadan-notice mw-card">
          <Calendar size={19} />
          <div>
            <strong>Ramadan mode</strong>
            <p>
              The planner is available year-round. During Ramadan,
              today's day will be highlighted automatically.
            </p>
          </div>
        </div>
      )}

      <div className="mw-ramadan-progress mw-card">
        <div className="mw-section-title">
          <div>
            <h3>30-Day Journey</h3>
            <p>{activeDay} of 30 days selected</p>
          </div>

          <strong className="mw-ramadan-progress-number">
            {Math.round((activeDay / 30) * 100)}%
          </strong>
        </div>

        <div className="mw-progress-track">
          <div
            className="mw-progress-fill"
            style={{ width: `${(activeDay / 30) * 100}%` }}
          />
        </div>
      </div>

      <div className="mw-ramadan-days mw-card">
        <div className="mw-section-title">
          <div>
            <h3>Ramadan calendar</h3>
            <p>Select a day to view its focus</p>
          </div>
          <Calendar size={20} />
        </div>

        <div className="mw-ramadan-grid">
          {ramadanDays.map(item => {
            const isActive = item.day === activeDay;
            const isToday = isRamadan && item.day === currentHijri.day;
            const isQadr = qadrNights.includes(item.day);

            return (
              <button
                key={item.day}
                className={`mw-ramadan-day
                  ${isActive ? 'active' : ''}
                  ${isToday ? 'today' : ''}
                  ${isQadr ? 'qadr' : ''}
                `}
                onClick={() => setActiveDay(item.day)}
              >
                <strong>{item.day}</strong>
                <span>{isQadr ? '⭐' : isToday ? 'Today' : 'Ramadan'}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mw-ramadan-focus mw-card">
        <div className="mw-focus-icon">🤲</div>

        <div>
          <small>Day {activeDay} focus</small>
          <h3>{ramadanDays[activeDay - 1].focus}</h3>

          {qadrNights.includes(activeDay) && (
            <div className="mw-qadr-badge">
              ⭐ One of the odd nights — seek Laylat al-Qadr
            </div>
          )}
        </div>
      </div>

      <div className="mw-ramadan-checklist mw-card">
        <div className="mw-section-title">
          <div>
            <h3>Daily worship</h3>
            <p>A simple Ramadan checklist</p>
          </div>
          <CheckCircle2 size={20} />
        </div>

        <div className="mw-ramadan-check-items">
          {[
            'Five daily prayers',
            'Quran recitation',
            'Dhikr',
            'Dua',
            'Sadaqah / good deed'
          ].map(item => (
            <label key={item} className="mw-check-row">
              <input type="checkbox" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <p className="mw-ramadan-note">
        Prayer times depend on your selected location and calculation method.
        Islamic dates may vary by local moon sighting.
      </p>

    </div>
  );
}

function MoreScreen({ setCurrentTool, setActiveTab, prayerTimes, hijriDate }) {
  if (window.__mwIslamicCalendarOpen) {
    window.__mwIslamicCalendarOpen = false;
    return (
      <IslamicCalendarView
        onBack={() => setCurrentTool(null)}
      />
    );
  }

  if (window.__mwRamadanOpen) {
    window.__mwRamadanOpen = false;
    return (
      <RamadanCalendarView
        onBack={() => setCurrentTool(null)}
        prayerTimes={prayerTimes}
        hijriDate={hijriDate}
      />
    );
  }

  const tools = [
    {
      id: 'islamicCalendar',
      title: 'Islamic Calendar',
      description: 'Hijri dates & occasions',
      icon: <Calendar size={24} />,
      action: () => {
        window.__mwIslamicCalendarOpen = true;
        setCurrentTool('islamicCalendar');
      }
    },
    {
      id: 'ramadan',
      title: 'Ramadan',
      description: '30-day worship journey',
      icon: <Moon size={24} />,
      action: () => {
        window.__mwRamadanOpen = true;
        setCurrentTool('ramadan');
      }
    },
    {
      id: 'asma',
      title: '99 Names',
      description: 'Asma ul Husna',
      icon: <Sparkles size={24} />,
      action: () => setCurrentTool('asma')
    },
    {
      id: 'tasbih',
      title: 'Tasbih',
      description: 'Digital dhikr counter',
      icon: <RotateCcw size={24} />,
      action: () => setCurrentTool('tasbih')
    }
  ];

  return (
    <div className="mw-more-page">
      <div className="mw-section-title">
        <div>
          <div className="mw-eyebrow">MUSLIM WORLD</div>
          <h2>More Tools</h2>
          <p>Useful Islamic tools in one place</p>
        </div>
        <Menu size={24} />
      </div>

      <div className="mw-tool-grid">
        {tools.map(tool => (
          <button
            key={tool.id}
            className="mw-tool-card mw-card"
            onClick={tool.action}
          >
            <div className="mw-tool-icon">{tool.icon}</div>
            <strong>{tool.title}</strong>
            <span>{tool.description}</span>
          </button>
        ))}
      </div>

      <div className="mw-card mw-more-note">
        <Sparkles size={20} />
        <div>
          <strong>Coming next</strong>
          <p>Verified Hadith, notifications, offline support and more.</p>
        </div>
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

      <button onClick={() => setCount(0)} className={`flex items-center gap-1.5 ${isDarkMode ? 'bg-white/[0.04] border-white/10 text-[#f43f5e]' : 'bg-white/70 border-slate-200 text-rose-600 shadow-xl'} backdrop-blur-2xl px-5 py-3 rounded-2xl text-xs font-bold border active:scale-95`}>
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
        <div key={n.no} className={`${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-white/70 border-slate-200 shadow-xl'} backdrop-blur-2xl p-4 rounded-[24px] border flex justify-between items-center`}>
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
