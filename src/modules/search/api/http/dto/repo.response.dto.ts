export interface RepoResponseDto {
  id: number;
  fullName: string;
  htmlUrl: string;
  description?: string;
  stars: number;
  forks: number;
  updatedAt: string;
  language?: string;
  score: number;
}
export interface SearchResponseDto {
  total: number;
  items: RepoResponseDto[];
}
