import Stack from "@mui/material/Stack";
import { AppLayout } from "./layout/AppLayout.js";
import { SearchFilters } from "./filters/SearchFilters.js";
import { SearchFiltersProvider, useSearchFilters } from "./filters/SearchFiltersContext.js";
import { filtersFromPreset } from "./filters/apply-preset.js";
import { toSearchRequest } from "./filters/types.js";
import { ErrorBoundary } from "./components/ErrorBoundary.js";
import { QuickSearchChips } from "./components/search/QuickSearchChips.js";
import { SearchResultsPanel } from "./components/search/SearchResultsPanel.js";
import { useJobSearch } from "./hooks/useJobSearch.js";
import { useRateLimitCountdown } from "./hooks/useRateLimitCountdown.js";
import type { QuickSearchChip } from "@job-search/shared";

function AppContent() {
  const { status, data, error, search, refresh, rateLimitExpiresAt } =
    useJobSearch();
  const { secondsRemaining, isActive: isRateLimited } =
    useRateLimitCountdown(rateLimitExpiresAt);
  const { filters, setFilters } = useSearchFilters();

  const handleRetry = () => {
    const result = toSearchRequest(filters);
    if (result.success) {
      void search(result.data);
    }
  };

  const handleQuickSearch = (preset: QuickSearchChip) => {
    const nextFilters = filtersFromPreset(preset.filters);
    setFilters(nextFilters);
    const result = toSearchRequest(nextFilters);
    if (result.success) {
      void search(result.data);
    }
  };

  return (
    <AppLayout
      filterSlot={
        <Stack spacing={2}>
          <QuickSearchChips onSelect={handleQuickSearch} />
          <SearchFilters
            onSearch={search}
            isSearching={status === "loading"}
            isRateLimited={isRateLimited}
          />
        </Stack>
      }
      resultsSlot={
        <ErrorBoundary title="Something went wrong loading results. Please try again.">
          <SearchResultsPanel
            status={status}
            data={data}
            error={error}
            rateLimitSecondsRemaining={secondsRemaining}
            onRetry={handleRetry}
            onRefresh={() => void refresh()}
            isRefreshing={status === "loading"}
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
