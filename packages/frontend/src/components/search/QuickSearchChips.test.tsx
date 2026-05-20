import { ThemeProvider } from "@mui/material";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { appTheme } from "../../theme/appTheme.js";
import { QuickSearchChips } from "./QuickSearchChips.js";

describe("QuickSearchChips", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("loads presets and triggers onSelect when clicked", async () => {
    const onSelect = vi.fn();

    render(
      <ThemeProvider theme={appTheme}>
        <QuickSearchChips onSelect={onSelect} />
      </ThemeProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText("US Engineer")).toBeInTheDocument();
      },
      { timeout: 1000 },
    );

    fireEvent.click(screen.getByText("US Engineer"));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "us-engineer" }),
    );
  });
});
