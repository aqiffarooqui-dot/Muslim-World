import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Heart, Compass, Menu, Bell, Search, MapPin, Volume2, Calendar, Clock, Sparkles, Navigation } from 'lucide-react';

export default function HomeScreen({ setActiveTab, setCurrentTool }) {
  const [locationName, setLocationName] = useState("New Delhi, India");
  const [loadingLoc, setLoadingLoc] = useState(false);

  // Function to fetch real-time GPS location
  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocoding to get city name using open API
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.state || "Current Location";
          const country = data.address.country || "";
          setLocationName(`${city}, ${country}`);
        } catch (err) {
          setLocationName(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
        } finally {
          setLoadingLoc(false);
        }
      },
      (error) => {
        console.error("Location error:", error);
        alert("Unable to retrieve your location. Please check permissions.");
        setLoadingLoc(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Location Status Bar */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <MapPin size={13} />
          <span>{loadingLoc ? "Detecting location..." : locationName}</span>
        </div>
        <button 
          onClick={fetchUserLocation}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition border border-slate-700/60 active:scale-95"
        >
          <Navigation size={11} className="text-emerald-400" /> Detect GPS
        </button>
      </div>

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
