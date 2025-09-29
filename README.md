# Redcare GitHub Search API – Take-Home Implementation
This repository contains a minimal but production-ready backend slice, built as part of a take-home exercise to evaluate backend engineering and system design skills.
The goal was to deliver a thin, well-documented slice end-to-end that integrates with the GitHub Search API, exposes a clean REST interface, and demonstrates good engineering practices.

## High level
You will find an end-to-end implementation consisting of:
- NestJS backend (TypeScript) - exposes a REST API for searching repositories on GitHub, adds input validation, a scoring algorithm, caching, and OpenAPI docs.
- Core modules - shared infrastructure for HTTP requests, configuration, and caching (memory/Redis)
- Tests: unit tests for the scoring service and an e2e test for the search flow (with mocked gateway)
- Dockerized environment - ready to build and run with Docker Compose

## What’s implemented

### Backend (NestJS)

#### Endpoints

GET /api/repos/search
Query GitHub repositories with following filters:
 - query - query string (required)
 - language - optional language filter
 - created_after - filter by earliest creation date (YYYY-MM-DD)
 - page, per_page - pagination

Validations: query params validated via class-validator.

#### Scoring algorithm

Popularity score = weighted stars + forks with recency factor:
starsL = ln(1 + stars)
forksL = ln(1 + forks)
freshness = 1 + 0.5 * exp(-days_since_update / 180)
score = (0.6 * starsL + 0.3 * forksL) * freshness
Ensures balance between legacy popularity and recent activity.

#### Caching
Default in-memory TTL cache (90s).
Redis adapter available (switchable via .env -> CACHE_PROVIDER=redis).

#### Documentation
Swagger UI at /docs
OpenAPI JSON at /docs/json

#### Logging
pino logger with request correlation

#### Error handling
Input errors -> 400
GitHub rate limits -> 429
Upstream failures -> 502/504
*Response*
```
{
  "total": 1234,
  "items": [
    {
      "id": 1,
      "fullName": "nestjs/nest",
      "htmlUrl": "https://github.com/nestjs/nest",
      "description": "A progressive Node.js framework",
      "stars": 65000,
      "forks": 7000,
      "updatedAt": "2025-09-20T12:34:56Z",
      "language": "TypeScript",
      "score": 42.13
    }
  ]
}
```

### How to run
Using Docker Compose (recommended)
docker compose up --build

#### Services and ports:
Backend -> http://localhost:3000
Swagger docs -> http://localhost:3000/docs
Redis (optional) -> localhost:6379

#### Local development
pnpm install
pnpm run start:dev


#### Requirements:
Node.js v24 (LTS)
pnpm
GitHub Personal Access Token in .env

#### Configuration
Example .env:
```
PORT=3000
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
CACHE_PROVIDER=memory   # or redis
CACHE_TTL_SEC=90
REDIS_URL=redis://localhost:6379
```

### Development tips
Generate GitHub token: Settings -> Developer Settings -> Personal Access Tokens -> Generate new token (classic). Grant at least public_repo.
Swagger UI: check requests interactively at /docs.
Tests: run unit + e2e tests
pnpm test

### What we evaluate (and show here)
API integrates with GitHub and applies scoring + caching.
Code is feature-first organized (modules/search), types and interfaces in separate files.
Input validation, retries with backoff, configurable caching, clear error handling.

#### Bonus:
- Swagger/OpenAPI documentation
- Unit tests (ScoreService)
- E2E test (/api/repos/search with mocked gateway)
- Docker Compose setup (app + Redis)

#### Deliverables
This repository includes:
- Completed backend implementation (NestJS)
- Core infrastructure modules (HTTP client, caching)
- Unit + e2e tests
- Dockerfile + docker-compose.yml
- README.md (this file)
- OpenAPI docs and sample requests
