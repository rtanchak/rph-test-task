import { Repo } from '../../model/repo';

export interface SearchParams {
  query: string;
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
