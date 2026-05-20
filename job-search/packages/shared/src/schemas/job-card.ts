import { z } from "zod";
import { workArrangementSchema } from "../enums.js";

const MAX_DESCRIPTION_WORDS = 150;

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export const jobCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  companyName: z.string().min(1),
  salaryMin: z.number().nonnegative(),
  salaryMax: z.number().nonnegative(),
  salaryCurrency: z.string().length(3),
  description: z
    .string()
    .min(1)
    .refine(
      (value) => wordCount(value) <= MAX_DESCRIPTION_WORDS,
      `Description must be at most ${MAX_DESCRIPTION_WORDS} words`,
    ),
  skillTags: z.array(z.string().min(1)).min(3).max(8),
  matchScore: z.number().int().min(75).max(99),
  isFeatured: z.boolean(),
  workArrangement: workArrangementSchema,
  postedDate: z.string().datetime(),
  country: z.string().min(1),
});

export type JobCard = z.infer<typeof jobCardSchema>;
