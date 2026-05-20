import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  claudeToolUseResponseSchema,
  ExperienceLevel,
  jobCardSchema,
  searchRequestSchema,
  WorkType,
} from "../index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "..", "fixtures");

function loadFixture<T>(folder: "valid" | "invalid", name: string): T {
  return JSON.parse(
    readFileSync(join(fixturesDir, folder, name), "utf-8"),
  ) as T;
}

describe("searchRequestSchema", () => {
  it("accepts valid search request fixture", () => {
    const payload = loadFixture("valid", "search-request.json");
    expect(searchRequestSchema.safeParse(payload).success).toBe(true);
  });

  it("rejects invalid search request with missing fields", () => {
    const payload = loadFixture("invalid", "search-request-missing-fields.json");
    const result = searchRequestSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("rejects job title over 200 characters", () => {
    const result = searchRequestSchema.safeParse({
      jobTitle: "x".repeat(201),
      roleFunction: "Engineering",
      experienceLevel: ExperienceLevel.Senior,
      keySkills: ["TypeScript"],
      country: "US",
      workType: WorkType.Remote,
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 10 key skills", () => {
    const result = searchRequestSchema.safeParse({
      jobTitle: "Engineer",
      roleFunction: "Engineering",
      experienceLevel: ExperienceLevel.Mid,
      keySkills: Array.from({ length: 11 }, (_, i) => `skill-${i}`),
      country: "US",
      workType: WorkType.Hybrid,
    });
    expect(result.success).toBe(false);
  });
});

describe("jobCardSchema", () => {
  it("accepts valid job card fixture", () => {
    const payload = loadFixture("valid", "job-card.json");
    expect(jobCardSchema.safeParse(payload).success).toBe(true);
  });

  it("rejects invalid job card with out-of-range match score", () => {
    const payload = loadFixture("invalid", "job-card-bad-score.json");
    const result = jobCardSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const matchScoreIssue = result.error.issues.find((issue) =>
        issue.path.includes("matchScore"),
      );
      expect(matchScoreIssue).toBeDefined();
    }
  });

  it("rejects fewer than 3 skill tags", () => {
    const base = loadFixture<Record<string, unknown>>("valid", "job-card.json");
    const result = jobCardSchema.safeParse({
      ...base,
      skillTags: ["TypeScript", "React"],
    });
    expect(result.success).toBe(false);
  });
});

describe("claudeToolUseResponseSchema", () => {
  it("accepts exactly six job cards", () => {
    const payload = loadFixture("valid", "claude-response.json");
    expect(claudeToolUseResponseSchema.safeParse(payload).success).toBe(true);
  });

  it("rejects fewer than six job cards", () => {
    const payload = loadFixture<unknown[]>("valid", "claude-response.json").slice(
      0,
      5,
    );
    const result = claudeToolUseResponseSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("6");
    }
  });
});

describe("enum exports", () => {
  it("exports ExperienceLevel and WorkType values", () => {
    expect(ExperienceLevel.Senior).toBe("Senior");
    expect(WorkType.Remote).toBe("Remote");
  });
});
