import type { JobCard } from "@job-search/shared";
import Fastify from "fastify";

export function buildApp() {
  const app = Fastify({ logger: false });

  app.get("/api/healthz", async () => ({ status: "ok" }));

  app.get("/api/jobs/sample", async () => {
    const sample: JobCard = {
      id: "sample-1",
      title: "Software Engineer",
      company: "Acme Corp",
      location: "Remote",
      postedAt: new Date().toISOString(),
    };
    return { job: sample };
  });

  return app;
}
