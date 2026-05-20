import type { JobCard as JobCardType } from "@job-search/shared";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function formatSalary(min: number, max: number, currency: string): string {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  return `${formatter.format(min)} – ${formatter.format(max)}`;
}

function formatWorkArrangement(value: string): string {
  if (value === "on-site") {
    return "On-site";
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export interface JobCardProps {
  job: JobCardType;
}

export function JobCard({ job }: JobCardProps) {
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
          <Box>
            <Typography id={`job-title-${job.id}`} variant="h3" component="h3">
              {job.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {job.companyName}
            </Typography>
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

        <Typography variant="body2" color="text.secondary">
          {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)} ·{" "}
          {formatWorkArrangement(job.workArrangement)} · {job.country}
        </Typography>

        <Chip
          label={`${job.matchScore}% match`}
          size="small"
          color="success"
          variant="outlined"
          aria-label={`Match score ${job.matchScore} percent`}
        />

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
