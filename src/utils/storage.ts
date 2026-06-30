import AsyncStorage from "@react-native-async-storage/async-storage";

export type StorageDriver = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

export const asyncStorageDriver: StorageDriver = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: (key) => AsyncStorage.removeItem(key)
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
