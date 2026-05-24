import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const reporters: Array<(metric: unknown) => void> = [];

vi.mock("next/web-vitals", () => ({
  useReportWebVitals: (cb: (metric: unknown) => void) => {
    reporters.push(cb);
  },
}));

import { WebVitals } from "./web-vitals";

afterEach(() => {
  reporters.length = 0;
  vi.restoreAllMocks();
});

describe("WebVitals", () => {
  it("forwards every metric to console.info as a structured payload", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    render(<WebVitals />);
    const metric = {
      id: "v3-1700000000-12345",
      name: "LCP",
      value: 1234,
      rating: "good",
      delta: 1234,
    };
    expect(reporters).toHaveLength(1);
    reporters[0]?.(metric);
    expect(info).toHaveBeenCalledWith("[web-vital]", {
      name: "LCP",
      value: 1234,
      rating: "good",
      delta: 1234,
      id: "v3-1700000000-12345",
    });
  });

  it("renders nothing visible", () => {
    const { container } = render(<WebVitals />);
    expect(container.firstChild).toBeNull();
  });
});
