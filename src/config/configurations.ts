export default () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    githubToken: process.env.GITHUB_TOKEN,
    cacheProvider: process.env.CACHE_PROVIDER ?? 'memory',
    cacheTtlSec: parseInt(process.env.CACHE_TTL_SEC ?? '90', 10),
  });
