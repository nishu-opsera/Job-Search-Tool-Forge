export class ClaudeValidationError extends Error {
  readonly name = "ClaudeValidationError";

  constructor(
    message: string,
    readonly validationIssues: string[],
  ) {
    super(message);
  }
}

export class ClaudeTimeoutError extends Error {
  readonly name = "ClaudeTimeoutError";

  constructor(message = "Claude API request timed out after 6 seconds") {
    super(message);
  }
}

export class CircuitOpenError extends Error {
  readonly name = "CircuitOpenError";

  constructor(
    message = "Claude circuit breaker is open due to consecutive failures",
  ) {
    super(message);
  }
}
