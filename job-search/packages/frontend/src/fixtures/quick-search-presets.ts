import type { QuickSearchChip } from "@job-search/shared";
import { ExperienceLevel, WorkType } from "@job-search/shared";

/** Local quick-search presets (WO-019); replace with GET /api/presets when backend exists. */
export const QUICK_SEARCH_PRESETS: QuickSearchChip[] = [
  {
    id: "us-engineer",
    label: "US Engineer",
    filters: {
      jobTitle: "Software Engineer",
      roleFunction: "Engineering",
      experienceLevel: ExperienceLevel.Senior,
      keySkills: ["TypeScript", "React"],
      country: "United States",
      workType: WorkType.Remote,
    },
  },
  {
    id: "remote-data",
    label: "Remote Data Scientist",
    filters: {
      jobTitle: "Data Scientist",
      roleFunction: "Data",
      experienceLevel: ExperienceLevel.Mid,
      keySkills: ["Python", "SQL", "Machine Learning"],
      country: "United States",
      workType: WorkType.Remote,
    },
  },
  {
    id: "uk-product",
    label: "UK Product Manager",
    filters: {
      jobTitle: "Product Manager",
      roleFunction: "Product",
      experienceLevel: ExperienceLevel.Senior,
      keySkills: ["Agile", "Product Strategy"],
      country: "United Kingdom",
      workType: WorkType.Hybrid,
    },
  },
];
