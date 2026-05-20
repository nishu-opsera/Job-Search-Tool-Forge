import { renderHook, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useRateLimitCountdown } from "./useRateLimitCountdown.js";

describe("useRateLimitCountdown", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts down to zero and deactivates", () => {
    vi.useFakeTimers();
    const expiresAt = Date.now() + 3000;
    const { result } = renderHook(() => useRateLimitCountdown(expiresAt));

    expect(result.current.isActive).toBe(true);
    expect(result.current.secondsRemaining).toBe(3);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.secondsRemaining).toBe(2);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.isActive).toBe(false);
    expect(result.current.secondsRemaining).toBe(0);
  });
});
