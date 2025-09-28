import { Repo } from '../../model/repo';

export interface SearchParams {
  q: string;
  language?: string;
  createdAfter?: string;
  page?: number;
  perPage?: number;
}

export interface SearchResult {
  total: number;
  items: Repo[];
}

export interface RepositoryGateway {
  searchRepositories(params: SearchParams): Promise<SearchResult>;
}
