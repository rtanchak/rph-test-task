export interface GithubRepoRaw {
  id: number;
  full_name: string;
  html_url: string;
  description?: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  language?: string;
}
export interface GithubSearchResponse {
  total_count: number;
  items: GithubRepoRaw[];
}
