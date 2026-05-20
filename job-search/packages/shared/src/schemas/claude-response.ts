import { z } from "zod";
import { jobCardSchema } from "./job-card.js";

export const claudeToolUseResponseSchema = z
  .array(jobCardSchema)
  .length(6, "Claude tool-use response must contain exactly 6 job cards");

export type ClaudeToolUseResponse = z.infer<typeof claudeToolUseResponseSchema>;
