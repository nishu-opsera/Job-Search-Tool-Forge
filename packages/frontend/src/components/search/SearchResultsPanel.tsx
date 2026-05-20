import type { SearchResponse } from "@job-search/shared";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { JobList } from "../job/JobList.js";
import { RateLimitAlert } from "./RateLimitAlert.js";

export type SearchResultsStatus =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "rate_limited";

export interface SearchResultsPanelProps {
  status: SearchResultsStatus;
  data: SearchResponse | null;
  error: string | null;
  rateLimitSecondsRemaining?: number;
  onRetry?: () => void;
}

function SearchSkeletons() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: 2,
      }}
      aria-hidden
    >
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          height={280}
          animation="wave"
        />
      ))}
    </Box>
  );
}

export function SearchResultsPanel({
  status,
  data,
  error,
  rateLimitSecondsRemaining = 0,
  onRetry,
}: SearchResultsPanelProps) {
  if (status === "loading") {
    return (
      <Box role="status" aria-live="polite" aria-busy="true">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Searching for matching roles…
        </Typography>
        <SearchSkeletons />
      </Box>
    );
  }

  if (status === "rate_limited") {
    return <RateLimitAlert secondsRemaining={rateLimitSecondsRemaining} />;
  }

  if (status === "error" && error) {
    return (
      <Alert
        severity="error"
        role="alert"
        action={
          onRetry ? (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          ) : undefined
        }
      >
        {error}
      </Alert>
    );
  }

  if (status === "success" && data) {
    return <JobList jobs={data.jobs} />;
  }

  return (
    <Typography variant="body2" color="text.secondary">
      Configure your filters and click Search to see matching roles.
    </Typography>
  );
}
