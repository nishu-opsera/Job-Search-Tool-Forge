import { sampleJobCard, searchRequestSchema } from "@job-search/shared";
import Fastify from "fastify";
import { registerSearchRoutes } from "./routes/search.js";
import { createClaudeClient } from "./services/claude/index.js";
import { BODY_LIMIT_BYTES, registerSecurityPlugins } from "./plugins/security.js";

export interface BuildAppOptions {
  claudeClient?: ReturnType<typeof createClaudeClient>;
}

export async function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify({
    logger: false,
    bodyLimit: BODY_LIMIT_BYTES,
  });

  await registerSecurityPlugins(app);

  const claudeClient = options.claudeClient ?? createClaudeClient();

  app.get("/", async () => ({
    name: "Job Search Tool API",
    status: "ok",
    endpoints: {
      health: "/api/healthz",
      sampleJob: "/api/jobs/sample",
      search: "POST /api/search",
    },
  }));

  app.get("/api/healthz", async () => ({ status: "ok" }));

  app.get("/api/jobs/sample", async () => ({ job: sampleJobCard }));

  registerSearchRoutes(app, { claudeClient });

  if (process.env.MOCK_AI === "true") {
    app.post("/api/dev/claude-generate", async (request, reply) => {
      const parsed = searchRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: "validation_failed",
          issues: parsed.error.issues,
        });
      }
      const result = await claudeClient.generateJobListings(parsed.data);
      return { jobs: result.jobs, metrics: result.metrics };
    });
  }

  return app;
}
