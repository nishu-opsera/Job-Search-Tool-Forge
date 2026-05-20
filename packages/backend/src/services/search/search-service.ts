import {
  SEARCH_DISCLAIMER,
  searchRequestSchema,
  type SearchResponse,
} from "@job-search/shared";
import { randomUUID } from "node:crypto";
import type { ZodIssue } from "zod";
import type { ClaudeClient } from "../claude/types.js";
import { normalizeFilters } from "./normalize-filters.js";

export interface SearchServiceDeps {
  claudeClient: ClaudeClient;
}

export interface SearchResult {
  response: SearchResponse;
  filterSummary: string;
}

export class SearchService {
  constructor(private readonly deps: SearchServiceDeps) {}

  async search(rawBody: unknown): Promise<SearchResult> {
    const parsed = searchRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new SearchValidationError(parsed.error.issues);
    }

    const filters = normalizeFilters(parsed.data);
    const { jobs } = await this.deps.claudeClient.generateJobListings(filters);

    const filterSummary = [
      filters.jobTitle,
      filters.roleFunction,
      filters.experienceLevel,
      filters.keySkills.join(","),
      filters.country,
      filters.workType,
    ].join("|");

    return {
      filterSummary,
      response: {
        jobs,
        disclaimer: SEARCH_DISCLAIMER,
        requestId: randomUUID(),
        cached: false,
      },
    };
  }
}

export class SearchValidationError extends Error {
  readonly name = "SearchValidationError";

  constructor(readonly issues: ZodIssue[]) {
    super("Search request validation failed");
  }
}
