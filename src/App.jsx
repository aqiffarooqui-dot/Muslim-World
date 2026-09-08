import React, { useState } from 'react';
import { Home, BookOpen, Heart, Compass, Menu, Bell, Search, MapPin, ArrowLeft } from 'lucide-react';

import HomeScreen from './screens/HomeScreen';
import QuranScreen from './screens/QuranScreen';
import SurahDetail from './screens/SurahDetail';
import DuaScreen from './screens/DuaScreen';
import QiblaScreen from './screens/QiblaScreen';
import MoreScreen from './screens/MoreScreen';
import TasbihView from './tools/TasbihView';
import { namesList } from './data/namesData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTool, setCurrentTool] = useState(null); 
  const [selectedSurah, setSelectedSurah] = useState(null);

  return (
    <div className="flex justify-center bg-gray-950 min-h-screen text-gray-100 font-sans">
      <div className="w-full max-w-md bg-slate-900 flex flex-col h-screen shadow-2xl relative overflow-hidden border-x border-slate-800">
        
        {/* Top Header */}
        <header className="bg-emerald-800 text-white px-4 py-3 flex justify-between items-center shadow-md z-10">
          <div className="flex items-center gap-2">
            {(currentTool || selectedSurah) && (
              <button 
                onClick={() => { setCurrentTool(null); setSelectedSurah(null); }} 
                className="p-1 hover:bg-emerald-700 rounded-full transition"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-lg font-bold tracking-wide">
                {selectedSurah ? selectedSurah.name : currentTool === 'tasbih' ? 'Digital Tasbih' : currentTool === 'names' ? '99 Names of Allah' : 'Muslim Knowledge'}
              </h1>
              {!currentTool && !selectedSurah && (
                <p className="text-xs text-emerald-200 flex items-center gap-1">
                  <MapPin size={12} /> New Delhi, India
                </p>
              )}
            </div>
          </div>
          {!currentTool && !selectedSurah && (
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-emerald-700 rounded-full transition">
                <Search size={20} />
              </button>
              <button className="p-2 hover:bg-emerald-700 rounded-full transition">
                <Bell size={20} />
              </button>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-20">
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

        {/* Bottom Navigation Bar */}
        {!currentTool && !selectedSurah && (
          <nav className="absolute bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex justify-around items-center h-16 px-2 z-20">
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
      className={`flex flex-col items-center justify-center flex-1 h-full transition ${
        isActive ? 'text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  );
}

function NamesListView() {
  return (
    <div className="p-4 space-y-2">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Asma-ul-Husna</h3>
      {namesList.map((item) => (
        <div key={item.no} className="bg-slate-800 p-3 rounded-xl flex justify-between items-center border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-900/60 text-emerald-400 font-bold flex items-center justify-center text-xs border border-emerald-700/50">{item.no}</div>
            <div>
              <h4 className="text-sm font-semibold text-white">{item.name}</h4>
              <p className="text-[11px] text-slate-400">{item.meaning}</p>
            </div>
          </div>
          <span className="text-lg font-arabic text-emerald-300">{item.arabic}</span>
        </div>
      ))}
    </div>
  );
}
