import { ThemeProvider } from "@mui/material";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { appTheme } from "../theme/appTheme.js";
import { SearchFilters } from "./SearchFilters.js";
import { SearchFiltersProvider, useSearchFilters } from "./SearchFiltersContext.js";
import { defaultSearchFilters } from "./types.js";

function renderFilters() {
  return render(
    <ThemeProvider theme={appTheme}>
      <SearchFiltersProvider>
        <SearchFilters />
      </SearchFiltersProvider>
    </ThemeProvider>,
  );
}

function StateReader() {
  const { filters } = useSearchFilters();
  return (
    <div data-testid="filter-state">
      {JSON.stringify(filters)}
    </div>
  );
}

describe("SearchFilters", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders all six filter fields and action buttons", () => {
    renderFilters();
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role \/ function/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/experience level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/key skills/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/work type/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /clear all/i })).toBeInTheDocument();
  });

  it("updates filter state when fields change", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <SearchFiltersProvider>
          <SearchFilters />
          <StateReader />
        </SearchFiltersProvider>
      </ThemeProvider>,
    );

    fireEvent.change(screen.getByLabelText(/job title/i), {
      target: { value: "Software Engineer" },
    });
    expect(screen.getByTestId("filter-state")).toHaveTextContent(
      "Software Engineer",
    );
  });

  it("clears all filters when Clear All is clicked", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <SearchFiltersProvider>
          <SearchFilters />
          <StateReader />
        </SearchFiltersProvider>
      </ThemeProvider>,
    );

    fireEvent.change(screen.getByLabelText(/job title/i), {
      target: { value: "Engineer" },
    });
    fireEvent.click(screen.getByRole("button", { name: /clear all/i }));
    expect(screen.getByTestId("filter-state")).toHaveTextContent(
      JSON.stringify(defaultSearchFilters),
    );
  });

  it("enables Search when all required fields are valid", () => {
    renderFilters();

    fireEvent.change(screen.getByLabelText(/job title/i), {
      target: { value: "Software Engineer" },
    });
    fireEvent.change(screen.getByLabelText(/role \/ function/i), {
      target: { value: "Engineering" },
    });
    fireEvent.mouseDown(screen.getByLabelText(/experience level/i));
    fireEvent.click(screen.getByRole("option", { name: "Senior" }));

    const skillsInput = screen.getByLabelText(/key skills/i);
    fireEvent.change(skillsInput, { target: { value: "TypeScript" } });
    fireEvent.keyDown(skillsInput, { key: "Enter", code: "Enter" });

    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: "United States" },
    });
    fireEvent.mouseDown(screen.getByLabelText(/work type/i));
    fireEvent.click(screen.getByRole("option", { name: "Remote" }));

    expect(screen.getByRole("button", { name: /^search$/i })).toBeEnabled();
  });

  it("calls onSearch with a valid request when Search is clicked", () => {
    const onSearch = vi.fn();
    render(
      <ThemeProvider theme={appTheme}>
        <SearchFiltersProvider>
          <SearchFilters onSearch={onSearch} />
        </SearchFiltersProvider>
      </ThemeProvider>,
    );

    fireEvent.change(screen.getByLabelText(/job title/i), {
      target: { value: "Software Engineer" },
    });
    fireEvent.change(screen.getByLabelText(/role \/ function/i), {
      target: { value: "Engineering" },
    });
    fireEvent.mouseDown(screen.getByLabelText(/experience level/i));
    fireEvent.click(screen.getByRole("option", { name: "Senior" }));
    const skillsInput = screen.getByLabelText(/key skills/i);
    fireEvent.change(skillsInput, { target: { value: "TypeScript" } });
    fireEvent.keyDown(skillsInput, { key: "Enter", code: "Enter" });
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: "United States" },
    });
    fireEvent.mouseDown(screen.getByLabelText(/work type/i));
    fireEvent.click(screen.getByRole("option", { name: "Remote" }));

    fireEvent.click(screen.getByRole("button", { name: /^search$/i }));
    expect(onSearch).toHaveBeenCalledWith({
      jobTitle: "Software Engineer",
      roleFunction: "Engineering",
      experienceLevel: "Senior",
      keySkills: ["TypeScript"],
      country: "United States",
      workType: "Remote",
    });
  });

  it("has no critical axe violations on the filter form", async () => {
    const { container } = renderFilters();
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });
    const serious = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(serious).toHaveLength(0);
  });
});
