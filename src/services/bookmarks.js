import { getOffline, saveOffline } from './offlineStorage';

const KEY = 'bookmarks';

export function getBookmarks() {
  return getOffline(KEY, []);
}

export function addBookmark(item) {
  const items = getBookmarks();
  if (!items.some(x => x.id === item.id)) {
    saveOffline(KEY, [...items, item]);
  }
}

export function removeBookmark(id) {
  saveOffline(KEY, getBookmarks().filter(x => x.id !== id));
}

export function isBookmarked(id) {
  return getBookmarks().some(x => x.id === id);
}
