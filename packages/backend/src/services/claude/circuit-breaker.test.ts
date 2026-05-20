import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CircuitBreaker } from "./circuit-breaker.js";
import { CircuitOpenError } from "./errors.js";

describe("CircuitBreaker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("opens after five failures within 60 seconds", () => {
    const breaker = new CircuitBreaker();
    for (let i = 0; i < 5; i++) {
      breaker.recordFailure();
    }
    expect(() => breaker.assertClosed()).toThrow(CircuitOpenError);
    expect(breaker.getState()).toBe("open");
  });

  it("half-opens after 30 seconds and closes on success", () => {
    const breaker = new CircuitBreaker();
    for (let i = 0; i < 5; i++) {
      breaker.recordFailure();
    }
    vi.advanceTimersByTime(30_000);
    expect(() => breaker.assertClosed()).not.toThrow();
    expect(breaker.getState()).toBe("half-open");
    breaker.recordSuccess();
    expect(breaker.getState()).toBe("closed");
  });
});
