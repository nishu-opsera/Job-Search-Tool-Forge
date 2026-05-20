import { AppLayout } from "./layout/AppLayout.js";
import { SearchFilters } from "./filters/SearchFilters.js";
import { SearchFiltersProvider } from "./filters/SearchFiltersContext.js";

export function App() {
  return (
    <SearchFiltersProvider>
      <AppLayout filterSlot={<SearchFilters />} />
    </SearchFiltersProvider>
  );
}
