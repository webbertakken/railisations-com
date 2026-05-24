"use client";

import { useReportWebVitals } from "next/web-vitals";

type Metric = {
  id: string;
  name: string;
  value: number;
  rating?: string;
  delta: number;
};

export function WebVitals() {
  useReportWebVitals((metric) => {
    const m = metric as Metric;
    console.info("[web-vital]", {
      name: m.name,
      value: m.value,
      rating: m.rating,
      delta: m.delta,
      id: m.id,
    });
  });
  return null;
}
