import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { useJobSearch } from "./useJobSearch.js";

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
    isFeatured: false,
    workArrangement: "remote",
    postedDate: "2026-05-19T12:00:00.000Z",
    country: "United States",
  })),
  disclaimer: "AI-generated listings",
};

vi.mock("../api/search-client.js", () => ({
  postSearch: vi.fn(),
  SearchClientError: class SearchClientError extends Error {
    status = 500;
  },
}));

import { postSearch } from "../api/search-client.js";

describe("useJobSearch", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sets success state when search resolves", async () => {
    vi.mocked(postSearch).mockResolvedValue(validResponse);
    const { result } = renderHook(() => useJobSearch());

    await act(async () => {
      await result.current.search({
        jobTitle: "Engineer",
        roleFunction: "Engineering",
        experienceLevel: "Senior",
        keySkills: ["TypeScript"],
        country: "US",
        workType: "Remote",
      });
    });

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });
    expect(result.current.data?.jobs).toHaveLength(6);
  });
});
