import type { JobCard } from "@job-search/shared";

const baseDescription =
  "Build scalable web applications with a modern TypeScript stack and collaborative engineering practices.";

export const featuredJobCard: JobCard = {
  id: "job-featured",
  title: "Senior Software Engineer",
  companyName: "Acme Corp",
  salaryMin: 120000,
  salaryMax: 160000,
  salaryCurrency: "USD",
  description: baseDescription,
  skillTags: ["TypeScript", "React", "Node.js"],
  matchScore: 92,
  isFeatured: true,
  workArrangement: "remote",
  postedDate: "2026-05-19T12:00:00.000Z",
  country: "United States",
};

export const standardJobCard: JobCard = {
  id: "job-standard",
  title: "Software Engineer",
  companyName: "Beta Labs",
  salaryMin: 90000,
  salaryMax: 120000,
  salaryCurrency: "USD",
  description: baseDescription,
  skillTags: ["JavaScript", "React", "SQL"],
  matchScore: 84,
  isFeatured: false,
  workArrangement: "hybrid",
  postedDate: "2026-05-18T09:30:00.000Z",
  country: "Canada",
};

export const edgeCaseJobCard: JobCard = {
  id: "job-edge",
  title: "Platform Engineer",
  companyName: "Gamma Systems",
  salaryMin: 0,
  salaryMax: 0,
  salaryCurrency: "USD",
  description: baseDescription,
  skillTags: ["Go", "Kubernetes", "Terraform"],
  matchScore: 78,
  isFeatured: false,
  workArrangement: "on-site",
  postedDate: "2026-05-10T16:00:00.000Z",
  country: "United Kingdom",
};
