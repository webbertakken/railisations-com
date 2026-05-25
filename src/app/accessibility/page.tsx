import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Accessibility | Railisations",
  description:
    "How Railisations works for keyboard users, screen readers, and people who prefer reduced motion.",
};

export default function AccessibilityPage() {
  return (
    <LegalLayout title="Accessibility" lastUpdated="May 2026">
      <p>
        Railisations is built to be usable by everyone. Here&apos;s how, in plain language.
      </p>

      <h2>Standards</h2>
      <p>
        We aim for <strong>WCAG 2.2 AA</strong> across colour contrast, page structure,
        and interaction. If you find a place where the site falls short, please tell us.
      </p>

      <h2>Keyboard</h2>
      <p>
        Every interactive element is reachable with <strong>Tab</strong> and{" "}
        <strong>Shift + Tab</strong>. Press <strong>Enter</strong> to follow a link.
      </p>
      <ul>
        <li>
          <strong>Cmd + K</strong> (or <strong>Ctrl + K</strong>) opens search.
        </li>
        <li>
          <strong>↑</strong> and <strong>↓</strong> move between search results.
        </li>
        <li>
          <strong>Enter</strong> jumps to the selected lesson.
        </li>
        <li>
          <strong>Esc</strong> closes search.
        </li>
      </ul>

      <h2>Screen readers</h2>
      <p>
        Headings, landmarks, and ARIA labels are used so screen readers can describe the
        page in a natural way. The timeline is announced as a list; each lesson is its own
        article with a clear heading and date.
      </p>

      <h2>Motion</h2>
      <p>
        If your operating system has &ldquo;reduce motion&rdquo; enabled, we honour it.
        Cards no longer slide or fade, the gear stops spinning, and the spine renders
        already extended.
      </p>

      <h2>Dark by default</h2>
      <p>
        The site renders in dark mode to be comfortable on OLED screens and at night.
        Colour contrast meets WCAG AA against the deep charcoal background.
      </p>

      <h2>Found a problem?</h2>
      <p>
        Write to{" "}
        <a href="mailto:hello@railisations.com">hello@railisations.com</a>{" "}
        with a short description (and a screenshot if you can) and we&apos;ll fix it as
        soon as we can.
      </p>
    </LegalLayout>
  );
}
