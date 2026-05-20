import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { MockClaudeClient } from "../services/claude/mock-claude-client.js";
import { buildApp } from "../app.js";
import { resetRateLimitStore } from "../lib/rate-limit.js";

const validBody = JSON.parse(
  readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../../fixtures/search/valid-request.json",
    ),
    "utf-8",
  ),
);

describe("security middleware (WO-023)", () => {
  afterEach(() => {
    resetRateLimitStore();
  });

  it("includes security headers on API responses", async () => {
    const app = await buildApp({
      claudeClient: new MockClaudeClient({ latencyMs: 0 }),
    });
    const response = await app.inject({ method: "GET", url: "/api/healthz" });
    expect(response.statusCode).toBe(200);
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("DENY");
    expect(response.headers["referrer-policy"]).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(response.headers["strict-transport-security"]).toContain(
      "max-age=31536000",
    );
    expect(response.headers["content-security-policy"]).toBeDefined();
    await app.close();
  });

  it("allows CORS for configured frontend origin", async () => {
    const app = await buildApp({
      claudeClient: new MockClaudeClient({ latencyMs: 0 }),
    });
    const response = await app.inject({
      method: "OPTIONS",
      url: "/api/search",
      headers: {
        origin: "http://localhost:5173",
        "access-control-request-method": "POST",
      },
    });
    expect(response.statusCode).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173",
    );
    await app.close();
  });

  it("does not reflect disallowed origins in CORS headers", async () => {
    const app = await buildApp({
      claudeClient: new MockClaudeClient({ latencyMs: 0 }),
    });
    const response = await app.inject({
      method: "OPTIONS",
      url: "/api/search",
      headers: {
        origin: "https://evil.example",
        "access-control-request-method": "POST",
      },
    });
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
    await app.close();
  });

  it("returns 413 for request bodies over 10KB", async () => {
    const app = await buildApp({
      claudeClient: new MockClaudeClient({ latencyMs: 0 }),
    });
    const hugePayload = {
      ...validBody,
      jobTitle: "x".repeat(11_000),
    };
    const response = await app.inject({
      method: "POST",
      url: "/api/search",
      payload: hugePayload,
      headers: { origin: "http://localhost:5173" },
    });
    expect(response.statusCode).toBe(413);
    await app.close();
  });
});
