import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TimelineNode } from "./timeline-node";

describe("TimelineNode", () => {
  it("applies the node-active class when active", () => {
    render(<TimelineNode active variant="desktop" label="Embrace" />);
    const node = screen.getByLabelText("Embrace milestone");
    expect(node.className).toContain("node-active");
  });

  it("omits the node-active class when not active", () => {
    render(<TimelineNode active={false} variant="desktop" label="Other" />);
    const node = screen.getByLabelText("Other milestone");
    expect(node.className).not.toContain("node-active");
  });

  it("uses the mobile variant sizing when variant=mobile", () => {
    render(<TimelineNode active variant="mobile" label="m" />);
    const node = screen.getByLabelText("m milestone");
    expect(node.className).toContain("w-5");
    expect(node.className).toContain("h-5");
  });

  it("uses the desktop variant sizing when variant=desktop", () => {
    render(<TimelineNode active variant="desktop" label="d" />);
    const node = screen.getByLabelText("d milestone");
    expect(node.className).toContain("w-6");
    expect(node.className).toContain("h-6");
  });
});
