import { GithubRepoRaw } from './github.types';
import { Repo } from '../../../search/model/repo';

export function mapGithubRepo(r: GithubRepoRaw): Repo {
  return {
    id: r.id,
    fullName: r.full_name,
    htmlUrl: r.html_url,
    description: r.description,
    stars: r.stargazers_count,
    forks: r.forks_count,
    updatedAt: r.updated_at,
    language: r.language,
  };
}
