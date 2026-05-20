import { sampleJobCard, searchRequestSchema } from "@job-search/shared";
import Fastify from "fastify";
import { createClaudeClient } from "./services/claude/index.js";

export function buildApp() {
  const app = Fastify({ logger: false });

  app.get("/", async () => ({
    name: "Job Search Tool API",
    status: "ok",
    endpoints: {
      health: "/api/healthz",
      sampleJob: "/api/jobs/sample",
    },
  }));

  app.get("/api/healthz", async () => ({ status: "ok" }));

  app.get("/api/jobs/sample", async () => ({ job: sampleJobCard }));

  if (process.env.MOCK_AI === "true") {
    app.post("/api/dev/claude-generate", async (request, reply) => {
      const parsed = searchRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: "validation_failed",
          issues: parsed.error.issues,
        });
      }
      const client = createClaudeClient();
      const result = await client.generateJobListings(parsed.data);
      return { jobs: result.jobs, metrics: result.metrics };
    });
  }

  return app;
}
