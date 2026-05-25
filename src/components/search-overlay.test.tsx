import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SearchOverlay } from "./search-overlay";

const noopShow = () => {};
const noopClose = () => {};

beforeEach(() => {
  // Stub scrollIntoView used after a result is selected.
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SearchOverlay", () => {
  it("is hidden when `open` is false", () => {
    render(<SearchOverlay open={false} onClose={noopClose} onSelect={noopShow} />);
    expect(screen.queryByRole("dialog", { hidden: true })?.hasAttribute("open")).toBe(false);
  });

  it("shows every populated lesson initially and filters as the user types", async () => {
    const user = userEvent.setup();
    render(<SearchOverlay open onClose={noopClose} onSelect={noopShow} />);

    const initial = screen.getAllByRole("option");
    expect(initial.length).toBeGreaterThanOrEqual(1);

    const input = screen.getByRole("searchbox", { name: /search lessons/i });
    await user.type(input, "autocomp");
    const filtered = screen.getAllByRole("option");
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.textContent).toContain("Code autocompletion");
  });

  it("shows a 'no results' message when nothing matches", async () => {
    const user = userEvent.setup();
    render(<SearchOverlay open onClose={noopClose} onSelect={noopShow} />);
    await user.type(screen.getByRole("searchbox"), "zzzzzzzzzz");
    expect(screen.queryByRole("option")).toBeNull();
    expect(screen.getByText(/no lessons match/i)).toBeInTheDocument();
  });

  it("invokes onSelect + onClose when a result is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<SearchOverlay open onClose={onClose} onSelect={onSelect} />);
    await user.type(screen.getByRole("searchbox"), "agentic");
    const result = screen.getByRole("option");
    await user.click(result);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]?.[0].title).toBe("Agentic AI");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("supports ArrowDown / ArrowUp / Enter keyboard navigation", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<SearchOverlay open onClose={noopClose} onSelect={onSelect} />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "2022");
    // Two lessons share 2022; the first is Image generation.
    const firstActive = screen.getByRole("option", { selected: true });
    expect(firstActive.textContent).toContain("Image generation");

    await user.keyboard("{ArrowDown}");
    const newActive = screen.getByRole("option", { selected: true });
    expect(newActive.textContent).toContain("Conversational AI");

    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("option", { selected: true }).textContent).toContain(
      "Image generation",
    );

    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]?.[0].title).toBe("Image generation");
  });

  it("closes the overlay when ESC is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<SearchOverlay open onClose={onClose} onSelect={noopShow} />);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does nothing on Enter when there are no results", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<SearchOverlay open onClose={noopClose} onSelect={onSelect} />);
    await user.type(screen.getByRole("searchbox"), "zzzzz");
    await user.keyboard("{Enter}");
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("clears the query each time it re-opens", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <SearchOverlay open onClose={noopClose} onSelect={noopShow} />,
    );
    await user.type(screen.getByRole("searchbox"), "rest");
    rerender(<SearchOverlay open={false} onClose={noopClose} onSelect={noopShow} />);
    rerender(<SearchOverlay open onClose={noopClose} onSelect={noopShow} />);
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
  });

  it("renders the matched date alongside the title in each option", () => {
    render(<SearchOverlay open onClose={noopClose} onSelect={noopShow} />);
    const first = screen.getAllByRole("option")[0]!;
    expect(within(first).getByText("June, 2021")).toBeInTheDocument();
    expect(within(first).getByText("Code autocompletion")).toBeInTheDocument();
  });

  it("ignores keyboard navigation on empty result lists", async () => {
    const user = userEvent.setup();
    render(<SearchOverlay open onClose={noopClose} onSelect={noopShow} />);
    await user.type(screen.getByRole("searchbox"), "zzzzz");
    // Should not throw, and no option becomes selected.
    await user.keyboard("{ArrowDown}{ArrowUp}");
    expect(screen.queryByRole("option", { selected: true })).toBeNull();
  });

  it("wraps focus when arrowing past the first / last result", async () => {
    const user = userEvent.setup();
    render(<SearchOverlay open onClose={noopClose} onSelect={noopShow} />);
    await user.type(screen.getByRole("searchbox"), "2022"); // 2 results
    // Arrow up from index 0 -> last (index 1).
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("option", { selected: true }).textContent).toContain(
      "Conversational AI",
    );
    // Arrow down once -> wraps to index 0.
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { selected: true }).textContent).toContain(
      "Image generation",
    );
  });

  it("calls onClose when the backdrop (dialog itself) is clicked", async () => {
    const onClose = vi.fn();
    render(<SearchOverlay open onClose={onClose} onSelect={noopShow} />);
    const dialog = screen.getByRole("dialog");
    act(() => {
      dialog.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does NOT close when a click lands inside the panel", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<SearchOverlay open onClose={onClose} onSelect={noopShow} />);
    // Clicking the input field bubbles up through the panel div which calls
    // stopPropagation - the dialog click handler must not fire.
    await user.click(screen.getByRole("searchbox"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
