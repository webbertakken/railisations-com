import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useReducedMotion } from "./use-reduced-motion";

describe("useReducedMotion", () => {
  it("returns the initial matchMedia value", () => {
    vi.spyOn(window, "matchMedia").mockImplementationOnce(
      (query) =>
        ({
          matches: true,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList,
    );

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("updates when the media query changes", () => {
    let listener: ((event: MediaQueryListEvent) => void) | undefined;
    const mql = {
      matches: false,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn((_evt: string, cb: (event: MediaQueryListEvent) => void) => {
        listener = cb;
      }),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;

    vi.spyOn(window, "matchMedia").mockReturnValue(mql);

    const { result, unmount } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      listener?.({ matches: true } as MediaQueryListEvent);
    });
    expect(result.current).toBe(true);

    unmount();
    expect((mql.removeEventListener as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1);
  });

  it("returns false when matchMedia is not available", () => {
    const original = window.matchMedia;
    // Simulate SSR-like env where matchMedia is undefined.
    Object.defineProperty(window, "matchMedia", {
      value: undefined,
      configurable: true,
      writable: true,
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    Object.defineProperty(window, "matchMedia", {
      value: original,
      configurable: true,
      writable: true,
    });
  });
});
