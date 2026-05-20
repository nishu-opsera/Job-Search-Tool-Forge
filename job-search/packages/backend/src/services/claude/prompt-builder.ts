import type { SearchRequest } from "@job-search/shared";

const SYSTEM_PROMPT = `You generate realistic but synthetic job listings for a job search demo.
Rules:
- Return exactly six diverse listings via the submit_job_listings tool.
- Vary company size, industry, and seniority across cards.
- Listings must be tailored to the candidate's filters but are illustrative only—not real openings.
- Descriptions must stay within 150 words.
- matchScore must be an integer from 75 to 99.
- skillTags must contain 3 to 8 items.
- Use ISO-8601 datetime strings for postedDate.`;

export function buildSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export function buildUserPrompt(
  filters: SearchRequest,
  validationFeedback?: string,
): string {
  const filterSummary = [
    `Job title: ${filters.jobTitle}`,
    `Role/function: ${filters.roleFunction}`,
    `Experience level: ${filters.experienceLevel}`,
    `Key skills: ${filters.keySkills.join(", ")}`,
    `Country: ${filters.country}`,
    `Work type: ${filters.workType}`,
  ].join("\n");

  if (!validationFeedback) {
    return `Generate six tailored synthetic job listings for:\n${filterSummary}`;
  }

  return [
    `Generate six tailored synthetic job listings for:\n${filterSummary}`,
    "",
    "Your previous response failed schema validation. Fix every issue below:",
    validationFeedback,
  ].join("\n");
}
