import {
  apiErrorSchema,
  searchResponseSchema,
  type SearchRequest,
  type SearchResponse,
} from "@job-search/shared";

export class SearchClientError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "SearchClientError";
    this.status = status;
    this.code = code;
  }
}

export async function postSearch(request: SearchRequest): Promise<SearchResponse> {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const body: unknown = await response.json();

  if (!response.ok) {
    const parsedError = apiErrorSchema.safeParse(body);
    const message =
      parsedError.success
        ? parsedError.data.message
        : typeof body === "object" &&
            body !== null &&
            "message" in body &&
            typeof (body as { message: unknown }).message === "string"
          ? (body as { message: string }).message
          : "Search request failed";
    const code =
      parsedError.success
        ? parsedError.data.code
        : typeof body === "object" &&
            body !== null &&
            "error" in body &&
            typeof (body as { error: unknown }).error === "string"
          ? (body as { error: string }).error
          : undefined;
    throw new SearchClientError(message, response.status, code);
  }

  const parsed = searchResponseSchema.safeParse(body);
  if (!parsed.success) {
    throw new SearchClientError("Invalid search response from server", 502);
  }

  return parsed.data;
}

/** Alias matching WO-014 acceptance criteria naming. */
export const searchJobs = postSearch;
