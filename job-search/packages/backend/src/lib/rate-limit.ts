const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 30;

interface WindowState {
  count: number;
  windowStart: number;
}

const store = new Map<string, WindowState>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export function checkRateLimit(clientKey: string): RateLimitResult {
  const now = Date.now();
  let state = store.get(clientKey);

  if (!state || now - state.windowStart >= WINDOW_MS) {
    state = { count: 0, windowStart: now };
    store.set(clientKey, state);
  }

  if (state.count >= MAX_REQUESTS) {
    const retryAfterMs = WINDOW_MS - (now - state.windowStart);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  state.count += 1;
  return { allowed: true };
}

/** Reset in-memory store between tests. */
export function resetRateLimitStore(): void {
  store.clear();
}
