import { describe, expect, it } from "vitest";
import {
  edgeCaseJobCard,
  featuredJobCard,
  standardJobCard,
} from "../../fixtures/job-cards.js";
import { sortJobs } from "./sort-jobs.js";

const recentJob = {
  ...standardJobCard,
  id: "recent",
  postedDate: "2026-05-20T12:00:00.000Z",
  matchScore: 70,
  salaryMax: 90000,
};

const olderJob = {
  ...standardJobCard,
  id: "older",
  postedDate: "2026-05-01T12:00:00.000Z",
  matchScore: 95,
  salaryMax: 200000,
};

describe("sortJobs", () => {
  it("keeps featured jobs first for best match sort", () => {
    const sorted = sortJobs([olderJob, featuredJobCard], "best_match");
    expect(sorted[0]?.id).toBe(featuredJobCard.id);
  });

  it("sorts by most recent within groups", () => {
    const sorted = sortJobs([olderJob, recentJob], "most_recent");
    expect(sorted[0]?.id).toBe("recent");
  });

  it("sorts by highest salary and puts missing salary last", () => {
    const sorted = sortJobs(
      [edgeCaseJobCard, olderJob, recentJob],
      "highest_salary",
    );
    expect(sorted[0]?.id).toBe("older");
    expect(sorted[sorted.length - 1]?.id).toBe(edgeCaseJobCard.id);
  });
});
