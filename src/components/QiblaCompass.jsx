import React, { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Compass, LocateFixed, RefreshCw, Smartphone } from "lucide-react";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

const normalize = (deg) => ((deg % 360) + 360) % 360;

function getQiblaBearing(lat, lng) {
  const φ1 = (lat * Math.PI) / 180;
  const φ2 = (KAABA_LAT * Math.PI) / 180;
  const Δλ = ((KAABA_LNG - lng) * Math.PI) / 180;

  const y = Math.sin(Δλ);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  return normalize((Math.atan2(y, x) * 180) / Math.PI);
}

function shortestAngle(target, current) {
  return ((target - current + 540) % 360) - 180;
}

export default function QiblaCompass({ city = "your location", isDarkMode = true }) {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [heading, setHeading] = useState(null);
  const [locationStatus, setLocationStatus] = useState("Finding your location...");
  const [sensorStatus, setSensorStatus] = useState("Waiting for compass sensor");
  const [permissionNeeded, setPermissionNeeded] = useState(false);
  const [error, setError] = useState("");

  const lastHeading = useRef(null);
  const vibrationLock = useRef(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("GPS is not supported on this device");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setQiblaDirection(getQiblaBearing(latitude, longitude));
        setLocationStatus("Qibla calculated from your GPS");
        setError("");
      },
      () => {
        setLocationStatus(`Using selected city: ${city}`);
        setError("Location permission is unavailable. Enable GPS for precise Qibla.");
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 300000,
      }
    );
  }, [city]);

  const updateHeading = (event) => {
    let next = null;

    // iOS Safari
    if (typeof event.webkitCompassHeading === "number" && event.webkitCompassHeading >= 0) {
      next = event.webkitCompassHeading;
    }
    // Android / standard DeviceOrientation
    else if (typeof event.alpha === "number") {
      next = normalize(360 - event.alpha);
    }

    if (next == null || Number.isNaN(next)) return;

    // Smooth sensor noise
    if (lastHeading.current != null) {
      const delta = shortestAngle(next, lastHeading.current);
      next = normalize(lastHeading.current + delta * 0.35);
    }

    lastHeading.current = next;
    setHeading(next);
    setSensorStatus("Live compass active");
  };

  const startCompass = async () => {
    try {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        const permission = await DeviceOrientationEvent.requestPermission();

        if (permission !== "granted") {
          setPermissionNeeded(true);
          setSensorStatus("Compass permission denied");
          return;
        }
      }

      window.addEventListener("deviceorientation", updateHeading, true);
      setPermissionNeeded(false);
      setSensorStatus("Calibrating compass...");
    } catch {
      setPermissionNeeded(true);
      setSensorStatus("Compass permission required");
    }
  };

  useEffect(() => {
    startCompass();

    return () => {
      window.removeEventListener("deviceorientation", updateHeading, true);
    };
  }, []);

  const relativeAngle = useMemo(() => {
    if (qiblaDirection == null || heading == null) return 0;
    return shortestAngle(qiblaDirection, heading);
  }, [qiblaDirection, heading]);

  const absoluteNeedleRotation = useMemo(() => {
    if (qiblaDirection == null || heading == null) return 0;
    return relativeAngle;
  }, [relativeAngle, qiblaDirection, heading]);

  const aligned = Math.abs(relativeAngle) <= 3;

  useEffect(() => {
    if (aligned && !vibrationLock.current) {
      vibrationLock.current = true;
      if (navigator.vibrate) navigator.vibrate([80, 50, 120]);
    }

    if (!aligned) vibrationLock.current = false;
  }, [aligned]);

  const turnText = aligned
    ? "You are facing the Qibla"
    : relativeAngle > 0
      ? `Turn right ${Math.round(Math.abs(relativeAngle))}°`
      : `Turn left ${Math.round(Math.abs(relativeAngle))}°`;

  const textMain = isDarkMode ? "text-white" : "text-slate-900";
  const textMuted = isDarkMode ? "text-white/50" : "text-slate-500";

  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);

  return (
    <div className="w-full max-w-md mx-auto px-1 pb-8">
      <div
        className={`relative overflow-hidden rounded-[36px] border backdrop-blur-3xl p-5 ${
          isDarkMode
            ? "bg-slate-950/70 border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
            : "bg-white/70 border-slate-200 shadow-[0_25px_70px_rgba(15,23,42,0.14)]"
        }`}
      >
        {/* Ambient glass highlights */}
        <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-emerald-400/10 border border-emerald-300/20 backdrop-blur-xl flex items-center justify-center">
                <Compass size={18} className="text-emerald-400" />
              </div>
              <div>
                <h2 className={`text-lg font-extrabold tracking-tight ${textMain}`}>
                  Qibla Compass
                </h2>
                <p className={`text-[10px] ${textMuted}`}>
                  Live direction to the Kaaba
                </p>
              </div>
            </div>
          </div>

          <div
            className={`px-2.5 py-1.5 rounded-full border text-[9px] font-bold ${
              aligned
                ? "bg-emerald-400/15 border-emerald-400/30 text-emerald-400"
                : isDarkMode
                  ? "bg-white/5 border-white/10 text-white/50"
                  : "bg-slate-100 border-slate-200 text-slate-500"
            }`}
          >
            {aligned ? "ALIGNED" : "LIVE"}
          </div>
        </div>

        {/* Main compass */}
        <div className="relative mx-auto w-[min(82vw,330px)] aspect-square">
          {/* Outer 3D shadow ring */}
          <div className="absolute inset-0 rounded-full bg-black/20 blur-xl translate-y-4 scale-[0.92]" />

          {/* Outer glass shell */}
          <div
            className={`absolute inset-0 rounded-full border shadow-2xl ${
              isDarkMode
                ? "bg-white/[0.035] border-white/15"
                : "bg-white/55 border-white/80"
            }`}
          />

          {/* Metallic/glass bevel */}
          <div className="absolute inset-[7px] rounded-full border border-white/10 shadow-[inset_0_2px_12px_rgba(255,255,255,0.12),inset_0_-12px_25px_rgba(0,0,0,0.22)]" />

          {/* Degree ticks */}
          <div className="absolute inset-[17px] rounded-full">
            {ticks.map((deg) => (
              <span
                key={deg}
                className="absolute left-1/2 top-1/2 block origin-center"
                style={{
                  height: "100%",
                  width: 1,
                  transform: `translate(-50%, -50%) rotate(${deg}deg)`,
                }}
              >
                <span
                  className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-full ${
                    deg % 45 === 0
                      ? "h-3 w-[2px] bg-emerald-300/80"
                      : deg % 15 === 0
                        ? "h-2 w-px bg-white/35"
                        : "h-1.5 w-px bg-white/15"
                  }`}
                />
              </span>
            ))}
          </div>

          {/* Cardinal points */}
          <div className="absolute inset-[40px]">
            <span className="absolute left-1/2 top-0 -translate-x-1/2 text-[11px] font-black text-rose-400">
              N
            </span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-bold opacity-60">
              E
            </span>
            <span className="absolute left-1/2 bottom-0 -translate-x-1/2 text-[10px] font-bold opacity-60">
              S
            </span>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] font-bold opacity-60">
              W
            </span>
          </div>

          {/* Fixed Kaaba target */}
          <div className="absolute left-1/2 top-[35px] -translate-x-1/2 z-30 flex flex-col items-center">
            <div
              className={`relative h-12 w-12 rounded-2xl border flex items-center justify-center backdrop-blur-xl shadow-xl ${
                aligned
                  ? "bg-emerald-400/20 border-emerald-300/50 shadow-emerald-400/30"
                  : isDarkMode
                    ? "bg-slate-900/80 border-amber-300/30"
                    : "bg-white/85 border-amber-300/50"
              }`}
            >
              <span className="text-[25px] leading-none drop-shadow-lg">🕋</span>
              <span className="absolute -inset-1 rounded-[18px] border border-amber-300/20" />
            </div>
            <span className="mt-1 text-[8px] font-black tracking-[0.18em] text-amber-300">
              KAABA
            </span>
          </div>

          {/* Professional Qibla needle */}
          <div
            className="absolute inset-0 z-20 transition-transform duration-200 ease-out"
            style={{ transform: `rotate(${absoluteNeedleRotation}deg)` }}
          >
            <div className="absolute left-1/2 top-[27%] -translate-x-1/2">
              <div className="relative h-[112px] w-[22px]">
                {/* Glow */}
                <div className="absolute left-1/2 top-0 h-[92px] w-3 -translate-x-1/2 rounded-full bg-emerald-400/30 blur-md" />

                {/* Needle shaft */}
                <div className="absolute left-1/2 top-[18px] h-[76px] w-[7px] -translate-x-1/2 rounded-full bg-gradient-to-b from-white via-emerald-300 to-emerald-600 shadow-[0_0_15px_rgba(52,211,153,0.55)]" />

                {/* Arrow head */}
                <div
                  className="absolute left-1/2 top-0 -translate-x-1/2 h-0 w-0"
                  style={{
                    borderLeft: "11px solid transparent",
                    borderRight: "11px solid transparent",
                    borderBottom: "27px solid rgb(52 211 153)",
                    filter: "drop-shadow(0 4px 5px rgba(0,0,0,.35))",
                  }}
                />

                {/* Tip highlight */}
                <div className="absolute left-1/2 top-[2px] -translate-x-1/2 h-0 w-0 border-l-[4px] border-r-[4px] border-b-[12px] border-l-transparent border-r-transparent border-b-white/80" />
              </div>
            </div>
          </div>

          {/* Center glass hub */}
          <div
            className={`absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full border flex items-center justify-center backdrop-blur-2xl shadow-2xl ${
              isDarkMode
                ? "bg-slate-900/65 border-white/15"
                : "bg-white/75 border-white"
            }`}
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-700 border border-white/30 shadow-[0_0_22px_rgba(52,211,153,0.35)] flex items-center justify-center">
              <LocateFixed size={19} className="text-white" />
            </div>
          </div>

          {/* Alignment ring */}
          <div
            className={`absolute inset-[29%] rounded-full border transition-all duration-500 ${
              aligned
                ? "border-emerald-300/70 shadow-[0_0_35px_rgba(52,211,153,.35)]"
                : "border-white/10"
            }`}
          />
        </div>

        {/* Direction status */}
        <div className="mt-5 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border backdrop-blur-xl ${
              aligned
                ? "bg-emerald-400/10 border-emerald-400/25 text-emerald-400"
                : isDarkMode
                  ? "bg-white/[0.04] border-white/10"
                  : "bg-slate-50 border-slate-200"
            }`}
          >
            {aligned ? (
              <CheckCircle2 size={16} />
            ) : (
              <RefreshCw size={15} className="opacity-70" />
            )}
            <span className="text-xs font-extrabold">{turnText}</span>
          </div>
        </div>

        {/* Data cards */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <div
            className={`rounded-2xl border p-3 backdrop-blur-xl ${
              isDarkMode
                ? "bg-white/[0.035] border-white/10"
                : "bg-white/65 border-slate-200"
            }`}
          >
            <p className={`text-[9px] uppercase tracking-wider font-bold ${textMuted}`}>
              Qibla Bearing
            </p>
            <p className={`text-lg font-black mt-1 ${textMain}`}>
              {qiblaDirection == null ? "--" : `${Math.round(qiblaDirection)}°`}
            </p>
          </div>

          <div
            className={`rounded-2xl border p-3 backdrop-blur-xl ${
              isDarkMode
                ? "bg-white/[0.035] border-white/10"
                : "bg-white/65 border-slate-200"
            }`}
          >
            <p className={`text-[9px] uppercase tracking-wider font-bold ${textMuted}`}>
              Phone Heading
            </p>
            <p className={`text-lg font-black mt-1 ${textMain}`}>
              {heading == null ? "--" : `${Math.round(heading)}°`}
            </p>
          </div>
        </div>

        {/* Sensor/location status */}
        <div className="mt-3 space-y-1 text-center">
          <p className={`text-[10px] font-medium ${textMuted}`}>
            {locationStatus}
          </p>
          <p className={`text-[9px] ${textMuted} flex items-center justify-center gap-1`}>
            <Smartphone size={11} />
            {sensorStatus}
          </p>
        </div>

        {/* Calibration / permission */}
        <button
          onClick={startCompass}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 hover:bg-emerald-400/15 active:scale-[0.98] transition-all py-3 text-[11px] font-extrabold text-emerald-400"
        >
          <RefreshCw size={14} />
          {permissionNeeded ? "Enable Compass" : "Calibrate Compass"}
        </button>

        {error && (
          <p className="mt-2 text-center text-[9px] leading-relaxed text-amber-400/80">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
