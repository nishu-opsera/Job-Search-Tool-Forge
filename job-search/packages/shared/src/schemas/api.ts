import { z } from "zod";
import { jobCardSchema } from "./job-card.js";
import { searchRequestSchema } from "./search-request.js";

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export const SEARCH_DISCLAIMER =
  "Listings are AI-generated for illustrative purposes and do not represent real openings.";

export const searchResponseSchema = z.object({
  jobs: z.array(jobCardSchema).length(6),
  disclaimer: z.string(),
  requestId: z.string().uuid().optional(),
  cached: z.boolean().optional(),
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;

export const searchApiRequestSchema = searchRequestSchema;

export type SearchApiRequest = z.infer<typeof searchApiRequestSchema>;
