import React, { useState, useEffect } from 'react';
import { Navigation, RefreshCw, Smartphone, CheckCircle2 } from 'lucide-react';

const QiblaCompass = ({ isDarkMode }) => {
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [error, setError] = useState('');
  const [calibrating, setCalibrating] = useState(false);
  const [hasVibrated, setHasVibrated] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          calculateQibla(userLat, userLng);
        },
        (err) => {
          setError('Location access required for precise Qibla bearing.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }

    const handleOrientation = (e) => {
      let compass = 0;
      if (e.webkitCompassHeading !== undefined) {
        compass = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        compass = 360 - e.alpha;
      }
      setHeading(compass);
    };

    const setupOrientation = () => {
      if (window.DeviceOrientationEvent) {
        if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
          window.addEventListener('deviceorientation', handleOrientation, true);
          setPermissionGranted(true);
        }
      }
    };

    setupOrientation();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const calculateQibla = (lat, lng) => {
    const phiK = (KAABA_LAT * Math.PI) / 180;
    const lambdaK = (KAABA_LNG * Math.PI) / 180;
    const phi = (lat * Math.PI) / 180;
    const lambda = (lng * Math.PI) / 180;

    const y = Math.sin(lambdaK - lambda);
    const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
    let qibla = Math.atan2(y, x);
    qibla = (qibla * 180) / Math.PI;
    qibla = (qibla + 360) % 360;

    setQiblaDirection(qibla);
  };

  const requestIOSPermission = () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', (e) => {
              let compass = e.webkitCompassHeading || (e.alpha !== null ? 360 - e.alpha : 0);
              setHeading(compass);
            }, true);
            setPermissionGranted(true);
            setError('');
          } else {
            setError('Compass permission was denied.');
          }
        })
        .catch(() => setError('Compass sensors unavailable on this device.'));
    } else {
      setPermissionGranted(true);
    }
  };

  const handleCalibrate = () => {
    setCalibrating(true);
    setError('Calibration mode: Move your phone in a figure-8 motion.');
    setTimeout(() => {
      setCalibrating(false);
      setError('');
    }, 4000);
  };

  const rotationAngle = qiblaDirection - heading;
  const angleDifference = Math.abs((rotationAngle + 180) % 360 - 180);

  useEffect(() => {
    if (angleDifference <= 3 && !hasVibrated) {
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      setHasVibrated(true);
    } else if (angleDifference > 5) {
      setHasVibrated(false);
    }
  }, [angleDifference, hasVibrated]);

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-6">
      <div className="text-center mb-6">
        <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Live Qibla Compass
        </h3>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>
          Align your phone with the glowing Kaaba marker
        </p>
        {error && (
          <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl mt-3 inline-block">
            {error}
          </p>
        )}
      </div>

      {!permissionGranted && typeof DeviceOrientationEvent.requestPermission === 'function' && (
        <button
          onClick={requestIOSPermission}
          className="mb-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-lg transition-all active:scale-95"
        >
          Enable Compass Sensors
        </button>
      )}

      <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center my-2">
        <div className={`absolute inset-0 rounded-full border border-emerald-500/30 animate-ping opacity-20 pointer-events-none ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-400/20'}`} />
        <div className="absolute inset-2 rounded-full border border-dashed border-emerald-500/40 animate-spin" style={{ animationDuration: '40s' }} />

        <div className={`absolute inset-0 rounded-full border-4 shadow-2xl backdrop-blur-md flex items-center justify-center ${
          isDarkMode 
            ? 'bg-[#091122]/90 border-emerald-500/40 shadow-emerald-950/50' 
            : 'bg-white/90 border-emerald-500/30 shadow-slate-200'
        }`}>
          <div className="absolute top-2 w-3 h-3 rounded-full bg-red-500 shadow-md shadow-red-500/50 z-20 flex items-center justify-center">
            <span className="text-[8px] font-bold text-white absolute -top-3.5">N</span>
          </div>

          <div
            className="absolute w-full h-full flex items-center justify-center transition-transform duration-150 ease-out"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
          >
            <div className="absolute top-4 flex flex-col items-center z-20">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 flex items-center justify-center border-2 border-white animate-bounce">
                <span className="text-base font-bold">🕋</span>
              </div>
              <div className="w-0.5 h-16 bg-gradient-to-b from-emerald-500 to-transparent mt-1" />
            </div>

            <div className="absolute top-6 text-[10px] font-bold text-emerald-400">0°</div>
            <div className="absolute bottom-6 text-[10px] font-bold opacity-40">180°</div>
            <div className="absolute left-6 text-[10px] font-bold opacity-40">270°</div>
            <div className="absolute right-6 text-[10px] font-bold opacity-40">90°</div>
          </div>

          <div className={`w-12 h-12 rounded-full z-10 flex items-center justify-center shadow-inner ${
            angleDifference <= 3 ? 'bg-emerald-500 text-white' : isDarkMode ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-emerald-600'
          }`}>
            <Navigation size={22} className={`transition-transform ${angleDifference <= 3 ? 'rotate-0' : ''}`} />
          </div>
        </div>
      </div>

      {angleDifference <= 3 && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-medium my-3 animate-pulse">
          <CheckCircle2 size={14} /> Perfectly aligned to Kaaba!
        </div>
      )}

      <div className={`w-full max-w-xs mt-4 p-4 rounded-2xl border grid grid-cols-2 gap-3 text-center ${
        isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-slate-200 shadow-sm'
      }`}>
        <div>
          <p className={`text-[10px] uppercase font-semibold tracking-wider ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
            Qibla Bearing
          </p>
          <p className={`text-base font-bold mt-0.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {qiblaDirection.toFixed(1)}°
          </p>
        </div>
        <div>
          <p className={`text-[10px] uppercase font-semibold tracking-wider ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
            Device Heading
          </p>
          <p className={`text-base font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {heading.toFixed(1)}°
          </p>
        </div>
      </div>

      <button
        onClick={handleCalibrate}
        disabled={calibrating}
        className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all active:scale-95 ${
          calibrating
            ? 'bg-amber-500/20 border-amber-500/30 text-amber-400 animate-pulse'
            : isDarkMode
            ? 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
        }`}
      >
        <RefreshCw size={14} className={calibrating ? 'animate-spin' : ''} />
        {calibrating ? 'Calibrating (Move phone in figure-8)...' : 'Calibrate Compass'}
      </button>
    </div>
  );
};

export default QiblaCompass;
