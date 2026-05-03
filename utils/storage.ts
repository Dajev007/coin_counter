import AsyncStorage from '@react-native-async-storage/async-storage';

export type CoinBreakdown = {
  coinId: string;
  label: string;
  weightGrams: number;
  count: number;
  value: number;
};

export type SavedCount = {
  id: string;
  timestamp: number;
  totalValue: number;
  totalCoins: number;
  totalWeight: number;
  breakdown: CoinBreakdown[];
};

const STORAGE_KEY = 'coin_weight_history';

export async function loadHistory(): Promise<SavedCount[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedCount[];
  } catch {
    return [];
  }
}

export async function saveCount(entry: Omit<SavedCount, 'id' | 'timestamp'>): Promise<SavedCount> {
  const newEntry: SavedCount = {
    ...entry,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  const existing = await loadHistory();
  const updated = [newEntry, ...existing];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
}

export async function deleteCount(id: string): Promise<SavedCount[]> {
  const existing = await loadHistory();
  const updated = existing.filter((e) => e.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
