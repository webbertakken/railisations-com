import { renderHook } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { useMounted } from "./use-mounted";

function MountedProbe() {
  return useMounted() ? "client" : "server";
}

describe("useMounted", () => {
  it("returns true once mounted on the client", () => {
    const { result } = renderHook(() => useMounted());
    expect(result.current).toBe(true);
  });

  it("returns false during server-side rendering", () => {
    expect(renderToString(<MountedProbe />)).toBe("server");
  });
});
