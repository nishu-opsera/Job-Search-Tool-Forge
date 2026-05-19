import { z } from "zod";

export const ExperienceLevel = {
  Intern: "Intern",
  Junior: "Junior",
  Mid: "Mid",
  Senior: "Senior",
  Lead: "Lead",
  Director: "Director",
  VP: "VP",
  CSuite: "C-Suite",
} as const;

export const experienceLevelSchema = z.enum([
  ExperienceLevel.Intern,
  ExperienceLevel.Junior,
  ExperienceLevel.Mid,
  ExperienceLevel.Senior,
  ExperienceLevel.Lead,
  ExperienceLevel.Director,
  ExperienceLevel.VP,
  ExperienceLevel.CSuite,
]);

export type ExperienceLevel = z.infer<typeof experienceLevelSchema>;

export const WorkType = {
  Remote: "Remote",
  Hybrid: "Hybrid",
  OnSite: "On-Site",
} as const;

export const workTypeSchema = z.enum([
  WorkType.Remote,
  WorkType.Hybrid,
  WorkType.OnSite,
]);

export type WorkType = z.infer<typeof workTypeSchema>;

export const WorkArrangement = {
  Remote: "remote",
  Hybrid: "hybrid",
  OnSite: "on-site",
} as const;

export const workArrangementSchema = z.enum([
  WorkArrangement.Remote,
  WorkArrangement.Hybrid,
  WorkArrangement.OnSite,
]);

export type WorkArrangement = z.infer<typeof workArrangementSchema>;
