import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultSearchFilters,
  type SearchFiltersState,
} from "./types.js";

type SearchFiltersContextValue = {
  filters: SearchFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFiltersState>>;
  updateFilter: <K extends keyof SearchFiltersState>(
    key: K,
    value: SearchFiltersState[K],
  ) => void;
  clearFilters: () => void;
};

const SearchFiltersContext = createContext<SearchFiltersContextValue | null>(
  null,
);

export function SearchFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<SearchFiltersState>(defaultSearchFilters);

  const updateFilter = useCallback(
    <K extends keyof SearchFiltersState>(key: K, value: SearchFiltersState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(defaultSearchFilters);
  }, []);

  const value = useMemo(
    () => ({ filters, setFilters, updateFilter, clearFilters }),
    [filters, updateFilter, clearFilters],
  );

  return (
    <SearchFiltersContext.Provider value={value}>
      {children}
    </SearchFiltersContext.Provider>
  );
}

export function useSearchFilters(): SearchFiltersContextValue {
  const ctx = useContext(SearchFiltersContext);
  if (!ctx) {
    throw new Error("useSearchFilters must be used within SearchFiltersProvider");
  }
  return ctx;
}
