import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary.js";

function BrokenChild(): never {
  throw new Error("Render failed");
}

function ErrorHarness() {
  const [healthy, setHealthy] = useState(false);

  return (
    <>
      <ErrorBoundary>
        {healthy ? <p>Recovered</p> : <BrokenChild />}
      </ErrorBoundary>
      <button type="button" onClick={() => setHealthy(true)}>
        Fix child
      </button>
    </>
  );
}

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <p>Healthy content</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("Healthy content")).toBeInTheDocument();
  });

  it("shows fallback UI and retries after an error", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<ErrorHarness />);

    expect(
      screen.getByText("Something went wrong. Please try again."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /fix child/i }));
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    expect(screen.getByText("Recovered")).toBeInTheDocument();
    consoleError.mockRestore();
  });
});
