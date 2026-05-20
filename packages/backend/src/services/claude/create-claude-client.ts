import { AnthropicClaudeClient } from "./anthropic-claude-client.js";
import { CircuitBreaker } from "./circuit-breaker.js";
import { MockClaudeClient } from "./mock-claude-client.js";
import type { ClaudeClient } from "./types.js";

let sharedCircuitBreaker: CircuitBreaker | undefined;

export function createClaudeClient(): ClaudeClient {
  if (process.env.MOCK_AI === "true") {
    return new MockClaudeClient();
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is required when MOCK_AI is not true. Set MOCK_AI=true for local mock responses.",
    );
  }

  if (!sharedCircuitBreaker) {
    sharedCircuitBreaker = new CircuitBreaker();
  }

  return new AnthropicClaudeClient({
    apiKey,
    model: process.env.ANTHROPIC_MODEL,
    circuitBreaker: sharedCircuitBreaker,
  });
}

/** Reset shared breaker between tests. */
export function resetClaudeClientForTests(): void {
  sharedCircuitBreaker = undefined;
}
