import { getOffline, saveOffline } from './offlineStorage';
import { getBookmarks, addBookmark, removeBookmark, isBookmarked } from './bookmarks';
import { HADITH_COLLECTIONS, searchHadith } from './hadith';
import { askIslamicQuestion } from './aiQna';
import { requestNotificationPermission, showNotification } from './notifications';
import { islamicMonths, ramadanCalendar } from '../data/islamicCalendar';

export const MuslimWorldFeatures = {
  calendar: {
    months: islamicMonths,
    ramadan: ramadanCalendar
  },

  offline: {
    get: getOffline,
    save: saveOffline
  },

  bookmarks: {
    get: getBookmarks,
    add: addBookmark,
    remove: removeBookmark,
    has: isBookmarked
  },

  hadith: {
    collections: HADITH_COLLECTIONS,
    search: searchHadith
  },

  ai: {
    ask: askIslamicQuestion
  },

  notifications: {
    requestPermission: requestNotificationPermission,
    show: showNotification
  }
};
