import type { JobCard } from "./schemas/job-card.js";

/** Minimal valid job card for demos and health-check samples. */
export const sampleJobCard: JobCard = {
  id: "sample-1",
  title: "Software Engineer",
  companyName: "Acme Corp",
  salaryMin: 100000,
  salaryMax: 140000,
  salaryCurrency: "USD",
  description: "Build products with TypeScript, React, and Node.js.",
  skillTags: ["TypeScript", "React", "Node.js"],
  matchScore: 88,
  isFeatured: false,
  workArrangement: "remote",
  postedDate: new Date().toISOString(),
  country: "United States",
};
