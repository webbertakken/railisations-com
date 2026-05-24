import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useInView } from "./use-in-view";

type Cb = (entries: Array<{ isIntersecting: boolean; target: Element }>) => void;

function makeObserverCtor(opts: {
  capture?: (cb: Cb) => void;
  observe?: () => void;
  unobserve?: () => void;
  disconnect?: () => void;
}) {
  return class FakeObserver {
    root = null;
    rootMargin = "";
    thresholds: number[] = [];
    constructor(cb: Cb) {
      opts.capture?.(cb);
    }
    observe(): void {
      opts.observe?.();
    }
    unobserve(): void {
      opts.unobserve?.();
    }
    disconnect(): void {
      opts.disconnect?.();
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useInView", () => {
  it("flips to true when the observer fires an intersecting entry, then unobserves", () => {
    let cb: Cb = () => {};
    const unobserve = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      makeObserverCtor({ capture: (c) => (cb = c), unobserve }),
    );

    const { result } = renderHook(() => useInView<HTMLDivElement>());
    const div = document.createElement("div");
    act(() => {
      result.current.ref(div);
    });

    expect(result.current.inView).toBe(false);

    act(() => {
      cb([{ isIntersecting: true, target: div }]);
    });

    expect(result.current.inView).toBe(true);
    expect(unobserve).toHaveBeenCalledTimes(1);
  });

  it("does not flip while the entry is not intersecting", () => {
    let cb: Cb = () => {};
    vi.stubGlobal("IntersectionObserver", makeObserverCtor({ capture: (c) => (cb = c) }));

    const { result } = renderHook(() => useInView<HTMLDivElement>());
    act(() => {
      result.current.ref(document.createElement("div"));
    });

    act(() => {
      cb([{ isIntersecting: false, target: document.createElement("div") }]);
    });

    expect(result.current.inView).toBe(false);
  });

  it("returns inView=true synchronously when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { result } = renderHook(() => useInView<HTMLDivElement>());
    act(() => {
      result.current.ref(document.createElement("div"));
    });
    expect(result.current.inView).toBe(true);
  });

  it("disconnects the observer on unmount", () => {
    const disconnect = vi.fn();
    vi.stubGlobal("IntersectionObserver", makeObserverCtor({ disconnect }));
    const { result, unmount } = renderHook(() => useInView<HTMLDivElement>());
    act(() => {
      result.current.ref(document.createElement("div"));
    });
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("swaps the observer when a new node is attached to the same ref", () => {
    const disconnect = vi.fn();
    vi.stubGlobal("IntersectionObserver", makeObserverCtor({ disconnect }));
    const { result } = renderHook(() => useInView<HTMLDivElement>());
    act(() => {
      result.current.ref(document.createElement("div"));
    });
    act(() => {
      result.current.ref(document.createElement("div"));
    });
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("clears the observer when ref is called with null", () => {
    vi.stubGlobal("IntersectionObserver", makeObserverCtor({}));
    const { result } = renderHook(() => useInView<HTMLDivElement>());
    act(() => {
      result.current.ref(document.createElement("div"));
    });
    act(() => {
      result.current.ref(null);
    });
    expect(result.current.inView).toBe(false);
  });
});
