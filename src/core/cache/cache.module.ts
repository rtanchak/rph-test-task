import { Global, Module } from '@nestjs/common';
import { MemoryCacheAdapter } from './memory-cache.adapter';
import { RedisCacheAdapter } from './redis-cache.adapter';
import { CACHE_PORT } from './tokens';
import type { CachePort } from './cache.port';

@Global()
@Module({
  providers: [
    {
      provide: CACHE_PORT,
      useFactory: (): CachePort => {
        const provider = (process.env.CACHE_PROVIDER || 'memory').toLowerCase();
        if (provider === 'redis') {
          const url = process.env.REDIS_URL || 'redis://localhost:6379';
          return new RedisCacheAdapter(url);
        }
        return new MemoryCacheAdapter();
      },
    },
  ],
  exports: [CACHE_PORT],
})
export class CacheModule {}
