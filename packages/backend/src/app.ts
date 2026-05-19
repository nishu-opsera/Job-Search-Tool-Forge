import { sampleJobCard } from "@job-search/shared";
import Fastify from "fastify";

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

  return app;
}
