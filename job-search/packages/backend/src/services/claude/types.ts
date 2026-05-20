import type {
  ClaudeToolUseResponse,
  SearchRequest,
} from "@job-search/shared";

export interface ClaudeRequestMetrics {
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  cacheHit: boolean;
  estimatedCostUsd: number;
}

export interface ClaudeGenerateResult {
  jobs: ClaudeToolUseResponse;
  metrics: ClaudeRequestMetrics;
}

export interface ClaudeClient {
  generateJobListings(filters: SearchRequest): Promise<ClaudeGenerateResult>;
}
