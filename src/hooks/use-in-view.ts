"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type InViewResult<T extends Element> = {
  ref: (node: T | null) => void;
  inView: boolean;
};

/**
 * Bidirectional in-view observer. `inView` flips true when the target
 * intersects the viewport and back to false when it leaves, so callers
 * can drive enter/exit animations without a one-shot latch.
 */
export function useInView<T extends Element>(
  options: IntersectionObserverInit = { threshold: 0.15, rootMargin: "0px" },
): InViewResult<T> {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<T | null>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(
    () => () => {
      observerRef.current?.disconnect();
    },
    [],
  );

  const ref = useCallback(
    (node: T | null) => {
      targetRef.current = node;
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!node) {
        return;
      }

      if (typeof IntersectionObserver === "undefined") {
        setInView(true);
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        const entry = entries.find((e) => e.target === node) ?? entries[0];
        if (entry) setInView(entry.isIntersecting);
      }, options);

      observer.observe(node);
      observerRef.current = observer;
    },
    // We intentionally do not depend on options identity; callers pass a stable literal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { ref, inView };
}
