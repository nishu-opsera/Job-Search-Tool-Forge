import type { JobCard as JobCardType } from "@job-search/shared";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { JobCard } from "./JobCard.js";
import { sortJobs, type JobSortOption } from "./sort-jobs.js";

export interface JobListProps {
  jobs: JobCardType[];
  sort?: JobSortOption;
}

export function JobList({ jobs, sort = "best_match" }: JobListProps) {
  const sortedJobs = useMemo(() => sortJobs(jobs, sort), [jobs, sort]);

  if (sortedJobs.length === 0) {
    return null;
  }

  const countLabel =
    sortedJobs.length === 1 ? "1 job found" : `${sortedJobs.length} jobs found`;

  return (
    <Box>
      <Typography variant="h2" component="h2" sx={{ fontSize: "1rem", mb: 2 }}>
        {countLabel}
      </Typography>
      <Box
        component="ul"
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
        aria-label="Job listings"
      >
        {sortedJobs.map((job) => (
          <Box component="li" key={job.id}>
            <JobCard job={job} />
          </Box>
        ))}
      </Box>
      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {countLabel}
      </Box>
    </Box>
  );
}
