import { afterEach, describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimitStore } from "./rate-limit.js";

describe("checkRateLimit", () => {
  afterEach(() => {
    resetRateLimitStore();
  });

  it("allows up to 30 requests per hour", () => {
    for (let i = 0; i < 30; i++) {
      expect(checkRateLimit("127.0.0.1").allowed).toBe(true);
    }
    const blocked = checkRateLimit("127.0.0.1");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });
});
