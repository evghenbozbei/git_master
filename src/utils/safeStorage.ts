// localStorage can throw (SecurityError when storage is blocked, QuotaExceededError on write),
// so every access goes through these guards instead of touching localStorage directly.
export const safeStorage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // storage denied or quota exceeded
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // storage denied
    }
  }
};
