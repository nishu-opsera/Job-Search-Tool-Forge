import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../hooks/useDebounce.js";

const TOUCH_TARGET_SX = { minHeight: 44 };

export interface DebouncedAutocompleteProps {
  id: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export function DebouncedAutocomplete({
  id,
  label,
  options,
  value,
  onChange,
  debounceMs = 300,
}: DebouncedAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const debouncedQuery = useDebounce(inputValue, debounceMs);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const filteredOptions = useMemo(() => {
    const query = debouncedQuery.trim().toLowerCase();
    if (!query) {
      return [...options];
    }
    return options.filter((option) =>
      option.toLowerCase().includes(query),
    );
  }, [options, debouncedQuery]);

  return (
    <Autocomplete
      id={id}
      options={filteredOptions}
      value={value || null}
      inputValue={inputValue}
      onInputChange={(_event, next, reason) => {
        setInputValue(next);
        if (reason === "input" || reason === "clear") {
          onChange(next);
        }
      }}
      onChange={(_event, next) => onChange(next ?? "")}
      freeSolo
      autoHighlight
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          sx={TOUCH_TARGET_SX}
          inputProps={{
            ...params.inputProps,
            "aria-label": label,
          }}
        />
      )}
    />
  );
}
