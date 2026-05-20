import { AppLayout } from "./layout/AppLayout.js";
import { SearchFilters } from "./filters/SearchFilters.js";
import { SearchFiltersProvider } from "./filters/SearchFiltersContext.js";
import { ErrorBoundary } from "./components/ErrorBoundary.js";
import { SearchResultsPanel } from "./components/search/SearchResultsPanel.js";
import { useJobSearch } from "./hooks/useJobSearch.js";
import { useRateLimitCountdown } from "./hooks/useRateLimitCountdown.js";
import { useSearchFilters } from "./filters/SearchFiltersContext.js";
import { toSearchRequest } from "./filters/types.js";

function AppContent() {
  const { status, data, error, search, rateLimitExpiresAt } = useJobSearch();
  const { secondsRemaining, isActive: isRateLimited } =
    useRateLimitCountdown(rateLimitExpiresAt);
  const { filters } = useSearchFilters();

  const handleRetry = () => {
    const result = toSearchRequest(filters);
    if (result.success) {
      void search(result.data);
    }
  };

  return (
    <AppLayout
      filterSlot={
        <SearchFilters
          onSearch={search}
          isSearching={status === "loading"}
          isRateLimited={isRateLimited}
        />
      }
      resultsSlot={
        <ErrorBoundary title="Something went wrong loading results. Please try again.">
          <SearchResultsPanel
            status={status}
            data={data}
            error={error}
            rateLimitSecondsRemaining={secondsRemaining}
            onRetry={handleRetry}
          />
        </ErrorBoundary>
      }
    />
  );
}

export function App() {
  return (
    <SearchFiltersProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </SearchFiltersProvider>
  );
}
