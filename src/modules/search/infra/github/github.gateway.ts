import { Injectable } from '@nestjs/common';
import { HttpClient } from '../../../../core/http/http.client';
import { RepositoryGateway, SearchParams, SearchResult } from '../../app/ports/repository-gateway.port';
import { GithubSearchResponse } from './github.types';
import { mapGithubRepo } from './github.mapper';

@Injectable()
export class GithubRepositoryGateway implements RepositoryGateway {
  constructor(private readonly http: HttpClient) {}

  private get authHeader() {
    const t = process.env.GITHUB_TOKEN;
    return t ? { Authorization: `Bearer ${t}` } : {};
  }

  async searchRepositories(params: SearchParams): Promise<SearchResult> {
    const { q, language, createdAfter, page = 1, perPage = 20 } = params;
    let query = q;
    if (language) query += ` language:${language}`;
    if (createdAfter) query += ` created:>=${createdAfter}`;

    const res = await this.http.get<GithubSearchResponse>('/search/repositories', {
      baseURL: 'https://api.github.com',
      headers: { Accept: 'application/vnd.github+json', ...this.authHeader },
      params: { q: query, page, per_page: perPage },
      timeout: 5000,
    });

    return {
      total: res.data.total_count,
      items: res.data.items.map(mapGithubRepo),
    };
  }
}
