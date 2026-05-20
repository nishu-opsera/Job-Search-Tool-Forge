import {
  ExperienceLevel,
  WorkType,
  type SearchRequest,
} from "@job-search/shared";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  COUNTRY_OPTIONS,
  JOB_TITLE_SUGGESTIONS,
  ROLE_FUNCTION_SUGGESTIONS,
  SKILL_SUGGESTIONS,
} from "../fixtures/filter-suggestions.js";
import { DebouncedAutocomplete } from "./DebouncedAutocomplete.js";
import { useSearchFilters } from "./SearchFiltersContext.js";
import { toSearchRequest, type SearchFiltersState } from "./types.js";

const TOUCH_TARGET_SX = { minHeight: 44 };

const EXPERIENCE_OPTIONS = Object.values(ExperienceLevel);
const WORK_TYPE_OPTIONS = Object.values(WorkType);

export interface SearchFiltersProps {
  onSearch?: (request: SearchRequest) => void;
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const { filters, updateFilter, clearFilters } = useSearchFilters();

  const handleSearch = () => {
    const result = toSearchRequest(filters);
    if (result.success) {
      onSearch?.(result.data);
    }
  };

  const canSearch = toSearchRequest(filters).success;

  return (
    <Stack spacing={2} component="form" aria-label="Search filters form">
      <DebouncedAutocomplete
        id="filter-job-title"
        label="Job Title"
        options={JOB_TITLE_SUGGESTIONS}
        value={filters.jobTitle}
        onChange={(value) => updateFilter("jobTitle", value)}
      />
      <DebouncedAutocomplete
        id="filter-role-function"
        label="Role / Function"
        options={ROLE_FUNCTION_SUGGESTIONS}
        value={filters.roleFunction}
        onChange={(value) => updateFilter("roleFunction", value)}
      />
      <FormControl fullWidth sx={TOUCH_TARGET_SX}>
        <InputLabel id="filter-experience-label">Experience Level</InputLabel>
        <Select
          labelId="filter-experience-label"
          id="filter-experience"
          label="Experience Level"
          value={filters.experienceLevel}
          onChange={(e) =>
            updateFilter(
              "experienceLevel",
              e.target.value as SearchFiltersState["experienceLevel"],
            )
          }
        >
          <MenuItem value="">
            <em>Select level</em>
          </MenuItem>
          {EXPERIENCE_OPTIONS.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Autocomplete
        id="filter-key-skills"
        multiple
        freeSolo
        options={[...SKILL_SUGGESTIONS]}
        value={filters.keySkills}
        onChange={(_event, value) =>
          updateFilter(
            "keySkills",
            value.map((item) => (typeof item === "string" ? item : item)),
          )
        }
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip key={key} label={option} {...tagProps} />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Key Skills"
            placeholder="Add a skill and press Enter"
            sx={TOUCH_TARGET_SX}
          />
        )}
      />
      <DebouncedAutocomplete
        id="filter-country"
        label="Country"
        options={COUNTRY_OPTIONS}
        value={filters.country}
        onChange={(value) => updateFilter("country", value)}
      />
      <FormControl fullWidth sx={TOUCH_TARGET_SX}>
        <InputLabel id="filter-work-type-label">Work Type</InputLabel>
        <Select
          labelId="filter-work-type-label"
          id="filter-work-type"
          label="Work Type"
          value={filters.workType}
          onChange={(e) =>
            updateFilter(
              "workType",
              e.target.value as SearchFiltersState["workType"],
            )
          }
        >
          <MenuItem value="">
            <em>Select work type</em>
          </MenuItem>
          {WORK_TYPE_OPTIONS.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 1 }}>
        <Button
          type="button"
          variant="contained"
          disabled={!canSearch}
          onClick={handleSearch}
          sx={{ minHeight: 44 }}
        >
          Search
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={clearFilters}
          sx={{ minHeight: 44 }}
        >
          Clear All
        </Button>
      </Box>
    </Stack>
  );
}
