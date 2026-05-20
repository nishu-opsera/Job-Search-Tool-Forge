import { AppLayout } from "./layout/AppLayout.js";
import { SearchFilters } from "./filters/SearchFilters.js";
import { SearchFiltersProvider } from "./filters/SearchFiltersContext.js";
import { SearchResultsPanel } from "./components/search/SearchResultsPanel.js";
import { useJobSearch } from "./hooks/useJobSearch.js";

function AppContent() {
  const { status, data, error, search } = useJobSearch();

  return (
    <AppLayout
      filterSlot={
        <SearchFilters onSearch={search} isSearching={status === "loading"} />
      }
      resultsSlot={
        <SearchResultsPanel status={status} data={data} error={error} />
      }
    />
  );
}

export function App() {
  return (
    <SearchFiltersProvider>
      <AppContent />
    </SearchFiltersProvider>
  );
}
