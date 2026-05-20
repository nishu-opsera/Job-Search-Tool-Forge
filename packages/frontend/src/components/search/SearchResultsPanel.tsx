import type { SearchResponse } from "@job-search/shared";
import RefreshIcon from "@mui/icons-material/Refresh";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { JobList } from "../job/JobList.js";
import { type JobSortOption } from "../job/sort-jobs.js";
import { RateLimitAlert } from "./RateLimitAlert.js";
import { SortControl } from "./SortControl.js";

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
  onRefresh?: () => void;
  isRefreshing?: boolean;
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
  onRefresh,
  isRefreshing = false,
}: SearchResultsPanelProps) {
  const [sort, setSort] = useState<JobSortOption>("best_match");

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
    return (
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={1}
        >
          <SortControl value={sort} onChange={setSort} />
          {onRefresh ? (
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
              disabled={isRefreshing}
              sx={{ minHeight: 44, alignSelf: { sm: "flex-start" } }}
            >
              Refresh
            </Button>
          ) : null}
        </Stack>
        <JobList jobs={data.jobs} sort={sort} />
      </Stack>
    );
  }

  return (
    <Typography variant="body2" color="text.secondary">
      Configure your filters and click Search to see matching roles.
    </Typography>
  );
}
