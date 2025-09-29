import { ScoreService } from '../src/modules/search/services/score.service';

describe('ScoreService', () => {
  const svc = new ScoreService();

  function isoDaysAgo(days: number) {
    const d = new Date(Date.now() - days * 86_400_000);
    return d.toISOString();
    }

  it('gives higher score for more stars/forks', () => {
    const a = svc.calc({ stars: 10, forks: 2, updatedAt: isoDaysAgo(5) });
    const b = svc.calc({ stars: 1000, forks: 200, updatedAt: isoDaysAgo(5) });
    expect(b).toBeGreaterThan(a);
  });

  it('penalizes stale repos (updated long ago)', () => {
    const fresh = svc.calc({ stars: 200, forks: 40, updatedAt: isoDaysAgo(3) });
    const stale = svc.calc({ stars: 200, forks: 40, updatedAt: isoDaysAgo(400) });
    expect(fresh).toBeGreaterThan(stale);
  });

  it('handles zero values safely', () => {
    const s = svc.calc({ stars: 0, forks: 0, updatedAt: isoDaysAgo(1) });
    expect(Number.isFinite(s)).toBe(true);
    expect(s).toBeGreaterThanOrEqual(0);
  });
});
