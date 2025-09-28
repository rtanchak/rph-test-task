export interface ScoreInput {
  stars: number;
  forks: number;
  updatedAt: string;
}

export class ScoreService {
  calc({ stars, forks, updatedAt }: ScoreInput): number {
    const starsL = Math.log(1 + (stars || 0));
    const forksL = Math.log(1 + (forks || 0));
    const days = Math.max(0, (Date.now() - new Date(updatedAt).getTime()) / 86_400_000);
    const freshness = 1 + 0.5 * Math.exp(-days / 180);
    return (0.6 * starsL + 0.3 * forksL) * freshness;
  }
}
