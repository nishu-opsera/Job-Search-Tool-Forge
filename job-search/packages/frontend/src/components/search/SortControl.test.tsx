import { ThemeProvider } from "@mui/material";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { appTheme } from "../../theme/appTheme.js";
import { SortControl } from "./SortControl.js";

describe("SortControl", () => {
  afterEach(() => {
    cleanup();
  });

  it("calls onChange when a sort option is selected", () => {
    const onChange = vi.fn();
    render(
      <ThemeProvider theme={appTheme}>
        <SortControl value="best_match" onChange={onChange} />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /most recent/i }));
    expect(onChange).toHaveBeenCalledWith("most_recent");
  });
});
