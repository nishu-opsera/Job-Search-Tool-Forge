import type { JobCard as JobCardType } from "@job-search/shared";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  formatPostedDate,
  formatSalaryRange,
  formatWorkArrangement,
} from "./job-display.js";

export interface JobCardProps {
  job: JobCardType;
}

export function JobCard({ job }: JobCardProps) {
  const matchLabel = `Match score ${job.matchScore} percent`;

  return (
    <Card
      component="article"
      aria-labelledby={`job-title-${job.id}`}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: job.isFeatured ? 2 : 1,
        borderColor: job.isFeatured ? "primary.main" : "divider",
      }}
    >
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography id={`job-title-${job.id}`} variant="h3" component="h3">
              {job.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {job.companyName}
            </Typography>
          </Box>
          <Stack alignItems="center" spacing={0.5}>
            <Box
              sx={{ position: "relative", display: "inline-flex" }}
              aria-label={matchLabel}
              role="img"
            >
              <CircularProgress
                variant="determinate"
                value={job.matchScore}
                size={52}
                thickness={4}
                aria-hidden
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" component="span" fontWeight={600}>
                  {job.matchScore}
                </Typography>
              </Box>
            </Box>
            {job.isFeatured ? (
              <Chip
                icon={<StarIcon aria-hidden />}
                label="Featured"
                color="primary"
                size="small"
                aria-label="Featured listing"
              />
            ) : null}
          </Stack>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency)} ·{" "}
          {formatWorkArrangement(job.workArrangement)} · {job.country}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Posted {formatPostedDate(job.postedDate)}
        </Typography>

        <Typography variant="body2" sx={{ flex: 1 }}>
          {job.description}
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={0.5} aria-label="Required skills">
          {job.skillTags.map((skill) => (
            <Chip key={skill} label={skill} size="small" variant="outlined" />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
