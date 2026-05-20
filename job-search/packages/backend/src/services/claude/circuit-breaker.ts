import { CircuitOpenError } from "./errors.js";

const FAILURE_THRESHOLD = 5;
const FAILURE_WINDOW_MS = 60_000;
const HALF_OPEN_AFTER_MS = 30_000;

type CircuitState = "closed" | "open" | "half-open";

export class CircuitBreaker {
  private state: CircuitState = "closed";
  private failureTimestamps: number[] = [];
  private openedAt = 0;

  assertClosed(): void {
    if (this.state === "closed") {
      return;
    }

    if (this.state === "open") {
      if (Date.now() - this.openedAt >= HALF_OPEN_AFTER_MS) {
        this.state = "half-open";
        return;
      }
      throw new CircuitOpenError();
    }
  }

  recordSuccess(): void {
    this.state = "closed";
    this.failureTimestamps = [];
    this.openedAt = 0;
  }

  recordFailure(): void {
    const now = Date.now();
    this.failureTimestamps = this.failureTimestamps.filter(
      (timestamp) => now - timestamp < FAILURE_WINDOW_MS,
    );
    this.failureTimestamps.push(now);

    if (this.failureTimestamps.length >= FAILURE_THRESHOLD) {
      this.state = "open";
      this.openedAt = now;
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}
