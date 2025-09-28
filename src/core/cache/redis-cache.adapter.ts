import { CachePort } from './cache.port';
import Redis from 'ioredis';

export class RedisCacheAdapter implements CachePort {
  private client: Redis;

  constructor(url: string) {
    this.client = new Redis(url, {
      lazyConnect: false,
      maxRetriesPerRequest: 3,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async set<T>(key: string, value: T, ttlSec: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSec);
  }
}
