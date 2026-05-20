/** Anthropic tool definition aligned with @job-search/shared job card schema. */
export const JOB_LISTINGS_TOOL = {
  name: "submit_job_listings",
  description:
    "Submit exactly six synthetic job listings that match the candidate search filters.",
  input_schema: {
    type: "object" as const,
    properties: {
      jobs: {
        type: "array",
        description: "Exactly six job cards",
        minItems: 6,
        maxItems: 6,
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            companyName: { type: "string" },
            salaryMin: { type: "number" },
            salaryMax: { type: "number" },
            salaryCurrency: { type: "string", description: "ISO 4217 code" },
            description: {
              type: "string",
              description: "Max 150 words",
            },
            skillTags: {
              type: "array",
              items: { type: "string" },
              minItems: 3,
              maxItems: 8,
            },
            matchScore: {
              type: "integer",
              minimum: 75,
              maximum: 99,
            },
            isFeatured: { type: "boolean" },
            workArrangement: {
              type: "string",
              enum: ["remote", "hybrid", "on-site"],
            },
            postedDate: {
              type: "string",
              description: "ISO-8601 datetime",
            },
            country: { type: "string" },
          },
          required: [
            "id",
            "title",
            "companyName",
            "salaryMin",
            "salaryMax",
            "salaryCurrency",
            "description",
            "skillTags",
            "matchScore",
            "isFeatured",
            "workArrangement",
            "postedDate",
            "country",
          ],
        },
      },
    },
    required: ["jobs"],
  },
};
