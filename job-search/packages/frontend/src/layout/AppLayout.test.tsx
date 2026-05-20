import { ThemeProvider } from "@mui/material";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { SEARCH_DISCLAIMER } from "@job-search/shared";
import { appTheme } from "../theme/appTheme.js";
import { AppLayout } from "./AppLayout.js";

function renderLayout() {
  return render(
    <ThemeProvider theme={appTheme}>
      <AppLayout />
    </ThemeProvider>,
  );
}

describe("AppLayout", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders header, main landmarks, and footer disclaimer", () => {
    renderLayout();
    expect(
      screen.getByRole("heading", { name: /job search tool/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      SEARCH_DISCLAIMER,
    );
  });

  it("includes skip to content link", () => {
    renderLayout();
    const skipLinks = screen.getAllByRole("link", {
      name: /skip to main content/i,
    });
    expect(skipLinks[0]).toHaveAttribute("href", "#main-content");
  });

  it("has no critical axe violations on the shell", async () => {
    const { container } = renderLayout();
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
