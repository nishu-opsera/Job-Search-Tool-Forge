import { describe, expect, it, vi, afterEach } from "vitest";
import { postSearch, SearchClientError } from "./search-client.js";

const validResponse = {
  jobs: Array.from({ length: 6 }, (_, i) => ({
    id: `job-${i}`,
    title: "Engineer",
    companyName: "Acme",
    salaryMin: 100000,
    salaryMax: 140000,
    salaryCurrency: "USD",
    description: "Build software with modern tools and practices.",
    skillTags: ["TypeScript", "React", "Node.js"],
    matchScore: 80 + i,
    isFeatured: i === 0,
    workArrangement: "remote",
    postedDate: "2026-05-19T12:00:00.000Z",
    country: "United States",
  })),
  disclaimer:
    "Listings are AI-generated for illustrative purposes and do not represent real openings.",
};

describe("postSearch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns parsed search response on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => validResponse,
      }),
    );

    const result = await postSearch({
      jobTitle: "Engineer",
      roleFunction: "Engineering",
      experienceLevel: "Senior",
      keySkills: ["TypeScript"],
      country: "United States",
      workType: "Remote",
    });

    expect(result.jobs).toHaveLength(6);
    expect(result.disclaimer).toContain("AI-generated");
  });

  it("throws SearchClientError on HTTP error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({
          error: "rate_limit_exceeded",
          message: "Too many search requests. Try again later.",
        }),
      }),
    );

    await expect(
      postSearch({
        jobTitle: "Engineer",
        roleFunction: "Engineering",
        experienceLevel: "Senior",
        keySkills: ["TypeScript"],
        country: "US",
        workType: "Remote",
      }),
    ).rejects.toMatchObject({
      status: 429,
      message: "Too many search requests. Try again later.",
    });
    await expect(
      postSearch({
        jobTitle: "Engineer",
        roleFunction: "Engineering",
        experienceLevel: "Senior",
        keySkills: ["TypeScript"],
        country: "US",
        workType: "Remote",
      }),
    ).rejects.toBeInstanceOf(SearchClientError);
  });
});
