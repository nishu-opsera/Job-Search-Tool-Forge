import { describe, expect, it } from "vitest";
import { ExperienceLevel, WorkType } from "@job-search/shared";
import { normalizeFilters } from "./normalize-filters.js";

describe("normalizeFilters", () => {
  it("trims strings and normalizes skill casing", () => {
    const result = normalizeFilters({
      jobTitle: "  Engineer  ",
      roleFunction: " Engineering ",
      experienceLevel: ExperienceLevel.Mid,
      keySkills: [" TypeScript ", "REACT"],
      country: " US ",
      workType: WorkType.Hybrid,
    });
    expect(result.jobTitle).toBe("Engineer");
    expect(result.keySkills).toEqual(["react", "typescript"]);
  });
});
