import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { SearchRequest } from "@job-search/shared";
import { logClaudeRequest } from "./logging.js";
import type { ClaudeClient, ClaudeGenerateResult } from "./types.js";
import { validateToolInput } from "./validate-response.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadFixture(name: string): unknown {
  const path = join(__dirname, "../../../fixtures/claude", name);
  return JSON.parse(readFileSync(path, "utf-8"));
}

export interface MockClaudeClientOptions {
  fixtureName?: string;
  latencyMs?: number;
}

export class MockClaudeClient implements ClaudeClient {
  private readonly fixtureName: string;
  private readonly latencyMs: number;

  constructor(options: MockClaudeClientOptions = {}) {
    this.fixtureName = options.fixtureName ?? "valid-response.json";
    this.latencyMs = options.latencyMs ?? 50;
  }

  async generateJobListings(
    _filters: SearchRequest,
  ): Promise<ClaudeGenerateResult> {
    await new Promise((resolve) => setTimeout(resolve, this.latencyMs));

    const raw = loadFixture(this.fixtureName);
    const jobs = validateToolInput({ jobs: raw });

    const metrics = {
      model: "mock-claude",
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: this.latencyMs,
      cacheHit: false,
      estimatedCostUsd: 0,
    };

    logClaudeRequest(metrics, { mock: true, fixture: this.fixtureName });
    return { jobs, metrics };
  }
}
