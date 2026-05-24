import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// jsdom does not implement matchMedia; provide a controllable stub.
function makeMatchMedia(query: string): MediaQueryList {
  const listeners = new Set<EventListener>();
  const mql = {
    matches: false,
    media: query,
    onchange: null,
    addEventListener(_type: string, listener: EventListenerOrEventListenerObject) {
      listeners.add(listener as EventListener);
    },
    removeEventListener(_type: string, listener: EventListenerOrEventListenerObject) {
      listeners.delete(listener as EventListener);
    },
    dispatchEvent(event: Event) {
      listeners.forEach((l) => l(event));
      return true;
    },
    addListener() {},
    removeListener() {},
  };
  return mql as unknown as MediaQueryList;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => makeMatchMedia(query)),
});

// IntersectionObserver stub: triggers callback on observe to keep tests deterministic.
class MockIntersectionObserver implements IntersectionObserver {
  public root: Element | Document | null = null;
  public rootMargin = "";
  public thresholds: ReadonlyArray<number> = [];
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element): void {
    this.callback(
      [
        {
          isIntersecting: true,
          intersectionRatio: 1,
          target,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: 0,
        } as IntersectionObserverEntry,
      ],
      this,
    );
  }

  unobserve(): void {
    // no-op
  }

  disconnect(): void {
    // no-op
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});
