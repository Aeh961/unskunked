import AsyncStorage from "@react-native-async-storage/async-storage";

export type StorageDriver = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const nodeFallbackStorage: Record<string, string> = {};

export const asyncStorageDriver: StorageDriver = {
  getItem: (key) => {
    if (typeof window === "undefined") return Promise.resolve(nodeFallbackStorage[key] ?? null);
    return AsyncStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (typeof window === "undefined") {
      nodeFallbackStorage[key] = value;
      return Promise.resolve();
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (typeof window === "undefined") {
      delete nodeFallbackStorage[key];
      return Promise.resolve();
    }
    return AsyncStorage.removeItem(key);
  }
};

export function createMemoryStorageDriver(initial: Record<string, string> = {}): StorageDriver & { snapshot: () => Record<string, string> } {
  const state = { ...initial };
  return {
    async getItem(key) {
      return state[key] ?? null;
    },
    async setItem(key, value) {
      state[key] = value;
    },
    async removeItem(key) {
      delete state[key];
    },
    snapshot() {
      return { ...state };
    }
  };
}

export function createStorageRepository(driver: StorageDriver = asyncStorageDriver) {
  return {
    async readJson<T>(key: string, fallback: T): Promise<T> {
      try {
        const raw = await driver.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
      } catch {
        return fallback;
      }
    },
    async writeJson<T>(key: string, value: T) {
      await driver.setItem(key, JSON.stringify(value));
      return value;
    },
    async remove(key: string) {
      await driver.removeItem(key);
    }
  };
}

export const storage = createStorageRepository();
