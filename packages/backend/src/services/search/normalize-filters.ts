import type { SearchRequest } from "@job-search/shared";

/** Normalize filter values for consistent cache keys (WO-006). */
export function normalizeFilters(filters: SearchRequest): SearchRequest {
  return {
    jobTitle: filters.jobTitle.trim(),
    roleFunction: filters.roleFunction.trim(),
    experienceLevel: filters.experienceLevel,
    keySkills: filters.keySkills
      .map((skill) => skill.trim().toLowerCase())
      .filter(Boolean)
      .sort(),
    country: filters.country.trim(),
    workType: filters.workType,
  };
}
