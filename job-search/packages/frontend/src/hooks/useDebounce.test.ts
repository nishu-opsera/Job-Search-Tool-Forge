import { renderHook, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce.js";

describe("useDebounce", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates the debounced value after the delay", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value, delayMs }) => useDebounce(value, delayMs),
      { initialProps: { value: "a", delayMs: 300 } },
    );

    expect(result.current).toBe("a");
    rerender({ value: "ab", delayMs: 300 });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("ab");
  });
});
