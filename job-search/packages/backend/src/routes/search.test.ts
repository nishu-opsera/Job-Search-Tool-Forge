import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SEARCH_DISCLAIMER } from "@job-search/shared";
import { buildApp } from "../app.js";
import { resetRateLimitStore } from "../lib/rate-limit.js";
import { MockClaudeClient } from "../services/claude/mock-claude-client.js";
import {
  CircuitOpenError,
  ClaudeTimeoutError,
} from "../services/claude/errors.js";

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../fixtures/search",
);

const validBody = JSON.parse(
  readFileSync(join(fixturesDir, "valid-request.json"), "utf-8"),
);
const invalidBody = JSON.parse(
  readFileSync(join(fixturesDir, "invalid-request.json"), "utf-8"),
);

describe("POST /api/search", () => {
  afterEach(() => {
    resetRateLimitStore();
    vi.restoreAllMocks();
  });

  it("returns 200 with six jobs and disclaimer", async () => {
    const app = await buildApp({
      claudeClient: new MockClaudeClient({ latencyMs: 0 }),
    });
    const response = await app.inject({
      method: "POST",
      url: "/api/search",
      payload: validBody,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json() as {
      jobs: unknown[];
      disclaimer: string;
    };
    expect(body.jobs).toHaveLength(6);
    expect(body.disclaimer).toBe(SEARCH_DISCLAIMER);
    await app.close();
  });

  it("returns 400 for invalid request body", async () => {
    const app = await buildApp({
      claudeClient: new MockClaudeClient({ latencyMs: 0 }),
    });
    const response = await app.inject({
      method: "POST",
      url: "/api/search",
      payload: invalidBody,
    });
    expect(response.statusCode).toBe(400);
    const body = response.json() as { error: string };
    expect(body.error).toBe("validation_failed");
    await app.close();
  });

  it("returns 400 for empty body", async () => {
    const app = await buildApp({
      claudeClient: new MockClaudeClient({ latencyMs: 0 }),
    });
    const response = await app.inject({
      method: "POST",
      url: "/api/search",
      payload: {},
    });
    expect(response.statusCode).toBe(400);
    await app.close();
  });

  it("returns 429 after rate limit exceeded", async () => {
    const app = await buildApp({
      claudeClient: new MockClaudeClient({ latencyMs: 0 }),
    });
    for (let i = 0; i < 30; i++) {
      await app.inject({
        method: "POST",
        url: "/api/search",
        payload: validBody,
        remoteAddress: "10.0.0.1",
      });
    }
    const response = await app.inject({
      method: "POST",
      url: "/api/search",
      payload: validBody,
      remoteAddress: "10.0.0.1",
    });
    expect(response.statusCode).toBe(429);
    expect(response.headers["retry-after"]).toBeDefined();
    await app.close();
  });

  it("returns 504 when Claude times out", async () => {
    const mockClient = new MockClaudeClient({ latencyMs: 0 });
    vi.spyOn(mockClient, "generateJobListings").mockRejectedValue(
      new ClaudeTimeoutError(),
    );
    const app = await buildApp({ claudeClient: mockClient });
    const response = await app.inject({
      method: "POST",
      url: "/api/search",
      payload: validBody,
    });
    expect(response.statusCode).toBe(504);
    await app.close();
  });

  it("returns 503 when circuit is open", async () => {
    const mockClient = new MockClaudeClient({ latencyMs: 0 });
    vi.spyOn(mockClient, "generateJobListings").mockRejectedValue(
      new CircuitOpenError(),
    );
    const app = await buildApp({ claudeClient: mockClient });
    const response = await app.inject({
      method: "POST",
      url: "/api/search",
      payload: validBody,
    });
    expect(response.statusCode).toBe(503);
    await app.close();
  });
});
