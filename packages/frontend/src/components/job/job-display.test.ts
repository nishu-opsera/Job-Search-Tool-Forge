import { describe, expect, it } from "vitest";
import {
  formatSalaryRange,
  sortJobsFeaturedFirst,
} from "./job-display.js";
import { featuredJobCard, standardJobCard } from "../../fixtures/job-cards.js";

describe("job-display", () => {
  it("formats compact salary range with currency", () => {
    expect(formatSalaryRange(80000, 120000, "USD")).toMatch(/\$80K.*\$120K.*USD/i);
  });

  it("returns salary not specified for zero range", () => {
    expect(formatSalaryRange(0, 0, "USD")).toBe("Salary not specified");
  });

  it("sorts featured jobs first", () => {
    const sorted = sortJobsFeaturedFirst([standardJobCard, featuredJobCard]);
    expect(sorted[0]?.id).toBe(featuredJobCard.id);
  });
});
