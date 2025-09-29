import { INestApplication, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { SearchModule } from '../src/modules/search/search.module';
import { REPOSITORY_GATEWAY } from '../src/modules/search/app/ports/tokens';
import {
  RepositoryGateway,
  SearchParams,
  SearchResult,
} from '../src/modules/search/app/ports/repository-gateway.port';

import { CACHE_PORT } from '../src/core/cache/tokens';
import { MemoryCacheAdapter } from '../src/core/cache/memory-cache.adapter';
import { GithubRepositoryGateway } from '../src/modules/search/infra/github/github.gateway';

class FakeGateway implements RepositoryGateway {
  async searchRepositories(_: SearchParams): Promise<SearchResult> {
    return {
      total: 3,
      items: [
        {
          id: 1,
          fullName: 'a/low',
          htmlUrl: '#',
          description: 'low',
          stars: 10,
          forks: 1,
          updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          language: 'ts',
        },
        {
          id: 2,
          fullName: 'b/high',
          htmlUrl: '#',
          description: 'high',
          stars: 2000,
          forks: 400,
          updatedAt: new Date().toISOString(),
          language: 'ts',
        },
        {
          id: 3,
          fullName: 'c/mid',
          htmlUrl: '#',
          description: 'mid',
          stars: 200,
          forks: 20,
          updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
          language: 'ts',
        },
      ],
    };
  }
}

@Global()
@Module({
  providers: [{ provide: CACHE_PORT, useValue: new MemoryCacheAdapter() }],
  exports: [CACHE_PORT],
})
class FakeCacheModule {}

describe('SearchController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FakeCacheModule, SearchModule],
    })
      .overrideProvider(REPOSITORY_GATEWAY)
      .useClass(FakeGateway)
      .overrideProvider(GithubRepositoryGateway)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('/api/repos/search returns scored & sorted items', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/repos/search')
      .query({ q: 'test', language: 'ts', per_page: 3 })
      .expect(200);

    expect(res.body).toHaveProperty('total', 3);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items[0]).toHaveProperty('score');
    expect(res.body.items[0].fullName).toBe('b/high');
  });
});
