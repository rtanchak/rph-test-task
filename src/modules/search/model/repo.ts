export interface Repo {
    id: number;
    fullName: string;
    htmlUrl: string;
    description?: string;
    stars: number;
    forks: number;
    updatedAt: string;
    language?: string;
  }
