import type { SearchRequest, SearchResponse } from "@job-search/shared";
import { useCallback, useRef, useState } from "react";
import { postSearch, SearchClientError } from "../api/search-client.js";
import type { SearchResultsStatus } from "../components/search/SearchResultsPanel.js";

const DEFAULT_RATE_LIMIT_SECONDS = 3600;

export function useJobSearch() {
  const [status, setStatus] = useState<SearchResultsStatus>("idle");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitExpiresAt, setRateLimitExpiresAt] = useState<number | null>(
    null,
  );
  const lastRequestRef = useRef<SearchRequest | null>(null);

  const search = useCallback(async (request: SearchRequest) => {
    setStatus("loading");
    setError(null);
    setData(null);
    lastRequestRef.current = request;

    try {
      const response = await postSearch(request);
      setData(response);
      setStatus("success");
      setRateLimitExpiresAt(null);
    } catch (err) {
      if (err instanceof SearchClientError && err.status === 429) {
        const seconds = err.retryAfterSeconds ?? DEFAULT_RATE_LIMIT_SECONDS;
        setRateLimitExpiresAt(Date.now() + seconds * 1000);
        setError(null);
        setStatus("rate_limited");
        return;
      }

      const message =
        err instanceof SearchClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
      setError(message);
      setStatus("error");
    }
  }, []);

  const refresh = useCallback(async () => {
    if (lastRequestRef.current) {
      await search(lastRequestRef.current);
    }
  }, [search]);

  return {
    status,
    data,
    error,
    search,
    refresh,
    rateLimitExpiresAt,
  };
}
