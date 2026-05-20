import { claudeToolUseResponseSchema } from "@job-search/shared";
import { ClaudeValidationError } from "./errors.js";

export function validateToolInput(raw: unknown): ReturnType<
  typeof claudeToolUseResponseSchema.parse
> {
  const payload =
    raw && typeof raw === "object" && "jobs" in raw
      ? (raw as { jobs: unknown }).jobs
      : raw;

  const result = claudeToolUseResponseSchema.safeParse(payload);
  if (result.success) {
    return result.data;
  }

  const issues = result.error.issues.map(
    (issue) => `${issue.path.join(".")}: ${issue.message}`,
  );
  throw new ClaudeValidationError(
    `Claude tool response failed schema validation: ${issues.join("; ")}`,
    issues,
  );
}
