import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExperienceLevel, WorkType } from "@job-search/shared";
import { AnthropicClaudeClient } from "./anthropic-claude-client.js";
import { CircuitBreaker } from "./circuit-breaker.js";
import {
  CircuitOpenError,
  ClaudeTimeoutError,
  ClaudeValidationError,
} from "./errors.js";

const sampleFilters = {
  jobTitle: "Software Engineer",
  roleFunction: "Engineering",
  experienceLevel: ExperienceLevel.Senior,
  keySkills: ["TypeScript", "React"],
  country: "United States",
  workType: WorkType.Remote,
};

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../fixtures/claude",
);

function loadValidJobs(): unknown[] {
  return JSON.parse(
    readFileSync(join(fixturesDir, "valid-response.json"), "utf-8"),
  );
}

function createMockSdk(
  responses: Array<{ input: unknown; usage?: { input_tokens: number; output_tokens: number } }>,
) {
  let call = 0;
  return {
    messages: {
      create: vi.fn(async () => {
        const entry = responses[call] ?? responses[responses.length - 1];
        call += 1;
        return {
          content: [
            {
              type: "tool_use",
              id: "toolu_test",
              name: "submit_job_listings",
              input: entry.input,
            },
          ],
          usage: entry.usage ?? { input_tokens: 100, output_tokens: 200 },
        };
      }),
    },
  };
}

describe("AnthropicClaudeClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("parses successful tool_use response", async () => {
    const sdk = createMockSdk([{ input: { jobs: loadValidJobs() } }]);
    const client = new AnthropicClaudeClient({
      apiKey: "test-key",
      circuitBreaker: new CircuitBreaker(),
    });
    (client as unknown as { client: unknown }).client = sdk;

    const result = await client.generateJobListings(sampleFilters);
    expect(result.jobs).toHaveLength(6);
    expect(result.metrics.inputTokens).toBe(100);
    expect(result.metrics.cacheHit).toBe(false);
  });

  it("retries on validation failure then succeeds", async () => {
    const sdk = createMockSdk([
      { input: { jobs: loadValidJobs().slice(0, 2) } },
      { input: { jobs: loadValidJobs() } },
    ]);
    const client = new AnthropicClaudeClient({
      apiKey: "test-key",
      circuitBreaker: new CircuitBreaker(),
    });
    (client as unknown as { client: unknown }).client = sdk;

    const result = await client.generateJobListings(sampleFilters);
    expect(result.jobs).toHaveLength(6);
    expect(sdk.messages.create).toHaveBeenCalledTimes(2);
  });

  it("throws ClaudeValidationError after retries exhausted", async () => {
    const sdk = createMockSdk([
      { input: { jobs: loadValidJobs().slice(0, 1) } },
      { input: { jobs: loadValidJobs().slice(0, 1) } },
      { input: { jobs: loadValidJobs().slice(0, 1) } },
    ]);
    const client = new AnthropicClaudeClient({
      apiKey: "test-key",
      circuitBreaker: new CircuitBreaker(),
    });
    (client as unknown as { client: unknown }).client = sdk;

    await expect(client.generateJobListings(sampleFilters)).rejects.toThrow(
      ClaudeValidationError,
    );
    expect(sdk.messages.create).toHaveBeenCalledTimes(3);
  });

  it("throws ClaudeTimeoutError when request aborts", async () => {
    const sdk = {
      messages: {
        create: vi.fn().mockRejectedValue(
          Object.assign(new Error("aborted"), { name: "AbortError" }),
        ),
      },
    };
    const client = new AnthropicClaudeClient({
      apiKey: "test-key",
      circuitBreaker: new CircuitBreaker(),
    });
    (client as unknown as { client: unknown }).client = sdk;

    await expect(client.generateJobListings(sampleFilters)).rejects.toThrow(
      ClaudeTimeoutError,
    );
  });

  it("throws CircuitOpenError when breaker is open", async () => {
    const breaker = new CircuitBreaker();
    for (let i = 0; i < 5; i++) {
      breaker.recordFailure();
    }
    const client = new AnthropicClaudeClient({
      apiKey: "test-key",
      circuitBreaker: breaker,
    });

    await expect(client.generateJobListings(sampleFilters)).rejects.toThrow(
      CircuitOpenError,
    );
  });
});

describe("AnthropicClaudeClient integration", () => {
  it.skipIf(!process.env.ANTHROPIC_API_KEY)(
    "calls real Claude API and returns valid schema",
    async () => {
      const client = new AnthropicClaudeClient({
        apiKey: process.env.ANTHROPIC_API_KEY!,
        circuitBreaker: new CircuitBreaker(),
      });
      const result = await client.generateJobListings(sampleFilters);
      expect(result.jobs).toHaveLength(6);
    },
    30_000,
  );
});
