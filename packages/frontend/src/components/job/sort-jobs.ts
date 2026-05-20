import type { JobCard } from "@job-search/shared";

export type JobSortOption = "best_match" | "most_recent" | "highest_salary";

export const JOB_SORT_LABELS: Record<JobSortOption, string> = {
  best_match: "Best Match",
  most_recent: "Most Recent",
  highest_salary: "Highest Salary",
};

function hasSalary(job: JobCard): boolean {
  return job.salaryMin > 0 || job.salaryMax > 0;
}

function compareWithinGroup(
  a: JobCard,
  b: JobCard,
  sort: JobSortOption,
): number {
  if (sort === "best_match") {
    return b.matchScore - a.matchScore;
  }
  if (sort === "most_recent") {
    return (
      new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    );
  }

  const aHasSalary = hasSalary(a);
  const bHasSalary = hasSalary(b);
  if (!aHasSalary && !bHasSalary) {
    return 0;
  }
  if (!aHasSalary) {
    return 1;
  }
  if (!bHasSalary) {
    return -1;
  }
  return b.salaryMax - a.salaryMax;
}

export function sortJobs(jobs: JobCard[], sort: JobSortOption): JobCard[] {
  const featured = jobs.filter((job) => job.isFeatured);
  const standard = jobs.filter((job) => !job.isFeatured);

  const sorter = (a: JobCard, b: JobCard) => compareWithinGroup(a, b, sort);

  return [...featured.sort(sorter), ...standard.sort(sorter)];
}
