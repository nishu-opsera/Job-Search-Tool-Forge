import { ThemeProvider } from "@mui/material";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { sampleJobCard } from "@job-search/shared";
import { appTheme } from "../../theme/appTheme.js";
import { JobCard } from "./JobCard.js";

describe("JobCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders job details and match score", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <JobCard job={sampleJobCard} />
      </ThemeProvider>,
    );

    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: sampleJobCard.title })).toBeInTheDocument();
    expect(screen.getByText(sampleJobCard.companyName)).toBeInTheDocument();
    expect(screen.getByLabelText(/match score 88 percent/i)).toBeInTheDocument();
  });
});
