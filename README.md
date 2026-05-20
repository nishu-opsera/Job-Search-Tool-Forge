# ws-forge

Workspace for Forge-linked projects.

## Projects

| Directory | Description |
|-----------|-------------|
| [`job-search/`](job-search/) | Job Search Tool monorepo (React frontend + Fastify backend) |

## Job Search Tool

From **ws-forge root** (scripts delegate to `job-search/`):

```bash
npm install
npm run dev:backend   # port 3001
npm run dev:frontend  # port 5173
```

Or work inside the project:

```bash
cd job-search
npm install
npm run dev:backend
npm run dev:frontend
```

See [job-search/README.md](job-search/README.md) for full setup and scripts.
