import { vi } from "vitest";

/** Stand-in for the App Router that `useRouter()` returns under jsdom. */
export const appRouter = {
  push: vi.fn<(href: string) => void>(),
};
