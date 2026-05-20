import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import {
  JOB_SORT_LABELS,
  type JobSortOption,
} from "../job/sort-jobs.js";

export interface SortControlProps {
  value: JobSortOption;
  onChange: (value: JobSortOption) => void;
}

export function SortControl({ value, onChange }: SortControlProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        component="span"
        variant="body2"
        color="text.secondary"
        sx={{ mr: 1 }}
      >
        Sort by:
      </Typography>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={value}
        aria-label="Sort job results"
        onChange={(_event, next: JobSortOption | null) => {
          if (next) {
            onChange(next);
          }
        }}
      >
        {(Object.keys(JOB_SORT_LABELS) as JobSortOption[]).map((option) => (
          <ToggleButton key={option} value={option} aria-label={JOB_SORT_LABELS[option]}>
            {JOB_SORT_LABELS[option]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
