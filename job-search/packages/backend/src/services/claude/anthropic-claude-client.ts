import Anthropic from "@anthropic-ai/sdk";
import type { SearchRequest } from "@job-search/shared";
import { CircuitBreaker } from "./circuit-breaker.js";
import { estimateCostUsd } from "./cost.js";
import {
  ClaudeTimeoutError,
  ClaudeValidationError,
} from "./errors.js";
import { logClaudeRequest } from "./logging.js";
import { buildSystemPrompt, buildUserPrompt } from "./prompt-builder.js";
import { JOB_LISTINGS_TOOL } from "./tool-definition.js";
import type { ClaudeClient, ClaudeGenerateResult } from "./types.js";
import { validateToolInput } from "./validate-response.js";

const TIMEOUT_MS = 6_000;
const MAX_RETRIES = 2;

export interface AnthropicClaudeClientOptions {
  apiKey: string;
  model?: string;
  circuitBreaker?: CircuitBreaker;
}

export class AnthropicClaudeClient implements ClaudeClient {
  private readonly client: Anthropic;
  private readonly model: string;
  private readonly circuitBreaker: CircuitBreaker;

  constructor(options: AnthropicClaudeClientOptions) {
    this.client = new Anthropic({ apiKey: options.apiKey });
    this.model = options.model ?? "claude-sonnet-4-20250514";
    this.circuitBreaker = options.circuitBreaker ?? new CircuitBreaker();
  }

  async generateJobListings(
    filters: SearchRequest,
  ): Promise<ClaudeGenerateResult> {
    this.circuitBreaker.assertClosed();

    let validationFeedback: string | undefined;
    let lastValidationError: ClaudeValidationError | undefined;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const started = Date.now();
      try {
        const response = await this.callAnthropic(
          filters,
          validationFeedback,
        );
        const jobs = validateToolInput(response.toolInput);
        const metrics = this.buildMetrics(response.usage, Date.now() - started);
        this.circuitBreaker.recordSuccess();
        logClaudeRequest(metrics, { attempt, status: "success" });
        return { jobs, metrics };
      } catch (error) {
        if (error instanceof ClaudeValidationError) {
          lastValidationError = error;
          validationFeedback = error.validationIssues.join("\n");
          if (attempt < MAX_RETRIES) {
            continue;
          }
        }

        this.circuitBreaker.recordFailure();
        throw error;
      }
    }

    this.circuitBreaker.recordFailure();
    throw lastValidationError ?? new ClaudeValidationError("Validation failed", []);
  }

  private async callAnthropic(
    filters: SearchRequest,
    validationFeedback?: string,
  ): Promise<{
    toolInput: unknown;
    usage: { input_tokens: number; output_tokens: number };
  }> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await this.client.messages.create(
        {
          model: this.model,
          max_tokens: 4096,
          system: buildSystemPrompt(),
          tools: [JOB_LISTINGS_TOOL],
          tool_choice: { type: "tool", name: JOB_LISTINGS_TOOL.name },
          messages: [
            {
              role: "user",
              content: buildUserPrompt(filters, validationFeedback),
            },
          ],
        },
        { signal: controller.signal },
      );

      const toolBlock = response.content.find(
        (block) => block.type === "tool_use",
      );
      if (!toolBlock || toolBlock.type !== "tool_use") {
        throw new ClaudeValidationError(
          "Claude response did not include a tool_use block",
          ["missing tool_use block"],
        );
      }

      return {
        toolInput: toolBlock.input,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
        },
      };
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === "AbortError" || error.message.includes("aborted"))
      ) {
        throw new ClaudeTimeoutError();
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  private buildMetrics(
    usage: { input_tokens: number; output_tokens: number },
    latencyMs: number,
  ) {
    return {
      model: this.model,
      inputTokens: usage.input_tokens,
      outputTokens: usage.output_tokens,
      latencyMs,
      cacheHit: false,
      estimatedCostUsd: estimateCostUsd(
        this.model,
        usage.input_tokens,
        usage.output_tokens,
      ),
    };
  }

  getCircuitBreaker(): CircuitBreaker {
    return this.circuitBreaker;
  }
}
