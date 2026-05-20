import { createHash } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { checkRateLimit } from "../lib/rate-limit.js";
import {
  CircuitOpenError,
  ClaudeTimeoutError,
  ClaudeValidationError,
} from "../services/claude/errors.js";
import type { ClaudeClient } from "../services/claude/types.js";
import {
  SearchService,
  SearchValidationError,
} from "../services/search/search-service.js";

function clientIp(request: {
  ip: string;
  headers: Record<string, string | string[] | undefined>;
}): string {
  const forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() ?? request.ip;
  }
  return request.ip;
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export interface RegisterSearchRoutesOptions {
  claudeClient: ClaudeClient;
}

export function registerSearchRoutes(
  app: FastifyInstance,
  options: RegisterSearchRoutesOptions,
): void {
  const searchService = new SearchService({ claudeClient: options.claudeClient });

  app.post("/api/search", async (request, reply) => {
    const started = Date.now();
    const ip = clientIp(request);
    const ipHash = hashIp(ip);

    const limit = checkRateLimit(ip);
    if (!limit.allowed) {
      reply.header("Retry-After", String(limit.retryAfterSeconds ?? 3600));
      logSearchRequest({
        clientIpHash: ipHash,
        statusCode: 429,
        latencyMs: Date.now() - started,
        cacheHit: false,
        filterSummary: "rate_limited",
      });
      return reply.status(429).send({
        error: "rate_limit_exceeded",
        message: "Too many search requests. Try again later.",
      });
    }

    try {
      const { response, filterSummary } = await searchService.search(
        request.body,
      );
      logSearchRequest({
        clientIpHash: ipHash,
        statusCode: 200,
        latencyMs: Date.now() - started,
        cacheHit: response.cached ?? false,
        filterSummary,
        requestId: response.requestId,
      });
      if (response.requestId) {
        reply.header("x-request-id", response.requestId);
      }
      return response;
    } catch (error) {
      return handleSearchError(error, reply, {
        clientIpHash: ipHash,
        started,
      });
    }
  });
}

function logSearchRequest(entry: {
  clientIpHash: string;
  statusCode: number;
  latencyMs: number;
  cacheHit: boolean;
  filterSummary: string;
  requestId?: string;
}): void {
  console.info(
    JSON.stringify({
      event: "search_request",
      client_ip_hash: entry.clientIpHash,
      filter_summary: entry.filterSummary,
      response_time_ms: entry.latencyMs,
      status_code: entry.statusCode,
      cache_hit: entry.cacheHit,
      request_id: entry.requestId,
    }),
  );
}

function handleSearchError(
  error: unknown,
  reply: { status: (code: number) => { send: (body: unknown) => unknown } },
  ctx: { clientIpHash: string; started: number },
): unknown {
  if (error instanceof SearchValidationError) {
    logSearchRequest({
      clientIpHash: ctx.clientIpHash,
      statusCode: 400,
      latencyMs: Date.now() - ctx.started,
      cacheHit: false,
      filterSummary: "validation_failed",
    });
    return reply.status(400).send({
      error: "validation_failed",
      message: "Invalid search request",
      issues: error.issues,
    });
  }

  if (error instanceof CircuitOpenError) {
    logSearchRequest({
      clientIpHash: ctx.clientIpHash,
      statusCode: 503,
      latencyMs: Date.now() - ctx.started,
      cacheHit: false,
      filterSummary: "circuit_open",
    });
    return reply.status(503).send({
      error: "service_unavailable",
      message: error.message,
    });
  }

  if (error instanceof ClaudeTimeoutError) {
    logSearchRequest({
      clientIpHash: ctx.clientIpHash,
      statusCode: 504,
      latencyMs: Date.now() - ctx.started,
      cacheHit: false,
      filterSummary: "claude_timeout",
    });
    return reply.status(504).send({
      error: "gateway_timeout",
      message: error.message,
    });
  }

  if (error instanceof ClaudeValidationError) {
    logSearchRequest({
      clientIpHash: ctx.clientIpHash,
      statusCode: 502,
      latencyMs: Date.now() - ctx.started,
      cacheHit: false,
      filterSummary: "claude_validation_failed",
    });
    return reply.status(502).send({
      error: "bad_gateway",
      message: error.message,
      details: error.validationIssues,
    });
  }

  logSearchRequest({
    clientIpHash: ctx.clientIpHash,
    statusCode: 500,
    latencyMs: Date.now() - ctx.started,
    cacheHit: false,
    filterSummary: "internal_error",
  });
  throw error;
}
