import type { JobCard as JobCardType } from "@job-search/shared";
import Box from "@mui/material/Box";
import { JobCard } from "./JobCard.js";

export interface JobListProps {
  jobs: JobCardType[];
}

export function JobList({ jobs }: JobListProps) {
  return (
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
        },
        gap: 2,
      }}
      aria-label="Job listings"
    >
      {jobs.map((job) => (
        <Box component="li" key={job.id}>
          <JobCard job={job} />
        </Box>
      ))}
    </Box>
  );
}
