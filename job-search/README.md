# Job Search Tool

Monorepo for the Job Search Tool (React frontend + Node.js backend).

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
npm install
npm run build -w @job-search/shared
```

## Development

Start the backend (port 3001):

```bash
npm run dev:backend
```

Start the frontend (port 5173, proxies `/api` to the backend):

```bash
npm run dev:frontend
```

## Packages

| Package | Description |
|---------|-------------|
| `@job-search/shared` | Shared TypeScript types (`JobCard`, etc.) |
| `@job-search/frontend` | Vite + React + TypeScript |
| `@job-search/backend` | Fastify + TypeScript |

## Scripts (root)

| Script | Description |
|--------|-------------|
| `npm run dev:frontend` | Vite dev server |
| `npm run dev:backend` | Backend dev server |
| `npm run build` | Build all packages |
| `npm run lint` | ESLint all packages |
| `npm run test` | Run unit tests |
| `npm run typecheck` | `tsc --noEmit` in all packages |

## Health check

```bash
curl http://localhost:3001/api/healthz
# {"status":"ok"}
```

## AI client (WO-005)

Copy `.env.example` to `.env` and set `MOCK_AI=true` for local development without an Anthropic API key.

```bash
# Terminal 1
MOCK_AI=true npm run dev:backend

# Search API (WO-006)
curl -s -X POST http://localhost:3001/api/search \
  -H 'Content-Type: application/json' \
  -d '{"jobTitle":"Engineer","roleFunction":"Engineering","experienceLevel":"Senior","keySkills":["TypeScript"],"country":"US","workType":"Remote"}' | jq '{job_count: (.jobs | length), disclaimer}'
```
