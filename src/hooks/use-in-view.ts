"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type InViewResult<T extends Element> = {
  ref: (node: T | null) => void;
  inView: boolean;
};

export function useInView<T extends Element>(
  options: IntersectionObserverInit = { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
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
        if (entry?.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
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
