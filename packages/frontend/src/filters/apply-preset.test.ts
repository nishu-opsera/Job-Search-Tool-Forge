import { describe, expect, it } from "vitest";
import { ExperienceLevel, WorkType } from "@job-search/shared";
import { filtersFromPreset } from "./apply-preset.js";

describe("filtersFromPreset", () => {
  it("maps preset fields into filter state", () => {
    const filters = filtersFromPreset({
      jobTitle: "Engineer",
      roleFunction: "Engineering",
      experienceLevel: ExperienceLevel.Senior,
      keySkills: ["TypeScript"],
      country: "United States",
      workType: WorkType.Remote,
    });

    expect(filters.jobTitle).toBe("Engineer");
    expect(filters.experienceLevel).toBe("Senior");
    expect(filters.keySkills).toEqual(["TypeScript"]);
  });
});
