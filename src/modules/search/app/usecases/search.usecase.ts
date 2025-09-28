import { Inject, Injectable } from '@nestjs/common';
import { RepositoryGateway, SearchParams, SearchResult } from '../ports/repository-gateway.port';
import { REPOSITORY_GATEWAY } from '../ports/tokens';
import { ScoreService } from '../../services/score.service';

export interface SearchWithScoreResult extends SearchResult {
  items: (SearchResult['items'][number] & { score: number })[];
}

@Injectable()
export class SearchUseCase {
  constructor(
    @Inject(REPOSITORY_GATEWAY) private readonly gateway: RepositoryGateway,
    private readonly scorer: ScoreService,
  ) {}

  async execute(params: SearchParams): Promise<SearchWithScoreResult> {
    const res = await this.gateway.searchRepositories(params);
    const items = res.items
      .map(r => ({ ...r, score: this.scorer.calc({ stars: r.stars, forks: r.forks, updatedAt: r.updatedAt }) }))
      .sort((a, b) => b.score - a.score);
    return { total: res.total, items };
  }
}
