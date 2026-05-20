import type { ClaudeRequestMetrics } from "./types.js";

export function logClaudeRequest(
  metrics: ClaudeRequestMetrics,
  extra?: Record<string, unknown>,
): void {
  console.info(
    JSON.stringify({
      event: "claude_request",
      model: metrics.model,
      input_tokens: metrics.inputTokens,
      output_tokens: metrics.outputTokens,
      latency_ms: metrics.latencyMs,
      cache_hit: metrics.cacheHit,
      estimated_cost_usd: metrics.estimatedCostUsd,
      ...extra,
    }),
  );
}
