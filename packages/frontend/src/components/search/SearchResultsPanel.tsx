import type { SearchResponse } from "@job-search/shared";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { JobList } from "../job/JobList.js";

export type SearchResultsStatus = "idle" | "loading" | "success" | "error";

export interface SearchResultsPanelProps {
  status: SearchResultsStatus;
  data: SearchResponse | null;
  error: string | null;
}

export function SearchResultsPanel({
  status,
  data,
  error,
}: SearchResultsPanelProps) {
  if (status === "loading") {
    return (
      <Box
        role="status"
        aria-live="polite"
        aria-busy="true"
        sx={{ display: "flex", justifyContent: "center", py: 6 }}
      >
        <CircularProgress aria-label="Loading search results" />
      </Box>
    );
  }

  if (status === "error" && error) {
    return (
      <Alert severity="error" role="alert">
        {error}
      </Alert>
    );
  }

  if (status === "success" && data) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {data.jobs.length} roles found
        </Typography>
        <JobList jobs={data.jobs} />
      </Box>
    );
  }

  return (
    <Typography variant="body2" color="text.secondary">
      Configure your filters and click Search to see matching roles.
    </Typography>
  );
}
