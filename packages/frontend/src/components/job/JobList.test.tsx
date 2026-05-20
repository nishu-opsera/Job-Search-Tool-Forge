import { ThemeProvider } from "@mui/material";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  featuredJobCard,
  standardJobCard,
} from "../../fixtures/job-cards.js";
import { appTheme } from "../../theme/appTheme.js";
import { JobList } from "./JobList.js";

describe("JobList", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders result count and featured job first", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <JobList jobs={[standardJobCard, featuredJobCard]} />
      </ThemeProvider>,
    );

    expect(screen.getByRole("heading", { name: /2 jobs found/i })).toBeInTheDocument();
    const articles = screen.getAllByRole("article");
    expect(articles[0]).toHaveAttribute(
      "aria-labelledby",
      `job-title-${featuredJobCard.id}`,
    );
  });

  it("announces result count to screen readers", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <JobList jobs={[featuredJobCard]} />
      </ThemeProvider>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("1 job found");
  });

  it("returns nothing for an empty job array", () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <JobList jobs={[]} />
      </ThemeProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
