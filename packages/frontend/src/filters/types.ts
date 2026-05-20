import type { ExperienceLevel, SearchRequest, WorkType } from "@job-search/shared";
import { searchRequestSchema } from "@job-search/shared";

export type SearchFiltersState = {
  jobTitle: string;
  roleFunction: string;
  experienceLevel: ExperienceLevel | "";
  keySkills: string[];
  country: string;
  workType: WorkType | "";
};

export const defaultSearchFilters: SearchFiltersState = {
  jobTitle: "",
  roleFunction: "",
  experienceLevel: "",
  keySkills: [],
  country: "",
  workType: "",
};

export function toSearchRequest(
  filters: SearchFiltersState,
): { success: true; data: SearchRequest } | { success: false } {
  const parsed = searchRequestSchema.safeParse({
    jobTitle: filters.jobTitle,
    roleFunction: filters.roleFunction,
    experienceLevel: filters.experienceLevel || undefined,
    keySkills: filters.keySkills,
    country: filters.country,
    workType: filters.workType || undefined,
  });
  if (!parsed.success) {
    return { success: false };
  }
  return { success: true, data: parsed.data };
}
