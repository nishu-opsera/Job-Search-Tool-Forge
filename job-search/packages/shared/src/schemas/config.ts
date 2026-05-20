import { z } from "zod";
import { experienceLevelSchema, workTypeSchema } from "../enums.js";

export const quickSearchChipSchema = z.object({
  id: z.string(),
  label: z.string(),
  filters: z.object({
    jobTitle: z.string().optional(),
    roleFunction: z.string().optional(),
    experienceLevel: experienceLevelSchema.optional(),
    keySkills: z.array(z.string()).optional(),
    country: z.string().optional(),
    workType: workTypeSchema.optional(),
  }),
});

export type QuickSearchChip = z.infer<typeof quickSearchChipSchema>;

export const matchScoreWeightsSchema = z.object({
  titleMatch: z.number().min(0).max(1),
  skillsMatch: z.number().min(0).max(1),
  experienceMatch: z.number().min(0).max(1),
  locationMatch: z.number().min(0).max(1),
});

export type MatchScoreWeights = z.infer<typeof matchScoreWeightsSchema>;
