// Lightweight offline readiness helper.
export function isOffline() {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

export function registerOfflineListeners(onChange) {
  const handler = () => onChange?.(!navigator.onLine);
  window.addEventListener('online', handler);
  window.addEventListener('offline', handler);

  return () => {
    window.removeEventListener('online', handler);
    window.removeEventListener('offline', handler);
  };
}
