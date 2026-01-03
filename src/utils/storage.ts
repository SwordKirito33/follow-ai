/**
 * Local Storage Utilities with type safety and expiration
 */

interface StorageItem<T> {
  value: T;
  timestamp: number;
  expiresAt?: number;
}

/**
 * Safe JSON parse
 */
const safeJsonParse = <T>(value: string, fallback: T): T => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

/**
 * Check if storage is available
 */
export const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get item from storage
 */
export const getItem = <T>(
  key: string,
  fallback: T,
  storage: Storage = localStorage
): T => {
  try {
    const item = storage.getItem(key);
    if (!item) return fallback;

    const parsed = safeJsonParse<StorageItem<T>>(item, { value: fallback, timestamp: 0 });

    // Check expiration
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      storage.removeItem(key);
      return fallback;
    }

    return parsed.value;
  } catch {
    return fallback;
  }
};

/**
 * Set item in storage
 */
export const setItem = <T>(
  key: string,
  value: T,
  options?: { expiresIn?: number; storage?: Storage }
): boolean => {
  try {
    const storage = options?.storage || localStorage;
    const item: StorageItem<T> = {
      value,
      timestamp: Date.now(),
      expiresAt: options?.expiresIn ? Date.now() + options.expiresIn : undefined,
    };
    storage.setItem(key, JSON.stringify(item));
    return true;
  } catch {
    return false;
  }
};

/**
 * Remove item from storage
 */
export const removeItem = (key: string, storage: Storage = localStorage): boolean => {
  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

/**
 * Clear all items from storage
 */
export const clearStorage = (storage: Storage = localStorage): boolean => {
  try {
    storage.clear();
    return true;
  } catch {
    return false;
  }
};

/**
 * Get all keys from storage
 */
export const getKeys = (storage: Storage = localStorage): string[] => {
  try {
    return Object.keys(storage);
  } catch {
    return [];
  }
};

/**
 * Get storage size in bytes
 */
export const getStorageSize = (storage: Storage = localStorage): number => {
  try {
    let size = 0;
    for (const key of Object.keys(storage)) {
      size += (storage.getItem(key) || '').length * 2; // UTF-16
    }
    return size;
  } catch {
    return 0;
  }
};

/**
 * Clean expired items from storage
 */
export const cleanExpiredItems = (storage: Storage = localStorage): number => {
  let cleaned = 0;
  try {
    for (const key of Object.keys(storage)) {
      const item = storage.getItem(key);
      if (item) {
        const parsed = safeJsonParse<StorageItem<any>>(item, null);
        if (parsed?.expiresAt && Date.now() > parsed.expiresAt) {
          storage.removeItem(key);
          cleaned++;
        }
      }
    }
  } catch {
    // Ignore errors
  }
  return cleaned;
};

/**
 * Storage keys enum for type safety
 */
export const STORAGE_KEYS = {
  USER: 'follow-ai-user',
  AUTH_TOKEN: 'follow-ai-auth-token',
  THEME: 'follow-ai-theme',
  LANGUAGE: 'follow-ai-language',
  FONT: 'follow-ai-font',
  FAVORITES: 'follow-ai-favorites',
  RECENT_SEARCHES: 'follow-ai-recent-searches',
  COOKIE_CONSENT: 'follow-ai-cookie-consent',
  NOTIFICATION_SETTINGS: 'follow-ai-notification-settings',
  DRAFT: 'follow-ai-draft',
} as const;

/**
 * User preferences storage
 */
export const userPreferences = {
  get: <T extends keyof typeof STORAGE_KEYS>(
    key: T,
    fallback: any
  ) => getItem(STORAGE_KEYS[key], fallback),

  set: <T extends keyof typeof STORAGE_KEYS>(
    key: T,
    value: any,
    expiresIn?: number
  ) => setItem(STORAGE_KEYS[key], value, { expiresIn }),

  remove: <T extends keyof typeof STORAGE_KEYS>(key: T) =>
    removeItem(STORAGE_KEYS[key]),
};

/**
 * Session storage helpers
 */
export const sessionStorage = {
  get: <T>(key: string, fallback: T) =>
    getItem(key, fallback, window.sessionStorage),
  set: <T>(key: string, value: T, expiresIn?: number) =>
    setItem(key, value, { expiresIn, storage: window.sessionStorage }),
  remove: (key: string) => removeItem(key, window.sessionStorage),
  clear: () => clearStorage(window.sessionStorage),
};

/**
 * Create a namespaced storage
 */
export const createNamespacedStorage = (namespace: string) => {
  const prefix = `${namespace}:`;

  return {
    get: <T>(key: string, fallback: T) => getItem(`${prefix}${key}`, fallback),
    set: <T>(key: string, value: T, expiresIn?: number) =>
      setItem(`${prefix}${key}`, value, { expiresIn }),
    remove: (key: string) => removeItem(`${prefix}${key}`),
    clear: () => {
      const keys = getKeys().filter((k) => k.startsWith(prefix));
      keys.forEach((k) => removeItem(k));
    },
    getKeys: () => getKeys().filter((k) => k.startsWith(prefix)),
  };
};

export default {
  isStorageAvailable,
  getItem,
  setItem,
  removeItem,
  clearStorage,
  getKeys,
  getStorageSize,
  cleanExpiredItems,
  userPreferences,
  sessionStorage,
  createNamespacedStorage,
  STORAGE_KEYS,
};
