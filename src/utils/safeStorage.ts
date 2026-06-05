// Safe Storage Wrapper for sandboxed iframes and cross-browser security settings
// It falls back to in-memory storage seamlessly if localStorage or sessionStorage is blocked by browser policies.

const inMemoryLocalStorage: Record<string, string> = {};
const inMemorySessionStorage: Record<string, string> = {};

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`[Safe Storage] localStorage.getItem was blocked for key "${key}":`, e);
    }
    return key in inMemoryLocalStorage ? inMemoryLocalStorage[key] : null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn(`[Safe Storage] localStorage.setItem was blocked for key "${key}":`, e);
    }
    inMemoryLocalStorage[key] = String(value);
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (e) {
      console.warn(`[Safe Storage] localStorage.removeItem was blocked for key "${key}":`, e);
    }
    delete inMemoryLocalStorage[key];
  },
  clear: (): void => {
    try {
      if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
        window.localStorage.clear();
        return;
      }
    } catch (e) {
      console.warn("[Safe Storage] localStorage.clear was blocked:", e);
    }
    Object.keys(inMemoryLocalStorage).forEach((k) => delete inMemoryLocalStorage[k]);
  },
  key: (index: number): string | null => {
    try {
      if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
        return window.localStorage.key(index);
      }
    } catch (e) {
      // ignore
    }
    return Object.keys(inMemoryLocalStorage)[index] || null;
  },
  get length(): number {
    try {
      if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
        return window.localStorage.length;
      }
    } catch (e) {
      // ignore
    }
    return Object.keys(inMemoryLocalStorage).length;
  }
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && typeof window.sessionStorage !== "undefined") {
        return window.sessionStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`[Safe Storage] sessionStorage.getItem was blocked for key "${key}":`, e);
    }
    return key in inMemorySessionStorage ? inMemorySessionStorage[key] : null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && typeof window.sessionStorage !== "undefined") {
        window.sessionStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn(`[Safe Storage] sessionStorage.setItem was blocked for key "${key}":`, e);
    }
    inMemorySessionStorage[key] = String(value);
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined" && typeof window.sessionStorage !== "undefined") {
        window.sessionStorage.removeItem(key);
        return;
      }
    } catch (e) {
      console.warn(`[Safe Storage] sessionStorage.removeItem was blocked for key "${key}":`, e);
    }
    delete inMemorySessionStorage[key];
  },
  clear: (): void => {
    try {
      if (typeof window !== "undefined" && typeof window.sessionStorage !== "undefined") {
        window.sessionStorage.clear();
        return;
      }
    } catch (e) {
      console.warn("[Safe Storage] sessionStorage.clear was blocked:", e);
    }
    Object.keys(inMemorySessionStorage).forEach((k) => delete inMemorySessionStorage[k]);
  },
  key: (index: number): string | null => {
    try {
      if (typeof window !== "undefined" && typeof window.sessionStorage !== "undefined") {
        return window.sessionStorage.key(index);
      }
    } catch (e) {
      // ignore
    }
    return Object.keys(inMemorySessionStorage)[index] || null;
  },
  get length(): number {
    try {
      if (typeof window !== "undefined" && typeof window.sessionStorage !== "undefined") {
        return window.sessionStorage.length;
      }
    } catch (e) {
      // ignore
    }
    return Object.keys(inMemorySessionStorage).length;
  }
};
