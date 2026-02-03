const PREFIX = 'rhne_';

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`${PREFIX}${key}`);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    } catch {
      // Storage full or unavailable
    }
  },

  remove(key: string): void {
    localStorage.removeItem(`${PREFIX}${key}`);
  },

  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  },
};
