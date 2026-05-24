"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * `true` after the first client-side render, `false` during SSR.
 * Built on `useSyncExternalStore` so React 19's lint rule for
 * "no setState in effect" stays clean while preserving the
 * SSR-vs-client distinction we need to gate `from` animations.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
