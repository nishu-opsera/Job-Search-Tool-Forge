import { describe, expect, it } from "vitest";
import { ExperienceLevel, WorkType } from "@job-search/shared";
import { MockClaudeClient } from "./mock-claude-client.js";

const sampleFilters = {
  jobTitle: "Software Engineer",
  roleFunction: "Engineering",
  experienceLevel: ExperienceLevel.Senior,
  keySkills: ["TypeScript"],
  country: "United States",
  workType: WorkType.Remote,
};

describe("MockClaudeClient", () => {
  it("returns six schema-valid job cards from valid fixture", async () => {
    const client = new MockClaudeClient({ latencyMs: 0 });
    const result = await client.generateJobListings(sampleFilters);
    expect(result.jobs).toHaveLength(6);
    expect(result.metrics.model).toBe("mock-claude");
    expect(result.metrics.estimatedCostUsd).toBe(0);
  });
});
