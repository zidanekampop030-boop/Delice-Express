import AsyncStorage from '@react-native-async-storage/async-storage';

/** Persistance JSON tolérante aux pannes : un stockage indisponible ne doit jamais casser l'app. */
export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function writeJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* best effort */
  }
}
