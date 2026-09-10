const PREFIX = 'muslim-world:';

export function saveOffline(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function getOffline(key, fallback = null) {
  try {
    const value = localStorage.getItem(PREFIX + key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function removeOffline(key) {
  localStorage.removeItem(PREFIX + key);
}
