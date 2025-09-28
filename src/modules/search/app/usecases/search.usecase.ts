import { Inject, Injectable, Logger } from '@nestjs/common';
import * as repositoryGatewayPort from '../ports/repository-gateway.port';
import { REPOSITORY_GATEWAY } from '../ports/tokens';
import { ScoreService } from '../../services/score.service';
import type { CachePort } from '../../../../core/cache/cache.port';
import { CACHE_PORT } from '../../../../core/cache/tokens';
import crypto from 'crypto';

export interface SearchWithScoreResult extends repositoryGatewayPort.SearchResult {
  items: (repositoryGatewayPort.SearchResult['items'][number] & { score: number })[];
}

@Injectable()
export class SearchUseCase {
  private readonly logger = new Logger(SearchUseCase.name);

  constructor(
    @Inject(REPOSITORY_GATEWAY) private readonly gateway: repositoryGatewayPort.RepositoryGateway,
    private readonly scorer: ScoreService,
    @Inject(CACHE_PORT) private readonly cache: CachePort,
  ) {}

  async execute(params: repositoryGatewayPort.SearchParams): Promise<SearchWithScoreResult> {
    const key = crypto.createHash('sha256').update(JSON.stringify(params)).digest('hex');

    const cached = await this.cache.get<SearchWithScoreResult>(key);
    if (cached) {
      this.logger.debug(`Cache hit for ${key}`);
      return cached;
    }

    const res = await this.gateway.searchRepositories(params);
    const items = res.items
      .map(r => ({ ...r, score: this.scorer.calc({ stars: r.stars, forks: r.forks, updatedAt: r.updatedAt }) }))
      .sort((a, b) => b.score - a.score);

    const response: SearchWithScoreResult = { total: res.total, items };
    const ttl = parseInt(process.env.CACHE_TTL_SEC ?? '90', 10);
    await this.cache.set(key, response, ttl);
    return response;
  }
}
