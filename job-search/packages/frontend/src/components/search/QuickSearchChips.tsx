import type { QuickSearchChip } from "@job-search/shared";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { QUICK_SEARCH_PRESETS } from "../../fixtures/quick-search-presets.js";

export interface QuickSearchChipsProps {
  onSelect: (preset: QuickSearchChip) => void;
}

export function QuickSearchChips({ onSelect }: QuickSearchChipsProps) {
  const [loading, setLoading] = useState(true);
  const [presets, setPresets] = useState<QuickSearchChip[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPresets(QUICK_SEARCH_PRESETS);
      setLoading(false);
    }, 150);
    return () => window.clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Stack direction="row" spacing={1} aria-busy="true" aria-label="Loading quick searches">
        <Skeleton variant="rounded" width={120} height={32} />
        <Skeleton variant="rounded" width={160} height={32} />
        <Skeleton variant="rounded" width={140} height={32} />
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      <Typography variant="body2" color="text.secondary">
        Quick search
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1} role="list" aria-label="Quick search presets">
        {presets.map((preset) => (
          <Chip
            key={preset.id}
            component="button"
            label={preset.label}
            onClick={() => onSelect(preset)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(preset);
              }
            }}
            clickable
            variant="outlined"
            sx={{ minHeight: 44 }}
          />
        ))}
      </Stack>
    </Stack>
  );
}
