import { CachePort } from './cache.port';

interface CacheEntry {
  value: any;
  expiresAt: number;
}

export class MemoryCacheAdapter implements CachePort {
  private store = new Map<string, CacheEntry>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSec: number): Promise<void> {
    const expiresAt = Date.now() + ttlSec * 1000;
    this.store.set(key, { value, expiresAt });
  }
}
