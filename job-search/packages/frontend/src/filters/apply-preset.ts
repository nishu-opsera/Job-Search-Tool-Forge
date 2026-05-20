import type { QuickSearchChip } from "@job-search/shared";
import { defaultSearchFilters, type SearchFiltersState } from "./types.js";

export function filtersFromPreset(
  preset: QuickSearchChip["filters"],
): SearchFiltersState {
  return {
    jobTitle: preset.jobTitle ?? defaultSearchFilters.jobTitle,
    roleFunction: preset.roleFunction ?? defaultSearchFilters.roleFunction,
    experienceLevel:
      preset.experienceLevel ?? defaultSearchFilters.experienceLevel,
    keySkills: preset.keySkills ?? defaultSearchFilters.keySkills,
    country: preset.country ?? defaultSearchFilters.country,
    workType: preset.workType ?? defaultSearchFilters.workType,
  };
}
