// Browser notification foundation.
// Exact prayer times should come from the existing prayer-time service.
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.requestPermission();
}

export function showNotification(title, options = {}) {
  if (!('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;
  new Notification(title, options);
  return true;
}
