import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ClaudeValidationError } from "./errors.js";
import { validateToolInput } from "./validate-response.js";

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../fixtures/claude",
);

describe("validateToolInput", () => {
  it("accepts valid fixture wrapped as jobs", () => {
    const jobs = JSON.parse(
      readFileSync(join(fixturesDir, "valid-response.json"), "utf-8"),
    );
    const result = validateToolInput({ jobs });
    expect(result).toHaveLength(6);
  });

  it("rejects partial-invalid fixture", () => {
    const jobs = JSON.parse(
      readFileSync(join(fixturesDir, "partial-invalid-response.json"), "utf-8"),
    );
    expect(() => validateToolInput({ jobs })).toThrow(ClaudeValidationError);
  });

  it("rejects invalid fixture shape", () => {
    const payload = JSON.parse(
      readFileSync(join(fixturesDir, "invalid-response.json"), "utf-8"),
    );
    expect(() => validateToolInput(payload)).toThrow(ClaudeValidationError);
  });
});
