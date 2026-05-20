import type { SearchRequest, SearchResponse } from "@job-search/shared";
import { useCallback, useState } from "react";
import { postSearch, SearchClientError } from "../api/search-client.js";
import type { SearchResultsStatus } from "../components/search/SearchResultsPanel.js";

export function useJobSearch() {
  const [status, setStatus] = useState<SearchResultsStatus>("idle");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (request: SearchRequest) => {
    setStatus("loading");
    setError(null);
    setData(null);

    try {
      const response = await postSearch(request);
      setData(response);
      setStatus("success");
    } catch (err) {
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

  return { status, data, error, search };
}
