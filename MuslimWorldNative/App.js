import QiblaCompass from "./components/QiblaCompass";
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [city, setCity] = useState('New Delhi');
  const [country, setCountry] = useState('India');
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [hijriDate, setHijriDate] = useState('27 Safar 1448 AH');
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempCity, setTempCity] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadSavedLocation() {
      const savedCity = await AsyncStorage.getItem('user_city');
      const savedCountry = await AsyncStorage.getItem('user_country');
      if (savedCity) setCity(savedCity);
      if (savedCountry) setCountry(savedCountry);
    }
    loadSavedLocation();
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
      setLoading(true);
      try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
        const data = await res.json();
        if (data.code === 200) {
          const raw = data.data.timings;
          setPrayerTimes({
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
          });
          const h = data.data.date.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
        }
      } catch (e) {
        setPrayerTimes({
          Fajr: "04:32 AM", Sunrise: "05:55 AM", Dhuhr: "12:28 PM", Asr: "04:54 PM", Maghrib: "07:12 PM", Sunset: "07:12 PM", Isha: "08:35 PM",
          SehriEnd: "04:32 AM", Ishraq: "06:15 AM", Chasht: "08:00 AM", Zawaal: "12:13 PM", Tahajjud: "03:15 AM"
        });
      } finally {
        setLoading(false);
      }
    }
    fetchPrayerTimes();
  }, [city, country]);

  const handleDetectGPS = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
      const data = await res.json();
      const detectedCity = data.address.city || data.address.town || 'New Delhi';
      const detectedCountry = data.address.country || 'India';
      setCity(detectedCity);
      setCountry(detectedCountry);
      await AsyncStorage.setItem('user_city', detectedCity);
      await AsyncStorage.setItem('user_country', detectedCountry);
      setShowLocationModal(false);
    } catch (err) {
      alert("Could not fetch address from GPS.");
    }
  };

  const saveCustomLocation = async (newCity) => {
    if (!newCity.trim()) return;
    setCity(newCity.trim());
    await AsyncStorage.setItem('user_city', newCity.trim());
    setShowLocationModal(false);
  };

  // Live Guidance Calculation
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
  let dosText = "Engage in Dhikr, Quran, and lawful work.";
  let dontsText = "Avoid wasting time in idle talk.";

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
      dosText = "Complete Suhoor & make Niyyah.";
      dontsText = "No food/drink after Fajr begins.";
    } else if (currentMinutes >= fajrMin && currentMinutes < sunriseMin) {
      activePrayer = 'Fajr & Morning Azkar';
      dosText = "Offer Fajr prayer & recite Azkar.";
      dontsText = "Do not sleep immediately after Fajr.";
    } else if (currentMinutes >= zawaalMin - 15 && currentMinutes <= zawaalMin + 15) {
      activePrayer = 'Zawaal (Prohibited)';
      dosText = "Engage in Istighfar & quiet reflection.";
      dontsText = "Strictly NO Nafl prayers during Zawaal.";
    } else if (currentMinutes >= maghribMin - 20 && currentMinutes < maghribMin + 45) {
      activePrayer = 'Maghrib & Iftar';
      dosText = "Break fast promptly with dates/water.";
      dontsText = "Do not delay Maghrib prayer.";
    } else if (currentMinutes >= ishaMin || currentMinutes < fajrMin - 40) {
      activePrayer = 'Isha & Tahajjud';
      dosText = "Offer Isha, Witr, and prep for Tahajjud.";
      dontsText = "Avoid late night screen time.";
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#05080f' : '#f1f5f9' }]}>
      <QiblaCompass />
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Fixed Native Header */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? 'rgba(7, 11, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)' }]}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={[styles.headerTitle, { color: isDarkMode ? '#fff' : '#0f172a' }]}>Muslim World</Text>
            <TouchableOpacity onPress={() => setShowLocationModal(true)} style={styles.locationButton}>
              <Ionicons name="location" size={12} color="#34d399" />
              <Text style={styles.locationText}>{city}, {country}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.themeToggle}>
            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={18} color={isDarkMode ? "#fbbf24" : "#475569"} />
          </TouchableOpacity>
        </View>

        {/* Live Guidance Ticker */}
        <View style={styles.guidanceBox}>
          <View style={styles.guidanceRow}>
            <Text style={styles.guidanceTitle}>✨ Live: {activePrayer}</Text>
            <Text style={styles.guidanceTime}>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
            </Text>
          </View>
          <Text style={styles.guidanceText} numberOfLines={1}>✅ Do: {dosText}</Text>
          <Text style={styles.guidanceText} numberOfLines={1}>❌ Don't: {dontsText}</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Ramazan Card */}
        <View style={styles.ramazanCard}>
          <View style={styles.ramazanHeader}>
            <MaterialCommunityIcons name="moon-waning-crescent" size={20} color="#fde047" />
            <Text style={styles.ramazanTitle}>Ramazan Fasting Guide</Text>
          </View>
          <View style={styles.ramazanGrid}>
            <View style={styles.ramazanTimeBox}>
              <Text style={styles.ramazanLabel}>SEHRI END</Text>
              <Text style={styles.ramazanValue}>{loading ? '...' : prayerTimes?.SehriEnd}</Text>
            </View>
            <View style={styles.ramazanTimeBox}>
              <Text style={styles.ramazanLabel}>IFTAR TIME</Text>
              <Text style={styles.ramazanValue}>{loading ? '...' : prayerTimes?.Maghrib}</Text>
            </View>
          </View>
        </View>

        {/* Schedule Card */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#ffffff' }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: isDarkMode ? '#fff' : '#0f172a' }]}>{city} Schedule</Text>
            <Text style={styles.hijriText}>{hijriDate}</Text>
          </View>
          <View style={styles.sunRow}>
            <Text style={[styles.sunText, { color: isDarkMode ? 'rgba(255,255,255,0.8)' : '#475569' }]}>Sunrise: {prayerTimes?.Sunrise}</Text>
            <Text style={[styles.sunText, { color: isDarkMode ? 'rgba(255,255,255,0.8)' : '#475569' }]}>Sunset: {prayerTimes?.Sunset}</Text>
          </View>
        </View>

        {/* Daily Prayers List */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#64748b' }]}>DAILY PRAYERS (12-HR)</Text>
          {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name, idx) => {
            const isCurrent = activePrayer.toLowerCase().includes(name.toLowerCase());
            return (
              <View key={idx} style={[styles.prayerRow, isCurrent && styles.activePrayerRow]}>
                <Text style={[styles.prayerName, { color: isCurrent ? '#34d399' : isDarkMode ? '#fff' : '#1e293b' }]}>{name}</Text>
                <Text style={[styles.prayerTime, { color: isCurrent ? '#34d399' : isDarkMode ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
                  {prayerTimes ? prayerTimes[name] : '--:--'}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Special Timings */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#64748b' }]}>SPECIAL & PROHIBITED TIMINGS</Text>
          <View style={styles.specialRow}><Text style={[styles.specialText, { color: isDarkMode ? '#fff' : '#1e293b' }]}>Tahajjud (Last 3rd)</Text><Text style={styles.specialTime}>{prayerTimes?.Tahajjud}</Text></View>
          <View style={styles.specialRow}><Text style={[styles.specialText, { color: isDarkMode ? '#fff' : '#1e293b' }]}>Ishraq</Text><Text style={styles.specialTime}>{prayerTimes?.Ishraq}</Text></View>
          <View style={styles.specialRow}><Text style={[styles.specialText, { color: isDarkMode ? '#fff' : '#1e293b' }]}>Chasht</Text><Text style={styles.specialTime}>{prayerTimes?.Chasht}</Text></View>
          <View style={[styles.specialRow, styles.zawaalRow]}><Text style={styles.zawaalText}>Zawaal (No Prayer)</Text><Text style={styles.zawaalTime}>{prayerTimes?.Zawaal}</Text></View>
        </View>

      </ScrollView>

      {/* Location Modal */}
      <Modal visible={showLocationModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#0f172a' : '#ffffff' }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#0f172a' }]}>Set Location</Text>
            
            <TouchableOpacity onPress={handleDetectGPS} style={styles.gpsButton}>
              <Ionicons name="navigate" size={16} color="#34d399" />
              <Text style={styles.gpsButtonText}>Use Phone GPS Location</Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Enter custom city..."
              placeholderTextColor="#94a3b8"
              value={tempCity}
              onChangeText={setTempCity}
              style={[styles.modalInput, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc', color: isDarkMode ? '#fff' : '#0f172a', borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#cbd5e1' }]}
            />

            <TouchableOpacity onPress={() => saveCustomLocation(tempCity)} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply City</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowLocationModal(false)} style={styles.closeModalButton}>
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)' }]}>
        <TouchableOpacity onPress={() => setActiveTab('home')} style={styles.navItem}>
          <Ionicons name="home" size={20} color={activeTab === 'home' ? '#34d399' : '#94a3b8'} />
          <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('quran')} style={styles.navItem}>
          <Ionicons name="book" size={20} color={activeTab === 'quran' ? '#34d399' : '#94a3b8'} />
          <Text style={[styles.navText, activeTab === 'quran' && styles.activeNavText]}>Quran</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('dua')} style={styles.navItem}>
          <Ionicons name="heart" size={20} color={activeTab === 'dua' ? '#34d399' : '#94a3b8'} />
          <Text style={[styles.navText, activeTab === 'dua' && styles.activeNavText]}>Dua</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('qibla')} style={styles.navItem}>
          <Ionicons name="compass" size={20} color={activeTab === 'qibla' ? '#34d399' : '#94a3b8'} />
          <Text style={[styles.navText, activeTab === 'qibla' && styles.activeNavText]}>Qibla</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingTop: 10 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  locationButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, backgroundColor: 'rgba(52, 211, 153, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, alignSelf: 'flex-start' },
  locationText: { fontSize: 11, color: '#34d399', fontWeight: '500' },
  themeToggle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  guidanceBox: { backgroundColor: '#065f46', paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  guidanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  guidanceTitle: { fontSize: 11, fontWeight: 'bold', color: '#a7f3d0' },
  guidanceTime: { fontSize: 10, fontFamily: 'monospace', color: '#fff', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  guidanceText: { fontSize: 10, color: '#fff', marginVertical: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  ramazanCard: { backgroundColor: '#047857', borderRadius: 24, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10 },
  ramazanHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  ramazanTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  ramazanGrid: { flexDirection: 'row', gap: 12 },
  ramazanTimeBox: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  ramazanLabel: { fontSize: 10, fontWeight: 'bold', color: '#a7f3d0' },
  ramazanValue: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 4, fontFamily: 'monospace' },
  card: { borderRadius: 24, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  hijriText: { fontSize: 11, color: '#34d399', fontWeight: 'bold' },
  sunRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  sunText: { fontSize: 12 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', marginBottom: 10, letterSpacing: 1 },
  prayerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, marginBottom: 6, backgroundColor: 'rgba(255,255,255,0.02)' },
  activePrayerRow: { backgroundColor: 'rgba(5, 150, 105, 0.3)', borderWidth: 1, borderColor: '#34d399' },
  prayerName: { fontSize: 13, fontWeight: 'bold' },
  prayerTime: { fontSize: 13, fontFamily: 'monospace' },
  specialRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  specialText: { fontSize: 12 },
  specialTime: { fontSize: 12, fontWeight: 'bold', color: '#34d399', fontFamily: 'monospace' },
  zawaalRow: { backgroundColor: 'rgba(244, 63, 94, 0.1)', paddingHorizontal: 8, borderRadius: 8, marginTop: 4 },
  zawaalText: { fontSize: 12, color: '#f43f5e', fontWeight: 'bold' },
  zawaalTime: { fontSize: 12, color: '#f43f5e', fontWeight: 'bold', fontFamily: 'monospace' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 320, borderRadius: 28, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  gpsButton: { backgroundColor: 'rgba(5, 150, 105, 0.2)', borderWidth: 1, borderColor: '#34d399', paddingVertical: 12, borderRadius: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 },
  gpsButtonText: { color: '#34d399', fontSize: 12, fontWeight: 'bold' },
  modalInput: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, fontSize: 12, marginBottom: 12 },
  applyButton: { backgroundColor: '#059669', paddingVertical: 12, borderRadius: 16, alignItems: 'center', marginBottom: 8 },
  applyButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  closeModalButton: { alignItems: 'center', paddingVertical: 6 },
  closeModalText: { color: '#94a3b8', fontSize: 12 },
  bottomNav: { position: 'absolute', bottom: 12, left: 16, right: 16, height: 60, borderRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { fontSize: 9, color: '#94a3b8', marginTop: 2 },
  activeNavText: { color: '#34d399', fontWeight: 'bold' }
});
