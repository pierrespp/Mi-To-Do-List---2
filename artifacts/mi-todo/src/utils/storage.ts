/**
 * Hybrid Persistence Utility
 * Bridges window.storage (if provided by Replit/Platform) with local browser storage fallbacks.
 */

export const getStoredItem = (key: string, defaultValue: string): string => {
  try {
    if (typeof window !== "undefined" && (window as any).storage) {
      return (window as any).storage.get(key) || defaultValue;
    }
  } catch (e) {
    // Fail-safe fallback
  }
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export const setStoredItem = (key: string, value: string): void => {
  try {
    if (typeof window !== "undefined" && (window as any).storage) {
      (window as any).storage.set(key, value);
    }
  } catch (e) {
    // Fail-safe fallback
  }
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // Fail silently in environments with storage blocks (e.g. iframe restrictions)
  }
};
