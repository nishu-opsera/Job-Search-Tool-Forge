import { ThemeProvider } from "@mui/material";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { appTheme } from "../../theme/appTheme.js";
import {
  edgeCaseJobCard,
  featuredJobCard,
  standardJobCard,
} from "../../fixtures/job-cards.js";
import { JobCard } from "./JobCard.js";

function renderCard(job: typeof featuredJobCard) {
  return render(
    <ThemeProvider theme={appTheme}>
      <JobCard job={job} />
    </ThemeProvider>,
  );
}

describe("JobCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders featured card with badge and circular match score", () => {
    renderCard(featuredJobCard);
    expect(screen.getByRole("heading", { name: featuredJobCard.title })).toBeInTheDocument();
    expect(screen.getByLabelText("Featured listing")).toBeInTheDocument();
    expect(
      screen.getByLabelText(`Match score ${featuredJobCard.matchScore} percent`),
    ).toBeInTheDocument();
    expect(screen.getByText(/posted/i)).toBeInTheDocument();
  });

  it("renders non-featured card without featured badge", () => {
    renderCard(standardJobCard);
    expect(screen.queryByLabelText("Featured listing")).not.toBeInTheDocument();
    expect(screen.getByText(standardJobCard.companyName)).toBeInTheDocument();
  });

  it("shows salary not specified when salary range is zero", () => {
    renderCard(edgeCaseJobCard);
    expect(screen.getByText(/salary not specified/i)).toBeInTheDocument();
  });

  it("renders all skill tags", () => {
    renderCard(standardJobCard);
    for (const skill of standardJobCard.skillTags) {
      expect(screen.getByText(skill)).toBeInTheDocument();
    }
  });

  it("has no critical axe violations", async () => {
    const { container } = renderCard(featuredJobCard);
    const results = await axe(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    const serious = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(serious).toHaveLength(0);
  });
});
