import { z } from "zod";
import { experienceLevelSchema, workTypeSchema } from "../enums.js";

export const searchRequestSchema = z.object({
  jobTitle: z.string().min(1).max(200),
  roleFunction: z.string().min(1),
  experienceLevel: experienceLevelSchema,
  keySkills: z.array(z.string().min(1)).min(1).max(10),
  country: z.string().min(1),
  workType: workTypeSchema,
});

export type SearchRequest = z.infer<typeof searchRequestSchema>;
